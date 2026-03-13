import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreateGig = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [venueName, setVenueName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [date, setDate] = useState("");
  const [guaranteeAmount, setGuaranteeAmount] = useState("0");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("pending");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contractUrl, setContractUrl] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !venueName.trim() || !date) {
      toast({
        title: "Missing information",
        description: "Title, venue, and performance date are required.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }
      if (!user) {
        throw new Error("Authentication is required.");
      }

      let venueId: string | null = null;
      const trimmedCity = city.trim();
      const trimmedState = state.trim();

      let existingVenueBuilder = supabase.from("venues").select("id").eq("name", venueName.trim()).limit(1);
      existingVenueBuilder = trimmedCity ? existingVenueBuilder.eq("city", trimmedCity) : existingVenueBuilder.is("city", null);
      existingVenueBuilder = trimmedState ? existingVenueBuilder.eq("state", trimmedState) : existingVenueBuilder.is("state", null);
      const existingVenueQuery = await existingVenueBuilder.maybeSingle();

      if (existingVenueQuery.error && existingVenueQuery.error.code !== "PGRST116") {
        throw existingVenueQuery.error;
      }

      if (existingVenueQuery.data?.id) {
        venueId = existingVenueQuery.data.id;
        await supabase
          .from("venues")
          .update({
            capacity: capacity ? Number(capacity) : null,
            contact_name: contactName.trim() || null,
            contact_email: contactEmail.trim() || null,
          })
          .eq("id", venueId);
      } else {
        const { data: venue, error: venueError } = await supabase
          .from("venues")
          .insert({
            name: venueName.trim(),
            city: trimmedCity || null,
            state: trimmedState || null,
            capacity: capacity ? Number(capacity) : null,
            contact_name: contactName.trim() || null,
            contact_email: contactEmail.trim() || null,
          })
          .select("id")
          .single();

        if (venueError || !venue) {
          throw venueError ?? new Error("The venue could not be created.");
        }
        venueId = venue.id;
      }

      const { data: gig, error: gigError } = await supabase
        .from("gigs")
        .insert({
          user_id: user.id,
          title: title.trim(),
          date,
          status,
          venue_id: venueId,
          guarantee_amount: Number(guaranteeAmount || 0),
          capacity: capacity ? Number(capacity) : null,
          contract_url: contractUrl.trim() || null,
          notes: notes.trim() || null,
        })
        .select("id")
        .single();

      if (gigError || !gig) {
        throw gigError ?? new Error("The gig could not be created.");
      }

      const bookingPayload = {
        user_id: user.id,
        gig_id: gig.id,
        venue_name: venueName.trim(),
        venue_city: trimmedCity || null,
        venue_state: trimmedState || null,
        venue_capacity: capacity ? Number(capacity) : null,
        venue_contact_email: contactEmail.trim() || null,
        event_date: date.slice(0, 10),
        event_time: date.includes("T") ? date.split("T")[1] : null,
        offer_amount: Number(guaranteeAmount || 0),
        contract_url: contractUrl.trim() || null,
        status,
        workflow_stage: status === "confirmed" ? "contract" : "offer",
        metadata: { source: "create_gig_form" },
      };

      const { error: bookingError } = await supabase.from("venue_bookings").insert(bookingPayload as never);
      if (bookingError) {
        throw bookingError;
      }

      if (contactName.trim() || contactEmail.trim()) {
        const { data: contact } = await supabase
          .from("tour_contacts")
          .insert({
            user_id: user.id,
            name: contactName.trim() || `${venueName.trim()} Contact`,
            company: venueName.trim(),
            role: "Venue Manager",
            email: contactEmail.trim() || null,
            tags: ["venue", "touring"],
            notes: notes.trim() || null,
          })
          .select("id")
          .single();

        if (contact?.id && status !== "confirmed") {
          await supabase.from("contact_tasks").insert({
            creator_id: user.id,
            contact_id: contact.id,
            venue_id: venueId,
            title: `Follow up on ${title.trim()}`,
            status: "open",
            due_at: new Date(date).toISOString(),
            metadata: { gig_id: gig.id },
          });
        }
      }

      await supabase.from("gig_settlements").insert({
        creator_id: user.id,
        gig_id: gig.id,
        gross_amount: Number(guaranteeAmount || 0),
        expenses_amount: 0,
        net_amount: Number(guaranteeAmount || 0),
        status: "draft",
        metadata: { source: "create_gig_form" },
      });

      toast({
        title: "Gig created",
        description: "The venue, booking, and settlement records were created successfully.",
      });
      navigate("/event-toolkit/gigs");
    } catch (error) {
      toast({
        title: "Gig creation failed",
        description: error instanceof Error ? error.message : "The gig could not be created.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div className="max-w-4xl space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate("/event-toolkit/gigs")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gigs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Gig</h1>
            <p className="text-muted-foreground">This creates the gig plus the linked venue, booking workflow, and draft settlement records.</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Card className="border-border/50 bg-background/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Performance Details</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Gig Title</Label>
                <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Late Night Set at Blue Note" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue Name</Label>
                <Input id="venue" value={venueName} onChange={(event) => setVenueName(event.target.value)} placeholder="Blue Note" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="date" type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(event) => setCity(event.target.value)} placeholder="New York" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={state} onChange={(event) => setState(event.target.value)} placeholder="NY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guarantee">Guarantee Amount</Label>
                <Input id="guarantee" type="number" min="0" value={guaranteeAmount} onChange={(event) => setGuaranteeAmount(event.target.value)} placeholder="2500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" min="0" value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="300" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Workflow Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="tentative">Tentative</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-url">Contract URL</Label>
                <Input id="contract-url" value={contractUrl} onChange={(event) => setContractUrl(event.target.value)} placeholder="https://..." />
              </div>
            </div>
          </Card>

          <Card className="border-border/50 bg-background/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Venue Contact</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input id="contact-name" value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Jane Booker" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="jane@venue.com" />
              </div>
            </div>
          </Card>

          <Card className="border-border/50 bg-background/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Notes</h3>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Hospitality notes, technical rider reminders, routing context..." rows={5} />
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Gig"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/event-toolkit/gigs")}>
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateGig;

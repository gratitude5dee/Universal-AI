import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, DollarSign, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: {
    id: string;
    name: string;
    location?: string;
    capacity?: number;
    contactEmail?: string;
  };
  onSuccess?: () => void;
}

export const OfferDialog: React.FC<OfferDialogProps> = ({
  open,
  onOpenChange,
  venue,
  onSuccess
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '',
    offerAmount: '',
    customMessage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to send an offer",
          variant: "destructive"
        });
        return;
      }

      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('venue_bookings')
        .insert({
          user_id: user.id,
          venue_name: venue.name,
          venue_location: venue.location || '',
          venue_capacity: venue.capacity || 0,
          venue_contact_email: venue.contactEmail || '',
          status: 'new',
          workflow_stage: 'offer',
          offer_amount: parseFloat(formData.offerAmount),
          event_date: formData.eventDate,
          event_time: formData.eventTime,
          offer_sent_at: new Date().toISOString()
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Generate email using AI
      const { data: emailData, error: emailError } = await supabase.functions.invoke(
        'generate-booking-email',
        {
          body: {
            emailType: 'offer',
            bookingDetails: {
              artistName: user.email?.split('@')[0] || 'Artist',
              venueName: venue.name,
              eventDate: formData.eventDate,
              eventTime: formData.eventTime,
              offerAmount: formData.offerAmount,
              venueContactEmail: venue.contactEmail || 'venue@example.com'
            },
            customMessage: formData.customMessage
          }
        }
      );

      if (emailError) {
        console.error('Email generation error:', emailError);
        toast({
          title: "Offer created",
          description: "Booking created but email generation failed. You can send it manually later.",
          variant: "default"
        });
      } else {
        // Save email communication record
        await supabase.from('booking_communications').insert({
          booking_id: booking.id,
          user_id: user.id,
          communication_type: 'email',
          direction: 'sent',
          subject: emailData.subject,
          body: emailData.body,
          status: 'draft'
        });

        toast({
          title: "Offer sent!",
          description: `Your booking offer to ${venue.name} has been created and email drafted.`,
        });
      }

      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        eventDate: '',
        eventTime: '',
        offerAmount: '',
        customMessage: ''
      });

    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Send Booking Offer
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send a professional booking offer to {venue.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Event Date
              </Label>
              <Input
                id="eventDate"
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime" className="text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Event Time
              </Label>
              <Input
                id="eventTime"
                type="time"
                required
                value={formData.eventTime}
                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          {/* Offer Amount */}
          <div className="space-y-2">
            <Label htmlFor="offerAmount" className="text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Offer Amount
            </Label>
            <Input
              id="offerAmount"
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="2500.00"
              value={formData.offerAmount}
              onChange={(e) => setFormData({ ...formData, offerAmount: e.target.value })}
              className="bg-background border-border text-foreground"
            />
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="customMessage" className="text-foreground">
              Custom Message (Optional)
            </Label>
            <Textarea
              id="customMessage"
              placeholder="Add any specific details or requirements..."
              rows={4}
              value={formData.customMessage}
              onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              className="bg-background border-border text-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground">
              AI will generate a professional email including your message
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Offer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

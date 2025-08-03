import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";

const CreateGig = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/event-toolkit/gigs")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gigs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Gig</h1>
            <p className="text-muted-foreground">Add details for your upcoming performance</p>
          </div>
        </div>

        <form className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue Name</Label>
                <Input id="venue" placeholder="Enter venue name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, State" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="date" type="datetime-local" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input id="duration" type="number" placeholder="2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Performance Fee</Label>
                <Input id="fee" type="number" placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Music Genre</Label>
                <Input id="genre" placeholder="Electronic, House, etc." />
              </div>
            </div>
          </Card>

          {/* Status & Contact */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Status & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-status">Payment Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Main Contact</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add-new">+ Add New Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract">Contract Signed</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Additional Notes */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Additional Notes</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tech-rider">Technical Rider</Label>
                <Textarea id="tech-rider" placeholder="Sound system requirements, lighting setup, etc." rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea id="notes" placeholder="Any additional notes or reminders..." rows={3} />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Create Gig
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/event-toolkit/gigs")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateGig;
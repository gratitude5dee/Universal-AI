import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Sparkles, Send, Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  bookingDetails: {
    venueName: string;
    venueContactEmail?: string;
    offerAmount?: number;
    eventDate?: string;
    eventTime?: string;
  };
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  open,
  onOpenChange,
  bookingId,
  bookingDetails
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailData, setEmailData] = useState({
    to: bookingDetails.venueContactEmail || '',
    subject: '',
    body: ''
  });
  const [emailType, setEmailType] = useState<string>('offer');

  const generateEmail = async () => {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke(
        'generate-booking-email',
        {
          body: {
            emailType,
            bookingDetails: {
              artistName: user.email?.split('@')[0] || 'Artist',
              venueName: bookingDetails.venueName,
              eventDate: bookingDetails.eventDate,
              eventTime: bookingDetails.eventTime,
              offerAmount: bookingDetails.offerAmount,
              venueContactEmail: bookingDetails.venueContactEmail
            }
          }
        }
      );

      if (error) throw error;

      setEmailData({
        to: bookingDetails.venueContactEmail || '',
        subject: data.subject,
        body: data.body
      });

      toast({
        title: "Email generated!",
        description: "AI has created a professional email for you. Review and edit as needed.",
      });

    } catch (error) {
      console.error('Error generating email:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const fullEmail = `To: ${emailData.to}\nSubject: ${emailData.subject}\n\n${emailData.body}`;
    await navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard",
    });
  };

  const handleSaveEmail = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Save email to communications
      const { error } = await supabase
        .from('booking_communications')
        .insert({
          booking_id: bookingId,
          user_id: user.id,
          communication_type: 'email',
          direction: 'sent',
          subject: emailData.subject,
          body: emailData.body,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Email saved!",
        description: "Email saved to your booking communications. Copy and send it when ready.",
      });

      onOpenChange(false);

    } catch (error) {
      console.error('Error saving email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Email Composer
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Generate and customize professional booking emails with AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Type Selector */}
          <div className="space-y-2">
            <Label className="text-foreground">Email Template</Label>
            <div className="flex gap-2">
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger className="flex-1 bg-background border-border text-foreground">
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="offer">Initial Offer</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="contract_reminder">Contract Reminder</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="thank_you">Thank You</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={generateEmail}
                disabled={generating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Email Fields */}
          <div className="space-y-2">
            <Label htmlFor="to" className="text-foreground">To</Label>
            <Input
              id="to"
              type="email"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              placeholder="venue@example.com"
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-foreground">Subject</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              placeholder="Booking Request - [Your Event]"
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body" className="text-foreground">Message</Label>
            <Textarea
              id="body"
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              placeholder="Email body will appear here after generation..."
              rows={12}
              className="bg-background border-border text-foreground font-mono text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || generating}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyToClipboard}
              disabled={!emailData.body || loading || generating}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <Button
              onClick={handleSaveEmail}
              disabled={!emailData.body || loading || generating}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Save Email
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Email will be saved as draft. Copy and send through your preferred email client.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

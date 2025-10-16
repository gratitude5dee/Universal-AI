import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Sparkles, Send, Loader2, Copy, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GigEmailComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gigId: string;
  gigDetails: {
    title: string;
    venue_id?: string;
    date: string;
    guarantee_amount?: number;
    notes?: string;
  };
}

export const GigEmailComposer: React.FC<GigEmailComposerProps> = ({
  open,
  onOpenChange,
  gigId,
  gigDetails
}) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [emailType, setEmailType] = useState<string>('confirmation');

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
              venueName: gigDetails.title,
              eventDate: gigDetails.date,
              eventTime: new Date(gigDetails.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              offerAmount: gigDetails.guarantee_amount,
              venueContactEmail: ''
            }
          }
        }
      );

      if (error) throw error;

      setEmailData({
        to: '',
        subject: data.subject,
        body: data.body
      });

      toast({
        title: "Email generated!",
        description: "AI has created a professional email. Review and edit as needed.",
      });

    } catch (error: any) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-blue-darker border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5 text-blue-primary" />
            Email Composer
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Generate professional emails with AI for your gig communications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Type Selector */}
          <div className="space-y-2">
            <Label className="text-white">Email Type</Label>
            <Select value={emailType} onValueChange={setEmailType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-blue-darker border-white/20">
                <SelectItem value="confirmation">Confirmation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="thank-you">Thank You</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          {!emailData.body && (
            <Button
              onClick={generateEmail}
              disabled={generating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Email with AI
                </>
              )}
            </Button>
          )}

          {/* Email Form */}
          {emailData.body && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">To</Label>
                <Input
                  value={emailData.to}
                  onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  placeholder="venue@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Subject</Label>
                <Input
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Message</Label>
                <Textarea
                  value={emailData.body}
                  onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  rows={12}
                  className="bg-white/10 border-white/20 text-white font-mono text-sm"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCopyToClipboard}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
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
                  onClick={() => {
                    setEmailData({ to: '', subject: '', body: '' });
                    setEmailType('confirmation');
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

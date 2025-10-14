import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Sparkles, Download, Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContractGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  bookingDetails: {
    venueName: string;
    venueAddress?: string;
    venueContactEmail?: string;
    eventDate?: string;
    eventTime?: string;
    offerAmount?: number;
  };
}

export const ContractGenerator: React.FC<ContractGeneratorProps> = ({
  open,
  onOpenChange,
  bookingId,
  bookingDetails
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contractText, setContractText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateContract = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-contract', {
        body: {
          bookingDetails: {
            artistName: user.email?.split('@')[0] || 'Artist',
            artistEmail: user.email,
            venueName: bookingDetails.venueName,
            venueAddress: bookingDetails.venueAddress,
            venueContactEmail: bookingDetails.venueContactEmail,
            eventDate: bookingDetails.eventDate,
            eventTime: bookingDetails.eventTime,
            offerAmount: bookingDetails.offerAmount,
            duration: '2 hours',
            paymentTerms: '50% deposit upon signing, 50% on day of performance'
          }
        }
      });

      if (error) throw error;

      setContractText(data.contractText);

      // Update booking status
      await supabase
        .from('venue_bookings')
        .update({ 
          status: 'contracted',
          workflow_stage: 'contract',
          contract_url: 'Generated - awaiting signature'
        })
        .eq('id', bookingId);

      toast({
        title: "Contract generated!",
        description: "Review the contract and download when ready.",
      });

    } catch (error) {
      console.error('Error generating contract:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Contract copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-${bookingDetails.venueName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Contract saved to your downloads",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Contract Generator
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            AI-generated performance contract for {bookingDetails.venueName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!contractText ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <FileText className="h-16 w-16 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-center max-w-md">
                Generate a professional performance contract with all the necessary legal terms and conditions.
              </p>
              <Button
                onClick={generateContract}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Contract...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Contract with AI
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              {/* Contract Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Contract Preview</h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  rows={20}
                  className="bg-background border-border text-foreground font-mono text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Review and edit the contract as needed. Download and send for e-signature.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setContractText('')}
                >
                  Generate New
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

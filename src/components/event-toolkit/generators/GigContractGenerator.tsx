import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Sparkles, Download, Loader2, Copy, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GigContractGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gigId: string;
  gigDetails: {
    title: string;
    date: string;
    guarantee_amount?: number;
    capacity?: number;
    notes?: string;
  };
}

export const GigContractGenerator: React.FC<GigContractGeneratorProps> = ({
  open,
  onOpenChange,
  gigId,
  gigDetails
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
            venueName: gigDetails.title,
            venueAddress: 'To be provided',
            venueContactEmail: '',
            eventDate: new Date(gigDetails.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            eventTime: new Date(gigDetails.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            offerAmount: gigDetails.guarantee_amount || 2500,
            duration: '2 hours',
            paymentTerms: '50% deposit upon signing, 50% on day of performance'
          }
        }
      });

      if (error) throw error;

      setContractText(data.contractText);

      // Update gig status to contracted
      await supabase
        .from('gigs')
        .update({ 
          status: 'contracted',
          contract_url: 'Generated - awaiting signature'
        })
        .eq('id', gigId);

      toast({
        title: "Contract generated!",
        description: "Review the contract and download when ready.",
      });

    } catch (error: any) {
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
    const link = document.createElement('a');
    link.href = url;
    link.download = `contract-${gigDetails.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Contract saved to your downloads folder",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-blue-darker border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-cyan-400" />
            Contract Generator
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Generate a professional performance contract with AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!contractText ? (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-3">Contract Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Venue/Event:</span>
                    <span className="text-white">{gigDetails.title}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Date:</span>
                    <span className="text-white">
                      {new Date(gigDetails.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {gigDetails.guarantee_amount && (
                    <div className="flex justify-between text-white/70">
                      <span>Guarantee Amount:</span>
                      <span className="text-white">${gigDetails.guarantee_amount.toLocaleString()}</span>
                    </div>
                  )}
                  {gigDetails.capacity && (
                    <div className="flex justify-between text-white/70">
                      <span>Venue Capacity:</span>
                      <span className="text-white">{gigDetails.capacity}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={generateContract}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Contract with AI...
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  rows={20}
                  className="bg-white/10 border-white/20 text-white font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCopy}
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
                      Copy Contract
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => {
                    setContractText('');
                    setCopied(false);
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  New
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

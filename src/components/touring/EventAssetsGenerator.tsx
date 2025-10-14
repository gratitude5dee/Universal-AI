import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Sparkles, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EventAssetsGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  eventDetails: {
    artistName?: string;
    venueName: string;
    eventDate?: string;
    eventTime?: string;
    genre?: string;
  };
}

export const EventAssetsGenerator: React.FC<EventAssetsGeneratorProps> = ({
  open,
  onOpenChange,
  bookingId,
  eventDetails
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'poster' | 'merch' | 'ticket'>('poster');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const assetDescriptions = {
    poster: 'Create an eye-catching event poster with bold typography and vibrant colors.',
    merch: 'Design a cool t-shirt graphic that fans will love to wear.',
    ticket: 'Generate a professional ticket design with space for event details and QR code.'
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedImageUrl(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-event-asset', {
        body: {
          bookingId,
          assetType: activeTab === 'poster' ? 'poster' : activeTab === 'merch' ? 'merch_design' : 'ticket',
          customPrompt,
          eventDetails: {
            artistName: eventDetails.artistName || 'Artist',
            venueName: eventDetails.venueName,
            eventDate: eventDetails.eventDate || 'TBD',
            eventTime: eventDetails.eventTime || 'TBD',
            genre: eventDetails.genre || 'Music'
          }
        }
      });

      if (error) throw error;

      setGeneratedImageUrl(data.imageUrl);

      toast({
        title: "Asset generated!",
        description: `Your ${activeTab} has been created successfully.`,
      });

    } catch (error) {
      console.error('Error generating asset:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate asset. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `${activeTab}-${eventDetails.venueName.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Downloaded!",
      description: `${activeTab} saved to your downloads`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Image className="h-6 w-6" />
            Event Assets Generator
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create professional posters, merch designs, and tickets with AI
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="poster">Poster</TabsTrigger>
            <TabsTrigger value="merch">Merch</TabsTrigger>
            <TabsTrigger value="ticket">Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="poster" className="space-y-4 mt-6">
            <AssetTab
              type="poster"
              description={assetDescriptions.poster}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              loading={loading}
              generatedImageUrl={generatedImageUrl}
              onGenerate={handleGenerate}
              onDownload={handleDownload}
            />
          </TabsContent>

          <TabsContent value="merch" className="space-y-4 mt-6">
            <AssetTab
              type="merch"
              description={assetDescriptions.merch}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              loading={loading}
              generatedImageUrl={generatedImageUrl}
              onGenerate={handleGenerate}
              onDownload={handleDownload}
            />
          </TabsContent>

          <TabsContent value="ticket" className="space-y-4 mt-6">
            <AssetTab
              type="ticket"
              description={assetDescriptions.ticket}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              loading={loading}
              generatedImageUrl={generatedImageUrl}
              onGenerate={handleGenerate}
              onDownload={handleDownload}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface AssetTabProps {
  type: string;
  description: string;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  loading: boolean;
  generatedImageUrl: string | null;
  onGenerate: () => void;
  onDownload: () => void;
}

const AssetTab: React.FC<AssetTabProps> = ({
  type,
  description,
  customPrompt,
  setCustomPrompt,
  loading,
  generatedImageUrl,
  onGenerate,
  onDownload
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Additional Instructions (Optional)
        </label>
        <Textarea
          placeholder={`Add specific style preferences for your ${type}...`}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={3}
          className="bg-background border-border text-foreground resize-none"
        />
      </div>

      {generatedImageUrl ? (
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border border-border bg-muted">
            <img 
              src={generatedImageUrl} 
              alt={`Generated ${type}`}
              className="w-full h-auto"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              Generate New
            </Button>
            <Button
              onClick={onDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={onGenerate}
          disabled={loading}
          size="lg"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating {type}...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate {type} with AI
            </>
          )}
        </Button>
      )}
    </div>
  );
};

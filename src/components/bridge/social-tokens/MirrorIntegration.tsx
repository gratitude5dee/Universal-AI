import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ExternalLink, Maximize2, Bold, Italic, Heading1, Heading2, Code, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MirrorIntegration = () => {
  const { toast } = useToast();
  const [mintStrategy, setMintStrategy] = useState("free");
  const [royalty, setRoyalty] = useState(5);

  const handlePublish = () => {
    toast({
      title: "Essay published!",
      description: "Your publication is now live on Mirror"
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Status */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center text-2xl">
              ✍️
            </div>
            <div>
              <h3 className="text-xl font-bold text-white text-shadow-sm">yourhandle.mirror.xyz</h3>
              <div className="flex gap-4 text-sm text-white/70 text-shadow-sm mt-1">
                <span>Publications: 24</span>
                <span>Subscribers: 1,847</span>
                <span>Total Mints: 2,456</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Publication
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Disconnect
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">New Publication</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Title</Label>
            <Input
              placeholder="Your Essay Title"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 text-xl font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Subtitle</Label>
            <Input
              placeholder="A compelling subtitle"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Content</Label>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Maximize2 className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
            </div>
            
            <div className="border border-white/20 rounded-lg bg-white/5 overflow-hidden">
              <div className="flex gap-1 p-2 border-b border-white/20 bg-white/5">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Heading1 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Code className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Write your story here... Full Markdown support"
                rows={12}
                className="bg-transparent border-none text-white placeholder:text-white/40 resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Cover Image</Label>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors cursor-pointer">
              <p className="text-white/60 text-shadow-sm">Upload or select from gallery</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Mint Settings */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Mint Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Mint Strategy</Label>
            <Select value={mintStrategy} onValueChange={setMintStrategy}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free Edition (reader support optional)</SelectItem>
                <SelectItem value="paid">Paid Edition (fixed price)</SelectItem>
                <SelectItem value="crowdfund">Crowdfund (funding goal)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mintStrategy === "free" && (
            <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/20">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-white">Supply</Label>
                  <Select defaultValue="open">
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open Edition</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-white">Time Limit</Label>
                  <Select defaultValue="7d">
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Suggested Donation (ETH)</Label>
                <Input
                  type="number"
                  placeholder="0.01"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-white">Royalties: {royalty}%</Label>
            <Slider
              value={[royalty]}
              onValueChange={(value) => setRoyalty(value[0])}
              max={10}
              step={0.5}
              className="py-4"
            />
            <p className="text-sm text-white/50">Percentage earned on secondary sales</p>
          </div>

          <Button onClick={handlePublish} className="w-full bg-gradient-to-r from-black to-gray-700 hover:from-black/90 hover:to-gray-700/90 text-white">
            Publish & Enable Minting
          </Button>
        </div>
      </Card>
    </div>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FarcasterIntegration = () => {
  const { toast } = useToast();
  const [frameType, setFrameType] = useState("mint");

  const handleCast = () => {
    toast({
      title: "Cast published!",
      description: "Your cast with frame is now live on Farcaster"
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Status */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#855DCD] to-[#C28FEF] flex items-center justify-center text-2xl">
              🎭
            </div>
            <div>
              <h3 className="text-xl font-bold text-white text-shadow-sm">@yourhandle</h3>
              <div className="flex gap-4 text-sm text-white/70 text-shadow-sm mt-1">
                <span>FID: 12847</span>
                <span>Followers: 1,256</span>
                <span>Power Badge: ✓</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Warpcast
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Disconnect
            </Button>
          </div>
        </div>
      </Card>

      {/* Create Cast */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Create Cast with Frame</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Cast Text (320 characters)</Label>
            <Textarea
              placeholder="Share your thoughts..."
              rows={3}
              maxLength={320}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Frame Type</Label>
            <Select value={frameType} onValueChange={setFrameType}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mint">Mint Frame</SelectItem>
                <SelectItem value="poll">Poll Frame</SelectItem>
                <SelectItem value="gallery">Gallery Frame</SelectItem>
                <SelectItem value="game">Game Frame</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frameType === "mint" && (
            <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/20">
              <h4 className="font-semibold text-white text-shadow-sm">Mint Frame Settings</h4>
              
              <div className="space-y-2">
                <Label className="text-white">NFT to Mint</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select from your collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunset">Sunset Dreams v2</SelectItem>
                    <SelectItem value="abstract">Abstract Waves</SelectItem>
                    <SelectItem value="portrait">Digital Portrait #42</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Price (ETH on Base)</Label>
                  <Input
                    type="number"
                    placeholder="0.001"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Supply</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                <p className="text-sm text-white/70 mb-2">Frame Preview:</p>
                <div className="aspect-video bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-white/50" />
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-white font-semibold">Sunset Dreams v2</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-[#855DCD] hover:bg-[#6D4AAA]">Mint for 0.001 ETH</Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">View Details</Button>
                  </div>
                  <p className="text-xs text-white/60">47/100 minted • 23 collectors</p>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleCast} className="w-full bg-gradient-to-r from-[#855DCD] to-[#C28FEF] hover:from-[#6D4AAA] hover:to-[#A677D9] text-white">
            Cast with Frame
          </Button>
        </div>
      </Card>

      {/* Performance */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Recent Casts</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <p className="text-white text-shadow-sm">"New collection dropping! Mint below 👇"</p>
            <div className="flex justify-between text-sm text-white/60">
              <span>Impressions: 8,547</span>
              <span>Mints: 67</span>
              <span>Revenue: 0.067 ETH</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

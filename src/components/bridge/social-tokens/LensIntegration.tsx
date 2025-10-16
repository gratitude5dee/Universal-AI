import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const LensIntegration = () => {
  const { toast } = useToast();
  const [connected, setConnected] = useState(true);
  const [collectEnabled, setCollectEnabled] = useState(false);

  const handlePost = () => {
    toast({
      title: "Post created!",
      description: "Your collectible post is now live on Lens Protocol"
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Status */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00501E] to-[#ABFE2C] flex items-center justify-center text-2xl">
              🌿
            </div>
            <div>
              <h3 className="text-xl font-bold text-white text-shadow-sm">@yourhandle.lens</h3>
              <div className="flex gap-4 text-sm text-white/70 text-shadow-sm mt-1">
                <span>Followers: 2,847</span>
                <span>Following: 432</span>
                <span>Publications: 156</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Lens
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              {connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Create Post */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Create Collectible Post</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Post Content</Label>
            <Textarea
              placeholder="What's on your mind? Share your thoughts..."
              rows={4}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Attach Media (optional)</Label>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-[#ABFE2C] transition-colors cursor-pointer">
              <p className="text-white/60 text-shadow-sm">Click to upload image or video</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={collectEnabled}
              onCheckedChange={(checked) => setCollectEnabled(checked as boolean)}
              id="enable-collect"
            />
            <Label htmlFor="enable-collect" className="text-white cursor-pointer">Enable collecting</Label>
          </div>

          {collectEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 pl-6 border-l-2 border-[#ABFE2C]/30"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Price (MATIC)</Label>
                  <Input
                    type="number"
                    placeholder="0.01"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Collector Limit</Label>
                  <Input
                    type="number"
                    placeholder="0 = unlimited"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Time Limit</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="followers-only" />
                <Label htmlFor="followers-only" className="text-white cursor-pointer">Followers only</Label>
              </div>
            </motion.div>
          )}

          <Button onClick={handlePost} className="w-full bg-gradient-to-r from-[#00501E] to-[#ABFE2C] hover:from-[#00501E]/90 hover:to-[#ABFE2C]/90 text-white">
            Post & Enable Collect
          </Button>
        </div>
      </Card>

      {/* Recent Posts */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Recent Collectible Posts</h3>
        <div className="space-y-3">
          {[
            { text: "Just dropped my new single! 🎵", collected: 47, revenue: "23Ξ" },
            { text: "Behind the scenes at today's shoot 📸", collected: 89, revenue: "45Ξ" }
          ].map((post, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <p className="text-white text-shadow-sm">"{post.text}"</p>
              <div className="flex justify-between text-sm text-white/60">
                <span>Collected: {post.collected} times</span>
                <span>Revenue: {post.revenue}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Boost Post
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

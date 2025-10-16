import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { PlatformCard } from "../shared/PlatformCard";
import { platforms } from "@/data/bridge/platforms";
import { Platform, PlatformId, ChainId } from "@/types/bridge";
import { X, Upload, Sparkles, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DeploymentProgress } from "./DeploymentProgress";
import { useToast } from "@/hooks/use-toast";

interface MintingWizardProps {
  type: "single" | "collection" | "social";
  onClose: () => void;
}

export const MintingWizard = ({ type, onClose }: MintingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [primaryChain, setPrimaryChain] = useState<ChainId>("ethereum");
  const [showDeployment, setShowDeployment] = useState(false);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "digital-art",
    price: "",
    currency: "ETH" as const,
    royalty: 10
  });

  const togglePlatform = (platformId: PlatformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleDeploy = () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform to deploy to",
        variant: "destructive"
      });
      return;
    }
    setShowDeployment(true);
  };

  if (showDeployment) {
    return <DeploymentProgress platforms={selectedPlatforms} onComplete={onClose} />;
  }

  const totalCost = selectedPlatforms.reduce((sum, platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return sum + (platform?.estimatedCost[primaryChain] || 0);
  }, 0);

  const totalTime = selectedPlatforms.reduce((sum, platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return sum + (platform?.estimatedTime[primaryChain] || 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white text-shadow-sm">
              Create NFT - Step {currentStep} of {totalSteps}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Asset Upload & Metadata</h3>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-[#9b87f5] transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 text-white/50 mx-auto mb-3" />
                      <p className="text-white/70 text-shadow-sm">Drop file here or click to browse</p>
                      <p className="text-sm text-white/50 text-shadow-sm mt-2">JPG, PNG, GIF, MP4, MP3, GLB, SVG • Max 100MB</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Title</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="My Awesome NFT"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Description</Label>
                        <Button variant="ghost" size="sm" className="text-[#9b87f5] hover:text-[#7E69AB]">
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Enhance
                        </Button>
                      </div>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your NFT..."
                        rows={4}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="digital-art">Digital Art</SelectItem>
                          <SelectItem value="music">Music / Audio</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="collectibles">Collectibles</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Attributes & Properties</h3>
                  <p className="text-white/60 text-shadow-sm mb-6">Add attributes to improve discoverability and collection value</p>
                  <div className="text-center py-12 text-white/50">
                    <p>Properties, levels, and stats can be added here</p>
                    <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Suggest Attributes
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Pricing & Supply</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Price</Label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="1.5"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Currency</Label>
                        <Select value={formData.currency} onValueChange={(value: any) => setFormData({ ...formData, currency: value })}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ETH">ETH</SelectItem>
                            <SelectItem value="SOL">SOL</SelectItem>
                            <SelectItem value="MATIC">MATIC</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Creator Royalty: {formData.royalty}%</Label>
                      <Slider
                        value={[formData.royalty]}
                        onValueChange={(value) => setFormData({ ...formData, royalty: value[0] })}
                        max={10}
                        step={0.5}
                        className="py-4"
                      />
                      <p className="text-sm text-white/50 text-shadow-sm">Percentage earned on secondary sales</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white text-shadow-sm">Select Platforms</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlatforms(platforms.map(p => p.id))}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Select All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {platforms.slice(0, 9).map((platform) => (
                      <PlatformCard
                        key={platform.id}
                        platform={platform}
                        selected={selectedPlatforms.includes(platform.id)}
                        onToggle={() => togglePlatform(platform.id)}
                        primaryChain={primaryChain}
                      />
                    ))}
                  </div>

                  <div className="backdrop-blur-md bg-[#9b87f5]/10 border border-[#9b87f5]/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#9b87f5] mt-0.5" />
                      <div>
                        <p className="text-white text-shadow-sm font-medium mb-1">AI Recommendation</p>
                        <p className="text-white/70 text-shadow-sm text-sm">
                          Use Zora on Base for lowest cost ($0.08) and fast finality (30s) vs OpenSea on Ethereum ($2.50)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg">
                    <div className="flex justify-between text-white text-shadow-sm">
                      <span>Total Cost:</span>
                      <span className="font-bold">${totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/70 text-shadow-sm text-sm mt-1">
                      <span>Total Time:</span>
                      <span>~{Math.floor(totalTime / 60)}m {totalTime % 60}s</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div key="step5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Review & Deploy</h3>
                  
                  <div className="space-y-4">
                    <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg p-4">
                      <h4 className="font-semibold text-white text-shadow-sm mb-2">Deployment Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Title:</span>
                          <span className="text-white">{formData.title || "Untitled"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Price:</span>
                          <span className="text-white">{formData.price || "0"} {formData.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Royalty:</span>
                          <span className="text-white">{formData.royalty}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Platforms:</span>
                          <span className="text-white">{selectedPlatforms.length} selected</span>
                        </div>
                      </div>
                    </div>

                    <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-lg p-4">
                      <h4 className="font-semibold text-white text-shadow-sm mb-2">Estimated Costs</h4>
                      <div className="space-y-1 text-sm">
                        {selectedPlatforms.map(platformId => {
                          const platform = platforms.find(p => p.id === platformId);
                          const cost = platform?.estimatedCost[primaryChain] || 0;
                          return (
                            <div key={platformId} className="flex justify-between text-white/70">
                              <span>{platform?.name}:</span>
                              <span>${cost.toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-white">
                          <span>Total:</span>
                          <span>${totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/10 backdrop-blur-md border-t border-white/20 p-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleDeploy}
              className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9b87f5] text-white"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Deploy NFT
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

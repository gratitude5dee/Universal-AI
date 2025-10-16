import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChainSelector } from '../../shared/ChainSelector';
import { PlatformSelector } from '../PlatformSelector';
import { ChainId } from '@/types/on-chain';
import { ArrowRight, ArrowLeft, Rocket } from 'lucide-react';

interface MemeTokenWizardProps {
  onComplete: (config: any) => void;
  onBack: () => void;
}

export const MemeTokenWizard = ({ onComplete, onBack }: MemeTokenWizardProps) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: '',
    symbol: '',
    description: '',
    totalSupply: 1000000,
    selectedChains: [] as ChainId[],
    selectedPlatforms: [] as string[],
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const handleDeploy = () => {
    onComplete(config);
  };

  const isStepValid = () => {
    if (step === 1) return config.name && config.symbol && config.description;
    if (step === 2) return config.selectedChains.length > 0;
    if (step === 3) return config.selectedPlatforms.length > 0;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors ${
                s <= step ? 'bg-studio-accent' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-white/60">Step {step} of 3</span>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Token Details</h3>
              <p className="text-sm text-white/60">Basic information about your meme token</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  placeholder="e.g., Doge Moon Rocket"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  value={config.symbol}
                  onChange={(e) => setConfig({ ...config, symbol: e.target.value.toUpperCase() })}
                  placeholder="e.g., DMR"
                  className="bg-white/5 border-white/10 text-white"
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  placeholder="Tell the community what your token is about..."
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="supply">Total Supply</Label>
                <Input
                  id="supply"
                  type="number"
                  value={config.totalSupply}
                  onChange={(e) => setConfig({ ...config, totalSupply: parseInt(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Select Blockchains</h3>
              <p className="text-sm text-white/60">Choose where to deploy your token</p>
            </div>

            <ChainSelector
              selectedChains={config.selectedChains}
              onToggle={(chainId) => {
                setConfig({
                  ...config,
                  selectedChains: config.selectedChains.includes(chainId)
                    ? config.selectedChains.filter(c => c !== chainId)
                    : [...config.selectedChains, chainId],
                });
              }}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Select Platforms</h3>
              <p className="text-sm text-white/60">Choose launchpads for your token</p>
            </div>

            <PlatformSelector
              selectedPlatforms={config.selectedPlatforms}
              onToggle={(platformId) => {
                setConfig({
                  ...config,
                  selectedPlatforms: config.selectedPlatforms.includes(platformId)
                    ? config.selectedPlatforms.filter(p => p !== platformId)
                    : [...config.selectedPlatforms, platformId],
                });
              }}
            />
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          className="border-white/20 text-white/70"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-studio-accent to-blue-500"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleDeploy}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-studio-accent to-blue-500"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Deploy Token
          </Button>
        )}
      </div>
    </div>
  );
};

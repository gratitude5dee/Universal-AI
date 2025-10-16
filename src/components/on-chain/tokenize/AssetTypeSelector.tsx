import { motion } from 'framer-motion';
import { assetTypes } from '@/data/on-chain/assetTypes';
import { AssetType } from '@/types/on-chain';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AssetTypeSelectorProps {
  onSelect: (assetType: AssetType) => void;
}

export const AssetTypeSelector = ({ onSelect }: AssetTypeSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">What do you want to tokenize?</h2>
        <p className="text-white/70">Select an asset type to start your tokenization journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assetTypes.map((assetType, index) => (
          <motion.button
            key={assetType.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => onSelect(assetType.id)}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md p-6 text-left transition-all hover:border-white/20 hover:from-white/10 hover:to-white/5"
          >
            {/* Recommended badge for social & meme */}
            {(assetType.id === 'social-content' || assetType.id === 'meme-token') && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-gradient-to-r from-studio-accent/20 to-blue-500/20 text-studio-accent border-studio-accent/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="text-4xl">{assetType.icon}</div>
              
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-studio-accent transition-colors">
                  {assetType.name}
                </h3>
                <p className="text-sm text-white/60 line-clamp-2">
                  {assetType.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                    {assetType.complexity} complexity
                  </Badge>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                    {assetType.estimatedCost}
                  </Badge>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-white/50">Best for: {assetType.bestFor}</p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-studio-accent group-hover:translate-x-1 transition-all" />
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-studio-accent/0 via-studio-accent/5 to-studio-accent/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-white/50">
          🔒 All deployments are secured with smart contract audits and best practices
        </p>
      </div>
    </div>
  );
};

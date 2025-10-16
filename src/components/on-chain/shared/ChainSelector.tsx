import { useState } from 'react';
import { motion } from 'framer-motion';
import { chains } from '@/data/on-chain/chains';
import { ChainId } from '@/types/on-chain';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChainSelectorProps {
  selectedChains: ChainId[];
  onToggle: (chainId: ChainId) => void;
  multiSelect?: boolean;
}

export const ChainSelector = ({ selectedChains, onToggle, multiSelect = true }: ChainSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Select Blockchain{multiSelect ? 's' : ''}</h3>
          <p className="text-sm text-white/60">Deploy your asset across multiple chains</p>
        </div>
        {selectedChains.length > 0 && (
          <Badge variant="secondary" className="bg-studio-accent/20 text-studio-accent">
            {selectedChains.length} selected
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {chains.map((chain) => {
          const isSelected = selectedChains.includes(chain.id);
          
          return (
            <motion.button
              key={chain.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onToggle(chain.id)}
              className={cn(
                "relative overflow-hidden rounded-lg border p-4 text-left transition-all",
                isSelected
                  ? "border-studio-accent bg-studio-accent/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="rounded-full bg-studio-accent p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="text-3xl" style={{ color: chain.color }}>
                  {chain.icon}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{chain.name}</h4>
                    <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                      {chain.symbol}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-white/60">
                      <Zap className="w-3 h-3" />
                      <span>${chain.avgGasPrice?.toFixed(2)} gas</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <TrendingUp className="w-3 h-3" />
                      <span>{chain.ecosystemFit}% fit</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-1.5 w-full rounded-full",
                        chain.congestionLevel === 'low' && "bg-green-500/30",
                        chain.congestionLevel === 'medium' && "bg-yellow-500/30",
                        chain.congestionLevel === 'high' && "bg-red-500/30"
                      )}
                    >
                      <div
                        className={cn(
                          "h-full rounded-full",
                          chain.congestionLevel === 'low' && "bg-green-500 w-1/3",
                          chain.congestionLevel === 'medium' && "bg-yellow-500 w-2/3",
                          chain.congestionLevel === 'high' && "bg-red-500 w-full"
                        )}
                      />
                    </div>
                    <span className="text-xs text-white/50 whitespace-nowrap">
                      {chain.congestionLevel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {!multiSelect && selectedChains.length === 0 && (
        <p className="text-center text-sm text-white/50">Please select a blockchain to continue</p>
      )}
    </div>
  );
};

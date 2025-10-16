import { useState } from 'react';
import { motion } from 'framer-motion';
import { platforms, getPlatformsByCategory } from '@/data/on-chain/platforms';
import { Platform, PlatformCategory } from '@/types/on-chain';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onToggle: (platformId: string) => void;
}

const categoryNames: Record<PlatformCategory, string> = {
  'meme-launchpads': 'Meme Coin Launchpads',
  'dao-community': 'DAO & Community',
  'ip-rwa': 'IP & RWA Tokenization',
  'general-ido': 'General Token/IDO',
  'nft-marketplaces': 'NFT Marketplaces',
};

export const PlatformSelector = ({ selectedPlatforms, onToggle }: PlatformSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlatforms = platforms.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: PlatformCategory[] = ['meme-launchpads', 'dao-community', 'ip-rwa', 'general-ido', 'nft-marketplaces'];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Select Launch Platforms</h3>
            <p className="text-sm text-white/60">Deploy to multiple platforms simultaneously</p>
          </div>
          {selectedPlatforms.length > 0 && (
            <div className="text-right">
              <Badge variant="secondary" className="bg-studio-accent/20 text-studio-accent mb-1">
                {selectedPlatforms.length} platforms selected
              </Badge>
              <p className="text-xs text-white/50">
                Combined reach: ~{(selectedPlatforms.length * 250).toLocaleString()}K users
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            type="text"
            placeholder="Search platforms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Recommended Platforms */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-studio-accent" />
          <h4 className="text-sm font-semibold text-white">Recommended for You</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPlatforms.slice(0, 3).map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              selected={selectedPlatforms.includes(platform.id)}
              onToggle={() => onToggle(platform.id)}
            />
          ))}
        </div>
      </div>

      {/* All Platforms by Category */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">All Platforms ({filteredPlatforms.length})</h4>
        <Accordion type="multiple" className="space-y-2">
          {categories.map((category) => {
            const categoryPlatforms = filteredPlatforms.filter(p => p.category === category);
            if (categoryPlatforms.length === 0) return null;

            return (
              <AccordionItem
                key={category}
                value={category}
                className="border border-white/10 rounded-lg bg-white/5 overflow-hidden"
              >
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="text-white font-medium">{categoryNames[category]}</span>
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      {categoryPlatforms.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {categoryPlatforms.map((platform) => (
                      <PlatformCard
                        key={platform.id}
                        platform={platform}
                        selected={selectedPlatforms.includes(platform.id)}
                        onToggle={() => onToggle(platform.id)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {selectedPlatforms.length > 0 && (
        <div className="flex justify-between items-center p-4 rounded-lg bg-studio-accent/10 border border-studio-accent/30">
          <div>
            <p className="text-sm font-medium text-white">Ready to deploy</p>
            <p className="text-xs text-white/60">
              Total estimated fees: ~${(selectedPlatforms.length * 2).toFixed(2)}
            </p>
          </div>
          <Button
            onClick={() => selectedPlatforms.forEach(id => onToggle(id))}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:bg-white/5"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

interface PlatformCardProps {
  platform: Platform;
  selected: boolean;
  onToggle: () => void;
}

const PlatformCard = ({ platform, selected, onToggle }: PlatformCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onToggle}
      className={cn(
        "relative overflow-hidden rounded-lg border p-3 text-left transition-all",
        selected
          ? "border-studio-accent bg-studio-accent/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      )}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="rounded-full bg-studio-accent p-1">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="text-2xl">{platform.icon}</div>
        
        <div className="flex-1 space-y-2 min-w-0">
          <div>
            <h5 className="font-semibold text-white text-sm">{platform.name}</h5>
            <p className="text-xs text-white/60 line-clamp-1">{platform.description}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {platform.chains.map((chain) => (
              <Badge key={chain} variant="outline" className="text-xs border-white/20 text-white/60 capitalize">
                {chain}
              </Badge>
            ))}
          </div>

          {platform.volume && (
            <p className="text-xs text-white/50">{platform.volume} volume</p>
          )}

          {platform.fees && (
            <p className="text-xs text-white/50">
              Fees: {platform.fees.deployment || platform.fees.transaction || platform.fees.listing}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
};

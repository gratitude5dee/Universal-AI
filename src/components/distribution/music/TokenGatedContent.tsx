
import React, { useState } from "react";
import { Lock, Unlock, Coins, Users, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { useWeb3 } from "@/context/Web3Context";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { getOwnedNFTs as getOwnedErc721 } from "thirdweb/extensions/erc721";
import { evaluateGate } from "@/lib/web3/gating";

interface GatedContent {
  id: string;
  title: string;
  type: 'track' | 'video' | 'experience';
  description: string;
  requirement: {
    tokenType: string;
    amount: number;
    condition: 'owns' | 'holds' | 'staked';
  };
  unlocked: boolean;
  premium: boolean;
}

const mockGatedContent: GatedContent[] = [
  {
    id: '1',
    title: 'Unreleased Track: "Ethereum Dreams"',
    type: 'track',
    description: 'Exclusive unreleased track available only to $WZRD token holders',
    requirement: {
      tokenType: 'WZRD',
      amount: 100,
      condition: 'holds'
    },
    unlocked: true,
    premium: true
  },
  {
    id: '2',
    title: 'Behind the Scenes: Studio Sessions',
    type: 'video',
    description: 'Documentary footage from recording sessions',
    requirement: {
      tokenType: 'WZRD NFT',
      amount: 1,
      condition: 'owns'
    },
    unlocked: false,
    premium: true
  },
  {
    id: '3',
    title: 'Virtual Concert Experience',
    type: 'experience',
    description: 'Interactive metaverse concert with exclusive NFT drops',
    requirement: {
      tokenType: 'WZRD',
      amount: 500,
      condition: 'staked'
    },
    unlocked: true,
    premium: true
  }
];

export const TokenGatedContent = () => {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const { address, chainId, tokenBalances } = useEvmWallet();
  const { client, config } = useWeb3();
  const [hasNft, setHasNft] = useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!address) {
        setHasNft(false);
        return;
      }
      // Check ERC721 ownership (best-effort) on the current chain only.
      if (!chainId) return;
      const nftCollection = config.contractsByChainId?.[chainId]?.nftCollection;
      if (!nftCollection) {
        setHasNft(null);
        return;
      }
      try {
        const chain = defineChain(chainId as any) as any;
        const contract = getContract({ client, chain, address: nftCollection }) as any;
        const owned = await getOwnedErc721({ contract, owner: address } as any);
        if (!cancelled) setHasNft((owned?.length ?? 0) > 0);
      } catch {
        if (!cancelled) setHasNft(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [address, chainId, client, config.contractsByChainId]);

  const getRequirementText = (requirement: GatedContent['requirement']) => {
    const action = requirement.condition === 'owns' ? 'Own' : 
                  requirement.condition === 'holds' ? 'Hold' : 'Stake';
    return `${action} ${requirement.amount} ${requirement.tokenType}`;
  };

  const getTypeIcon = (type: GatedContent['type']) => {
    switch (type) {
      case 'track': return <Play className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'experience': return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center mb-6">
        <Lock className="w-6 h-6 mr-3 text-yellow-400" />
        <div>
          <h3 className="text-xl font-semibold text-white">Token-Gated Content</h3>
          <p className="text-sm text-white/70">Exclusive content for token holders</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockGatedContent.map((content) => (
          (() => {
            const unlocked = evaluateGate(content.requirement, {
              addressConnected: !!address,
              wzrdBalance: Number(tokenBalances.wzrd?.formatted ?? "0"),
              usdcBalance: Number(tokenBalances.usdc?.formatted ?? "0"),
              hasAnyNft: hasNft,
            });

            return (
          <Card 
            key={content.id}
            className={`p-4 border transition-all cursor-pointer ${
              unlocked 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-white/5 border-white/10'
            } hover:bg-white/10`}
            onClick={() => setSelectedContent(content.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(content.type)}
                  <h4 className="font-medium text-white">{content.title}</h4>
                  {content.premium && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/70 mb-3">{content.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Coins className="w-3 h-3 text-studio-accent" />
                    <span className="text-white/60">Requirement:</span>
                    <span className="text-studio-accent font-medium">
                      {getRequirementText(content.requirement)}
                    </span>
                  </div>
                  
                  {unlocked ? (
                    <div className="flex items-center gap-2">
                      <Unlock className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">Unlocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {unlocked && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Button size="sm" className="bg-studio-accent hover:bg-studio-accent/80">
                    <Play className="w-3 h-3 mr-1" />
                    Access
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {!unlocked && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Get {content.requirement.tokenType} Tokens
                </Button>
              </div>
            )}
          </Card>
            );
          })()
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="font-medium text-blue-300 mb-2">Community Benefits</h4>
        <ul className="text-sm text-white/70 space-y-1">
          <li>• Exclusive track releases before public launch</li>
          <li>• Behind-the-scenes content and studio access</li>
          <li>• Virtual concert experiences and NFT drops</li>
          <li>• Direct artist interaction and governance voting</li>
        </ul>
      </div>
    </div>
  );
};

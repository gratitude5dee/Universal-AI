import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ChainBadge } from "../shared/ChainBadge";
import { ArrowRight, AlertTriangle, ExternalLink, Check } from "lucide-react";
import { ChainId } from "@/types/bridge";
import { chains } from "@/data/bridge/chains";
import { mockNFTs } from "@/data/bridge/mockNFTs";
import { useToast } from "@/hooks/use-toast";

export const EnhancedBridges = () => {
  const { toast } = useToast();
  const [assetType, setAssetType] = useState<"nft" | "token" | "native">("nft");
  const [fromChain, setFromChain] = useState<ChainId>("solana");
  const [toChain, setToChain] = useState<ChainId>("ethereum");
  const [selectedNFT, setSelectedNFT] = useState("");

  const handleBridge = () => {
    toast({
      title: "Bridge initiated",
      description: "Your asset transfer has started. This may take 5-10 minutes."
    });
  };

  const estimatedFees = {
    wormhole: 3.50,
    sourceGas: 0.02,
    destGas: 15.00
  };

  const totalFees = Object.values(estimatedFees).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white text-shadow-sm mb-2">Cross-Chain Bridges</h2>
        <p className="text-white/70 text-shadow-sm">Move assets seamlessly between blockchains</p>
      </div>

      {/* Chain Balances */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { chain: "solana" as ChainId, balance: "145.8 SOL", nfts: 12, usd: "$18,225" },
          { chain: "ethereum" as ChainId, balance: "2.45 ETH", nfts: 8, usd: "$4,018" },
          { chain: "base" as ChainId, balance: "1.23 ETH", nfts: 24, usd: "$2,017" },
          { chain: "polygon" as ChainId, balance: "450 MATIC", nfts: 15, usd: "$382" }
        ].map(({ chain, balance, nfts, usd }) => (
          <Card key={chain} className="backdrop-blur-md bg-white/10 border border-white/20 p-4 shadow-card-glow">
            <ChainBadge chain={chain} size="lg" />
            <div className="mt-3 space-y-1">
              <p className="text-xl font-bold text-white text-shadow-sm">{balance}</p>
              <p className="text-sm text-white/60 text-shadow-sm">{usd}</p>
              <p className="text-xs text-white/50 text-shadow-sm">{nfts} NFTs</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Bridge Interface */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Bridge Asset</h3>
        
        <div className="space-y-6">
          {/* Asset Type */}
          <div className="space-y-2">
            <Label className="text-white">Asset Type</Label>
            <div className="flex gap-2">
              {(["nft", "token", "native"] as const).map((type) => (
                <Button
                  key={type}
                  variant={assetType === type ? "default" : "outline"}
                  onClick={() => setAssetType(type)}
                  className={assetType === type 
                    ? "bg-[#9b87f5] text-white" 
                    : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  {type.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* NFT Selection */}
          {assetType === "nft" && (
            <div className="space-y-2">
              <Label className="text-white">Select NFT</Label>
              <div className="grid grid-cols-4 gap-3">
                {mockNFTs.slice(0, 4).map((nft) => (
                  <div
                    key={nft.id}
                    onClick={() => setSelectedNFT(nft.id)}
                    className={`relative aspect-square rounded-lg cursor-pointer transition-all ${
                      selectedNFT === nft.id
                        ? "ring-2 ring-[#9b87f5] scale-105"
                        : "hover:scale-105"
                    }`}
                  >
                    <img src={nft.image} alt={nft.title} className="w-full h-full object-cover rounded-lg" />
                    {selectedNFT === nft.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#9b87f5] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <ChainBadge chain={nft.chain as ChainId} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chain Selection */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="space-y-2">
              <Label className="text-white">From Chain</Label>
              <Select value={fromChain} onValueChange={(v) => setFromChain(v as ChainId)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chains.map(chain => (
                    <SelectItem key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center pt-6">
              <ArrowRight className="w-8 h-8 text-[#9b87f5]" />
            </div>

            <div className="space-y-2">
              <Label className="text-white">To Chain</Label>
              <Select value={toChain} onValueChange={(v) => setToChain(v as ChainId)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chains.map(chain => (
                    <SelectItem key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Destination Wallet */}
          <div className="space-y-2">
            <Label className="text-white">Destination Wallet</Label>
            <Input
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          {/* Fee Breakdown */}
          <Card className="bg-white/5 border border-white/20 p-4">
            <h4 className="font-semibold text-white text-shadow-sm mb-3">Estimated Fees</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Wormhole fee:</span>
                <span>${estimatedFees.wormhole.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Source chain gas:</span>
                <span>${estimatedFees.sourceGas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Destination chain gas:</span>
                <span>~${estimatedFees.destGas.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-white">
                <span>Total:</span>
                <span>${totalFees.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-white/50 mt-3">Estimated Time: 5-10 minutes</p>
          </Card>

          {/* Warning */}
          <Alert className="bg-[#F97316]/20 border-[#F97316]/30">
            <AlertTriangle className="w-4 h-4 text-[#F97316]" />
            <AlertDescription className="text-white/90">
              NFT Teleportation Notice: This NFT will be locked on {fromChain} and a wrapped version will be minted on {toChain}. You can bridge back anytime.
            </AlertDescription>
          </Alert>

          <Button onClick={handleBridge} className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9b87f5] text-white">
            Bridge Asset
          </Button>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
        <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Recent Bridge Transactions</h3>
        <div className="space-y-3">
          {[
            { name: "Abstract Waves #42", from: "ethereum", to: "polygon", time: "2 hours ago", status: "complete" },
            { name: "0.5 ETH", from: "ethereum", to: "base", time: "1 day ago", status: "complete" }
          ].map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-white text-shadow-sm">{tx.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <ChainBadge chain={tx.from as ChainId} size="sm" />
                    <ArrowRight className="w-3 h-3 text-white/50" />
                    <ChainBadge chain={tx.to as ChainId} size="sm" />
                    <span className="text-xs text-white/50">• {tx.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs border border-[#10B981]/30">
                  ✓ Complete
                </span>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

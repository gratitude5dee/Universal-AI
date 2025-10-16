import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NFTCardProps {
  nft: {
    id: string;
    title: string;
    image: string;
    chain: string;
    platform: string;
    price: number;
    currency: string;
    sales: number;
    revenue: number;
    status: string;
  };
}

export const NFTCard = ({ nft }: NFTCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://opensea.io/assets/${nft.id}`);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20 overflow-hidden hover:shadow-glow transition-all group">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={nft.image}
          alt={nft.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge className={nft.status === "live" ? "bg-[#10B981]/80" : "bg-[#F97316]/80"}>
            {nft.status}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge className="bg-black/50 backdrop-blur-sm">
            {nft.chain}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white text-shadow-sm mb-1">{nft.title}</h3>
          <p className="text-sm text-white/60 text-shadow-sm">{nft.platform}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-white/60">Price</p>
            <p className="text-white font-medium">{nft.price} {nft.currency}</p>
          </div>
          <div>
            <p className="text-white/60">Sales</p>
            <p className="text-white font-medium">{nft.sales}</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/60">Total Revenue</span>
            <span className="text-lg font-bold text-[#9b87f5]">${nft.revenue.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

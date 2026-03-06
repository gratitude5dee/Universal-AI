import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFTCard } from "../shared/NFTCard";
import { Search, Filter, Grid3x3, List, SortAsc } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvmWallet } from "@/context/EvmWalletContext";
import { useWeb3 } from "@/context/Web3Context";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { getOwnedNFTs as getOwnedErc721 } from "thirdweb/extensions/erc721";
import { getOwnedNFTs as getOwnedErc1155 } from "thirdweb/extensions/erc1155";
import { getChainMetaByChainId } from "@/lib/web3/chains";

export const NFTGallery = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [filterChain, setFilterChain] = useState("all");
  const [search, setSearch] = useState("");
  const [nfts, setNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useEvmWallet();
  const { client, config } = useWeb3();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!address) {
        setNfts([]);
        return;
      }
      setIsLoading(true);
      try {
        const results: any[] = [];
        const chainIds = Object.keys(config.contractsByChainId ?? {}).map((k) => Number(k)).filter(Boolean);

        // Fallback to our default supported chains if env/config is empty.
        const targetChainIds = chainIds.length > 0 ? chainIds : [1, 8453, 137, 1514, 11155111, 84532, 80002, 1315];

        for (const chainId of targetChainIds) {
          const contracts = (config.contractsByChainId as any)?.[chainId] ?? {};
          const chain = defineChain(chainId as any) as any;
          const meta = getChainMetaByChainId(chainId);

          if (contracts.nftCollection) {
            try {
              const contract = getContract({ client, chain, address: contracts.nftCollection }) as any;
              const owned = await getOwnedErc721({ contract, owner: address } as any);
              for (const item of owned ?? []) {
                const tokenId = String((item as any)?.id ?? (item as any)?.tokenId ?? "");
                const name = (item as any)?.metadata?.name ?? (item as any)?.metadata?.title ?? "NFT";
                const image = (item as any)?.metadata?.image ?? (item as any)?.metadata?.image_url ?? "";
                const explorerBase = meta?.explorerBaseUrl ?? "https://etherscan.io";
                results.push({
                  id: tokenId || `${contracts.nftCollection}:${Math.random().toString(16).slice(2)}`,
                  title: name,
                  image: image || "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400",
                  chain: meta?.key ?? String(chainId),
                  platform: "UniversalAI",
                  price: 0,
                  currency: meta?.nativeSymbol ?? "ETH",
                  sales: 0,
                  revenue: 0,
                  status: "owned",
                  externalUrl: tokenId ? `${explorerBase}/token/${contracts.nftCollection}?a=${tokenId}` : undefined,
                });
              }
            } catch {
              // ignore per-chain failures
            }
          }

          if (contracts.edition) {
            try {
              const contract = getContract({ client, chain, address: contracts.edition }) as any;
              const owned = await getOwnedErc1155({ contract, owner: address } as any);
              for (const item of owned ?? []) {
                const tokenId = String((item as any)?.id ?? (item as any)?.tokenId ?? "");
                const name = (item as any)?.metadata?.name ?? (item as any)?.metadata?.title ?? "Edition";
                const image = (item as any)?.metadata?.image ?? (item as any)?.metadata?.image_url ?? "";
                const explorerBase = meta?.explorerBaseUrl ?? "https://etherscan.io";
                results.push({
                  id: tokenId || `${contracts.edition}:${Math.random().toString(16).slice(2)}`,
                  title: name,
                  image: image || "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400",
                  chain: meta?.key ?? String(chainId),
                  platform: "UniversalAI",
                  price: 0,
                  currency: meta?.nativeSymbol ?? "ETH",
                  sales: 0,
                  revenue: 0,
                  status: "owned",
                  externalUrl: tokenId ? `${explorerBase}/token/${contracts.edition}?a=${tokenId}` : undefined,
                });
              }
            } catch {
              // ignore
            }
          }
        }

        if (!cancelled) setNfts(results);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [address, client, config.contractsByChainId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return nfts
      .filter((nft) => (filterChain === "all" ? true : String(nft.chain) === filterChain))
      .filter((nft) => (!q ? true : String(nft.title ?? "").toLowerCase().includes(q)));
  }, [nfts, filterChain, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-white text-shadow-sm">Your NFT Collection</h3>
          <p className="text-white/70 text-shadow-sm text-sm">
            {address ? (isLoading ? "Loading…" : `${filtered.length} items`) : "Connect a wallet to view owned NFTs"}
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search NFTs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64 bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          
          <Select value={filterChain} onValueChange={setFilterChain}>
            <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="story">Story</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="sales">Most Sales</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-1 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-1">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-[#9b87f5]" : "text-white hover:bg-white/10"}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className={view === "list" ? "bg-[#9b87f5]" : "text-white hover:bg-white/10"}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((nft) => (
            <Card key={nft.id} className="backdrop-blur-md bg-white/10 border border-white/20 p-4 hover:shadow-glow transition-all">
              <div className="flex items-center gap-4">
                <img src={nft.image} alt={nft.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-shadow-sm">{nft.title}</h3>
                  <p className="text-sm text-white/60">{nft.platform} • {nft.chain}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Price</p>
                  <p className="font-semibold text-white">{nft.price} {nft.currency}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Sales</p>
                  <p className="font-semibold text-white">{nft.sales}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Revenue</p>
                  <p className="font-semibold text-[#9b87f5]">${nft.revenue.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

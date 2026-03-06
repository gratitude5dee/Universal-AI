import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, Star, Download, ExternalLink, CheckCircle, 
  AlertCircle, ThumbsUp, ThumbsDown, Play 
} from 'lucide-react';
import { MarketplaceListing, AgentReview } from '@/types/marketplace';
import { useEvmWallet } from '@/context/EvmWalletContext';
import { useWeb3 } from '@/context/Web3Context';
import { useAuth as useAppAuth } from '@/context/AuthContext';
import { useActiveAccount } from 'thirdweb/react';
import { defineChain } from 'thirdweb/chains';
import { getContract, sendTransaction } from 'thirdweb';
import { mintTo as mintErc1155To } from 'thirdweb/extensions/erc1155';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AgentDetail = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { address, chainId } = useEvmWallet();
  const { client, config, writesEnabled } = useWeb3();
  const { user } = useAppAuth();
  const account = useActiveAccount() as any;
  const [isInstalling, setIsInstalling] = useState(false);

  // Mock data - would come from API
  const listing: MarketplaceListing = {
    id: agentId || '1',
    agentId: agentId || '1',
    name: 'CodeWhiz Pro',
    description: 'AI-powered code assistant with multi-language support',
    longDescription: `# CodeWhiz Pro

Your intelligent coding companion that understands 50+ programming languages and helps you write better code faster.

## Key Capabilities

- **Smart Code Completion**: Context-aware suggestions that understand your codebase
- **Real-time Error Detection**: Catch bugs before they happen
- **Documentation Lookup**: Instant access to API docs and examples
- **Refactoring Suggestions**: Improve code quality with AI-powered recommendations

## Supported Languages

JavaScript, TypeScript, Python, Go, Rust, Java, C++, and 43 more languages.

## Use Cases

Perfect for developers who want to:
- Speed up development workflow
- Write cleaner, more maintainable code
- Learn new languages and frameworks
- Debug complex issues faster`,
    creator: {
      id: '1',
      name: 'TechCorp AI',
      avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=techcorp'
    },
    category: ['Technical', 'Development', 'Productivity'],
    pricing: {
      model: 'subscription',
      price: 9.99,
      currency: 'USD'
    },
    rating: 4.8,
    reviewCount: 234,
    installCount: 12500,
    features: [
      'Code completion across 50+ languages',
      'Real-time error detection and fixes',
      'Built-in documentation search',
      'Automatic refactoring suggestions',
      'Integration with popular IDEs',
      'Custom code style enforcement'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&h=600&fit=crop'
    ],
    videoUrl: 'https://example.com/demo.mp4',
    dependencies: [
      { name: 'OpenAI API', type: 'required', installed: false },
      { name: 'GitHub Plugin', type: 'optional', installed: true }
    ],
    requiredPlugins: ['code-interpreter', 'git-integration'],
    lastUpdated: new Date('2024-01-15'),
    version: '2.4.1'
  };

  const reviews: AgentReview[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Dev',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      rating: 5,
      comment: 'Game changer for my workflow! The code suggestions are incredibly accurate and save me hours every week.',
      createdAt: new Date('2024-01-10'),
      upvotes: 45,
      downvotes: 2
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Chen',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      rating: 4,
      comment: 'Really solid agent. Would love to see better support for Rust macros, but overall excellent.',
      createdAt: new Date('2024-01-08'),
      upvotes: 23,
      downvotes: 1
    }
  ];

  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);

  const filteredReviews = selectedRatingFilter 
    ? reviews.filter(r => r.rating === selectedRatingFilter)
    : reviews;

  const ratingDistribution = [
    { stars: 5, count: 180, percentage: 77 },
    { stars: 4, count: 38, percentage: 16 },
    { stars: 3, count: 10, percentage: 4 },
    { stars: 2, count: 4, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 }
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/marketplace')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </Button>

      {/* Hero Section */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {listing.screenshots[0] && (
                <img src={listing.screenshots[0]} alt={listing.name} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{listing.name}</h1>
                  <div className="flex items-center gap-3 text-muted-foreground mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={listing.creator.avatar} />
                      <AvatarFallback>{listing.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>by {listing.creator.name}</span>
                  </div>
                </div>

                <div className="text-right">
                  {listing.pricing.model === 'free' ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-4 py-1">Free</Badge>
                  ) : (
                    <div className="text-3xl font-bold">${listing.pricing.price}<span className="text-lg text-muted-foreground">/mo</span></div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(listing.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({listing.reviewCount} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Download className="w-4 h-4" />
                  <span>{listing.installCount.toLocaleString()} installs</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {listing.category.map((cat) => (
                  <Badge key={cat} variant="secondary">{cat}</Badge>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 md:flex-initial"
                  disabled={isInstalling}
                  onClick={() => {
                    void (async () => {
                      if (!writesEnabled) {
                        toast.error("Web3 writes disabled (set VITE_ENABLE_WEB3_WRITES=true)");
                        return;
                      }
                      if (!user) {
                        toast.error("Sign in required to install agents");
                        return;
                      }
                      if (!address || !chainId || !account) {
                        toast.error("Connect your wallet to install");
                        return;
                      }
                      const agentPass = config.contractsByChainId?.[chainId]?.agentPass;
                      if (!agentPass) {
                        toast.error("AgentPass contract not configured for this chain");
                        return;
                      }
                      setIsInstalling(true);
                      try {
                        const chain = defineChain(chainId as any) as any;
                        const contract = getContract({ client, chain, address: agentPass }) as any;
                        const tx = mintErc1155To({
                          contract,
                          to: address,
                          supply: 1,
                          nft: {
                            name: `Agent Pass: ${listing.name}`,
                            description: `On-chain install receipt for ${listing.name} (${listing.version})`,
                          },
                        } as any);
                        const result = await sendTransaction({ transaction: tx, account } as any);
                        const txHash = (result as any)?.transactionHash ?? (result as any)?.hash ?? null;
                        await supabase.from("wallet_transactions").insert({
                          user_id: user.id,
                          wallet_address: address,
                          transaction_type: "agent_install",
                          amount: 0,
                          asset_symbol: "AGENTPASS",
                          status: "submitted",
                          transaction_hash: txHash ? String(txHash) : null,
                          metadata: { agentId: listing.id, agentName: listing.name, chainId, contractAddress: agentPass },
                        } as any);
                        toast.success("Agent installed on-chain");
                      } catch (e: any) {
                        toast.error(e?.message ?? "Install failed");
                      } finally {
                        setIsInstalling(false);
                      }
                    })();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isInstalling ? "Installing..." : "Install Now"}
                </Button>
                <Button size="lg" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Agent</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: listing.longDescription.replace(/\n/g, '<br />') }} />
                </CardContent>
              </Card>

              {listing.screenshots.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {listing.screenshots.map((screenshot, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-border">
                          <img src={screenshot} alt={`Screenshot ${idx + 1}`} className="w-full h-auto" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {listing.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ratingDistribution.map((dist) => (
                      <div 
                        key={dist.stars} 
                        className="flex items-center gap-4 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
                        onClick={() => setSelectedRatingFilter(selectedRatingFilter === dist.stars ? null : dist.stars)}
                      >
                        <div className="flex items-center gap-1 w-16">
                          <span className="font-medium">{dist.stars}</span>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={dist.percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12 text-right">{dist.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>{review.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold">{review.userName}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span>•</span>
                                <span>{review.createdAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{review.comment}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.upvotes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <ThumbsDown className="w-4 h-4" />
                              <span>{review.downvotes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dependencies</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {listing.dependencies.map((dep, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {dep.type === 'required' ? (
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{dep.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {dep.type === 'required' ? 'Required' : 'Optional'}
                        </div>
                      </div>
                    </div>
                    {dep.installed && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Auto-install Dependencies
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">{listing.version}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">{listing.lastUpdated.toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{listing.category[0]}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;

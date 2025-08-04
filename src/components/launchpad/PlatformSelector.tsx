import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ExternalLink,
  Loader2,
  Zap,
  Twitter,
  Link,
  Shield,
  Globe,
  Coins,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

// Types
interface Platform {
  id: string;
  name: string;
  description: string;
  blockchain: string;
  icon: string;
  color: string;
  connectionType: 'wallet' | 'oauth' | 'api' | 'tweet';
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  features: string[];
  fees: {
    launch: string;
    trading: string;
  };
  requirements: string[];
  launchTime: string;
  volume24h?: number;
}

interface ConnectionStatus {
  platformId: string;
  connected: boolean;
  account?: string;
  error?: string;
  lastConnected?: Date;
}

// Mock platform data
const platforms: Platform[] = [
  {
    id: 'believe',
    name: 'Believe',
    description: 'Launch tokens via X posts on Solana',
    blockchain: 'Solana',
    icon: '🔮',
    color: 'from-purple-500 to-indigo-600',
    connectionType: 'tweet',
    status: 'disconnected',
    features: ['No wallet needed', 'Viral launch mechanism', '50% creator fees'],
    fees: {
      launch: 'Free (via tweet)',
      trading: '5% platform fee'
    },
    requirements: ['Active X (Twitter) account', 'Viral tweet format'],
    launchTime: 'Instant',
    volume24h: 6300000
  },
  {
    id: 'rally',
    name: 'Rally',
    description: 'No-code creator coins with fiat on-ramps',
    blockchain: 'Ethereum Sidechain',
    icon: '🚀',
    color: 'from-orange-500 to-red-600',
    connectionType: 'oauth',
    status: 'disconnected',
    features: ['Fiat on-ramp', 'No-code setup', 'Mobile-first'],
    fees: {
      launch: '$500 application fee',
      trading: '2.5% transaction fee'
    },
    requirements: ['KYC verification', '2-3 week approval'],
    launchTime: '2-3 weeks',
    volume24h: 1200000
  },
  {
    id: 'friendtech',
    name: 'friend.tech',
    description: 'Social influence keys on Base L2',
    blockchain: 'Base',
    icon: '🗝️',
    color: 'from-blue-500 to-cyan-600',
    connectionType: 'wallet',
    status: 'disconnected',
    features: ['Bonding curve pricing', 'Chat access', 'High liquidity'],
    fees: {
      launch: 'Free',
      trading: '5% trading fee'
    },
    requirements: ['Base wallet', 'Twitter verification'],
    launchTime: 'Instant',
    volume24h: 2100000
  },
  {
    id: 'pumpfun',
    name: 'Pump.fun',
    description: 'High-volume memecoin launchpad',
    blockchain: 'Solana',
    icon: '💎',
    color: 'from-green-500 to-teal-600',
    connectionType: 'wallet',
    status: 'disconnected',
    features: ['Instant launch', 'DEX integration', 'Community driven'],
    fees: {
      launch: '~$2 SOL',
      trading: '1% trading fee'
    },
    requirements: ['Solana wallet', 'Token metadata'],
    launchTime: 'Instant',
    volume24h: 8900000
  },
  {
    id: 'deso',
    name: 'DeSo',
    description: 'Decentralized social with profile coins',
    blockchain: 'DeSo L1',
    icon: '🌐',
    color: 'from-pink-500 to-purple-600',
    connectionType: 'wallet',
    status: 'disconnected',
    features: ['Profile coins', 'Social graph', 'Built-in DEX'],
    fees: {
      launch: '~$10 DESO',
      trading: 'Dynamic bonding curve'
    },
    requirements: ['DeSo identity', 'Profile setup'],
    launchTime: 'Instant',
    volume24h: 450000
  },
  {
    id: 'roll',
    name: 'Roll',
    description: 'Self-service social token minting',
    blockchain: 'Ethereum',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-600',
    connectionType: 'oauth',
    status: 'disconnected',
    features: ['ERC-20 tokens', 'Low fees', 'Gasless transactions'],
    fees: {
      launch: '$100 setup fee',
      trading: '2% platform fee'
    },
    requirements: ['Ethereum wallet', 'Social verification'],
    launchTime: '1-2 days',
    volume24h: 340000
  },
  {
    id: 'calaxy',
    name: 'Calaxy',
    description: 'Creator tokens with fan experiences',
    blockchain: 'Hedera',
    icon: '✨',
    color: 'from-indigo-500 to-blue-600',
    connectionType: 'oauth',
    status: 'disconnected',
    features: ['Video calls', 'Messages', 'Experiences'],
    fees: {
      launch: 'Free',
      trading: '3% platform fee'
    },
    requirements: ['Creator verification', 'Content portfolio'],
    launchTime: '1 week',
    volume24h: 780000
  },
  {
    id: 'letsbonk',
    name: "Let's Bonk",
    description: 'Memecoin launchpad with BONK burns',
    blockchain: 'Solana',
    icon: '🔥',
    color: 'from-red-500 to-pink-600',
    connectionType: 'wallet',
    status: 'disconnected',
    features: ['BONK token burns', 'Community rewards', 'Viral mechanics'],
    fees: {
      launch: '~1 SOL',
      trading: '1% + BONK burn'
    },
    requirements: ['Solana wallet', 'BONK holdings preferred'],
    launchTime: 'Instant',
    volume24h: 1800000
  }
];

const PlatformSelector: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [connectionStatuses, setConnectionStatuses] = useState<ConnectionStatus[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [filterBlockchain, setFilterBlockchain] = useState<string>('all');

  const blockchains = ['all', 'Solana', 'Ethereum', 'Base', 'Hedera', 'DeSo L1', 'Ethereum Sidechain'];

  const getStatusIcon = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-white/50" />;
    }
  };

  const getConnectionTypeIcon = (type: Platform['connectionType']) => {
    switch (type) {
      case 'wallet':
        return <Wallet className="h-4 w-4" />;
      case 'oauth':
        return <Shield className="h-4 w-4" />;
      case 'tweet':
        return <Twitter className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
    } else {
      newSelected.add(platformId);
    }
    setSelectedPlatforms(newSelected);
  };

  const handleConnect = async (platform: Platform) => {
    setIsConnecting(platform.id);
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      setConnectionStatuses(prev => [
        ...prev.filter(status => status.platformId !== platform.id),
        {
          platformId: platform.id,
          connected: true,
          account: `${platform.name} Account`,
          lastConnected: new Date()
        }
      ]);

      // Update platform status
      platform.status = 'connected';
      
      toast({
        title: "Connected Successfully",
        description: `Connected to ${platform.name}`,
      });
    } catch (error) {
      platform.status = 'error';
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${platform.name}`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = (platformId: string) => {
    setConnectionStatuses(prev => prev.filter(status => status.platformId !== platformId));
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      platform.status = 'disconnected';
    }
    
    toast({
      title: "Disconnected",
      description: "Platform disconnected successfully",
    });
  };

  const filteredPlatforms = platforms.filter(platform => 
    filterBlockchain === 'all' || platform.blockchain === filterBlockchain
  );

  const isConnected = (platformId: string) => {
    return connectionStatuses.some(status => status.platformId === platformId && status.connected);
  };

  const connectedCount = connectionStatuses.filter(status => status.connected).length;
  const totalVolume = platforms.reduce((sum, platform) => sum + (platform.volume24h || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Multi-Platform Token Launchpad</h2>
            <p className="text-white/70">Connect to leading social token platforms and launch across multiple chains</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              Compare Platforms
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{platforms.length}</p>
              <p className="text-white/70 text-sm">Platforms</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{connectedCount}</p>
              <p className="text-white/70 text-sm">Connected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Coins className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-semibold">${(totalVolume / 1000000).toFixed(1)}M</p>
              <p className="text-white/70 text-sm">24h Volume</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{selectedPlatforms.size}</p>
              <p className="text-white/70 text-sm">Selected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-white/70 text-sm">Filter by blockchain:</span>
        </div>
        {blockchains.map(blockchain => (
          <Button
            key={blockchain}
            variant={filterBlockchain === blockchain ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterBlockchain(blockchain)}
            className={filterBlockchain === blockchain 
              ? "bg-primary text-white" 
              : "border-white/20 text-white hover:bg-white/10"
            }
          >
            {blockchain}
          </Button>
        ))}
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlatforms.map((platform, index) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10 backdrop-blur-md hover:border-white/20 transition-all h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center text-white text-xl`}>
                      {platform.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white">{platform.name}</CardTitle>
                      <Badge variant="secondary" className="bg-white/10 text-white text-xs mt-1">
                        {platform.blockchain}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(platform.status)}
                    <Switch
                      checked={selectedPlatforms.has(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                      disabled={!isConnected(platform.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm mb-4">{platform.description}</p>
                
                {/* Features */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-white/70 text-xs mb-2">Key Features</p>
                    <div className="flex flex-wrap gap-1">
                      {platform.features.slice(0, 3).map(feature => (
                        <Badge key={feature} variant="outline" className="border-white/20 text-white/70 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-white/70">Launch Fee</p>
                      <p className="text-white">{platform.fees.launch}</p>
                    </div>
                    <div>
                      <p className="text-white/70">Launch Time</p>
                      <p className="text-white">{platform.launchTime}</p>
                    </div>
                  </div>

                  {platform.volume24h && (
                    <div>
                      <p className="text-white/70 text-xs">24h Volume</p>
                      <p className="text-white text-sm font-medium">
                        ${(platform.volume24h / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  )}
                </div>

                {/* Connection */}
                <div className="space-y-2">
                  {isConnected(platform.id) ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-400 text-sm">Connected</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDisconnect(platform.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform)}
                      disabled={isConnecting === platform.id}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      {isConnecting === platform.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          {getConnectionTypeIcon(platform.connectionType)}
                          <span className="ml-2">
                            {platform.connectionType === 'wallet' ? 'Connect Wallet' :
                             platform.connectionType === 'oauth' ? 'Authorize' :
                             platform.connectionType === 'tweet' ? 'Link Twitter' : 'Connect'}
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Requirements */}
                {platform.requirements.length > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/70 text-xs mb-1">Requirements:</p>
                    <ul className="text-white/60 text-xs space-y-1">
                      {platform.requirements.map(req => (
                        <li key={req} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Launch Summary */}
      {selectedPlatforms.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-semibold mb-1">Launch Summary</h3>
              <p className="text-white/70 text-sm">
                Ready to launch on {selectedPlatforms.size} platform{selectedPlatforms.size !== 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Continue to Launch
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PlatformSelector;
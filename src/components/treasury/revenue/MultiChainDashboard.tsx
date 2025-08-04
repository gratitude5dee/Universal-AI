import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  ExternalLink,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface ChainBalance {
  chain: string;
  symbol: string;
  balance: number;
  usdValue: number;
  change24h: number;
  icon: string;
  color: string;
  gasPrice?: number;
  status: 'connected' | 'syncing' | 'error';
}

interface PlatformRevenue {
  platform: string;
  revenue: number;
  change: number;
  logo: string;
  color: string;
  chains: string[];
}

interface GasOptimization {
  chain: string;
  currentGas: number;
  optimalGas: number;
  savings: number;
  timeToOptimal: string;
}

// Mock data
const chainBalances: ChainBalance[] = [
  {
    chain: 'Ethereum',
    symbol: 'ETH',
    balance: 15.42,
    usdValue: 38550.34,
    change24h: 2.3,
    icon: '🔷',
    color: 'from-blue-500 to-blue-600',
    gasPrice: 45,
    status: 'connected'
  },
  {
    chain: 'Solana',
    symbol: 'SOL',
    balance: 245.67,
    usdValue: 12283.50,
    change24h: -1.2,
    icon: '🟣',
    color: 'from-purple-500 to-purple-600',
    gasPrice: 0.00025,
    status: 'connected'
  },
  {
    chain: 'Polygon',
    symbol: 'MATIC',
    balance: 8924.33,
    usdValue: 5354.60,
    change24h: 4.1,
    icon: '🟠',
    color: 'from-orange-500 to-orange-600',
    gasPrice: 0.002,
    status: 'syncing'
  },
  {
    chain: 'Arbitrum',
    symbol: 'ETH',
    balance: 7.89,
    usdValue: 19724.10,
    change24h: 1.8,
    icon: '🔵',
    color: 'from-cyan-500 to-cyan-600',
    gasPrice: 0.15,
    status: 'connected'
  }
];

const platformRevenues: PlatformRevenue[] = [
  {
    platform: 'Audius',
    revenue: 8234.45,
    change: 12.3,
    logo: '🎵',
    color: 'from-pink-500 to-purple-600',
    chains: ['Ethereum', 'Solana']
  },
  {
    platform: 'Sound.xyz',
    revenue: 15642.22,
    change: 8.7,
    logo: '🔊',
    color: 'from-yellow-500 to-orange-600',
    chains: ['Ethereum']
  },
  {
    platform: 'Nina Protocol',
    revenue: 4521.67,
    change: -2.1,
    logo: '🎶',
    color: 'from-green-500 to-teal-600',
    chains: ['Solana']
  },
  {
    platform: 'Royal',
    revenue: 12834.88,
    change: 15.4,
    logo: '👑',
    color: 'from-indigo-500 to-purple-600',
    chains: ['Ethereum', 'Polygon']
  }
];

const gasOptimizations: GasOptimization[] = [
  {
    chain: 'Ethereum',
    currentGas: 45,
    optimalGas: 25,
    savings: 12.34,
    timeToOptimal: '2h 15m'
  },
  {
    chain: 'Polygon',
    currentGas: 0.002,
    optimalGas: 0.001,
    savings: 0.45,
    timeToOptimal: '45m'
  }
];

const MultiChainDashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const totalUsdValue = chainBalances.reduce((sum, chain) => sum + chain.usdValue, 0);
  const totalPlatformRevenue = platformRevenues.reduce((sum, platform) => sum + platform.revenue, 0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: ChainBalance['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'syncing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Total Balance */}
      <div className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Multi-Chain Portfolio</h2>
            <p className="text-white/70">Real-time balances across all networks</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-white/70 text-sm mb-2">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-white">${totalUsdValue.toLocaleString()}</p>
            <p className="text-green-400 text-sm mt-1 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +5.2% (24h)
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm mb-2">Platform Revenue (30d)</p>
            <p className="text-3xl font-bold text-white">${totalPlatformRevenue.toLocaleString()}</p>
            <p className="text-white/70 text-sm mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="balances" className="w-full">
        <TabsList className="bg-white/10 border border-white/20 rounded-lg">
          <TabsTrigger value="balances" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Chain Balances
          </TabsTrigger>
          <TabsTrigger value="platforms" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Platform Revenue
          </TabsTrigger>
          <TabsTrigger value="gas" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Gas Optimization
          </TabsTrigger>
          <TabsTrigger value="bridge" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Cross-Chain Bridge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chainBalances.map((chain, index) => (
              <motion.div
                key={chain.chain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${chain.color} flex items-center justify-center text-white font-bold`}>
                          {chain.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{chain.chain}</h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(chain.status)}
                            <span className="text-white/70 text-sm capitalize">{chain.status}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-white/10 text-white">
                        {chain.symbol}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Balance</span>
                        <span className="text-white font-medium">{chain.balance} {chain.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">USD Value</span>
                        <span className="text-white font-medium">${chain.usdValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">24h Change</span>
                        <span className={`font-medium flex items-center ${chain.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {chain.change24h >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownLeft className="h-3 w-3 mr-1" />}
                          {Math.abs(chain.change24h)}%
                        </span>
                      </div>
                      {chain.gasPrice && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Gas Price</span>
                          <span className="text-white/70 text-sm">{chain.gasPrice} Gwei</span>
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-4 border-white/20 text-white hover:bg-white/10">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Explorer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platformRevenues.map((platform, index) => (
              <motion.div
                key={platform.platform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center text-white font-bold`}>
                          {platform.logo}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{platform.platform}</h3>
                          <div className="flex space-x-1 mt-1">
                            {platform.chains.map(chain => (
                              <Badge key={chain} variant="secondary" className="bg-white/10 text-white text-xs">
                                {chain}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">30-Day Revenue</span>
                        <span className="text-white font-medium">${platform.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Growth</span>
                        <span className={`font-medium flex items-center ${platform.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {platform.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <ArrowDownLeft className="h-3 w-3 mr-1" />}
                          {Math.abs(platform.change)}%
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-4 border-white/20 text-white hover:bg-white/10">
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gas" className="mt-6">
          <div className="space-y-4">
            <Card className="glass-card border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Gas Fee Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gasOptimizations.map((opt, index) => (
                    <div key={opt.chain} className="flex justify-between items-center p-4 rounded-lg bg-white/5">
                      <div>
                        <h4 className="text-white font-medium">{opt.chain}</h4>
                        <p className="text-white/70 text-sm">
                          Current: {opt.currentGas} Gwei → Optimal: {opt.optimalGas} Gwei
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium">${opt.savings} saved</p>
                        <p className="text-white/70 text-sm">ETA: {opt.timeToOptimal}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  Enable Auto-Optimization
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bridge" className="mt-6">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Cross-Chain Bridge</CardTitle>
              <p className="text-white/70">Transfer assets between chains</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">From Chain</label>
                  <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white">
                    <option>Ethereum</option>
                    <option>Solana</option>
                    <option>Polygon</option>
                  </select>
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">To Chain</label>
                  <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white">
                    <option>Polygon</option>
                    <option>Arbitrum</option>
                    <option>Solana</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-white text-sm font-medium mb-2 block">Amount</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                />
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Bridge Assets
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiChainDashboard;
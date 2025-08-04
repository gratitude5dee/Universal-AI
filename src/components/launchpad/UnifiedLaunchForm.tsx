import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Settings, 
  DollarSign, 
  Users, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  Zap,
  TrendingUp,
  Shield,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

// Types
interface TokenConfig {
  name: string;
  symbol: string;
  description: string;
  totalSupply: number;
  initialPrice: number;
  logo?: File;
  website?: string;
  telegram?: string;
  twitter?: string;
  discord?: string;
}

interface PlatformConfig {
  platformId: string;
  enabled: boolean;
  customSettings: { [key: string]: any };
  estimatedCost: number;
  estimatedTime: string;
}

interface LaunchProgress {
  platformId: string;
  status: 'pending' | 'launching' | 'success' | 'error';
  txHash?: string;
  contractAddress?: string;
  error?: string;
  progress: number;
}

// Mock platform configurations
const platformDefaults = {
  believe: {
    requiresTweet: true,
    tweetTemplate: "Launching ${{SYMBOL}} on @believe_app! 🚀 Join the community: {{WEBSITE}}",
    estimatedCost: 0,
    estimatedTime: "Instant"
  },
  rally: {
    requiresKYC: true,
    applicationFee: 500,
    estimatedCost: 500,
    estimatedTime: "2-3 weeks"
  },
  friendtech: {
    requiresTwitterVerification: true,
    bondingCurve: true,
    estimatedCost: 0,
    estimatedTime: "Instant"
  },
  pumpfun: {
    requiresMetadata: true,
    dexListing: true,
    estimatedCost: 2,
    estimatedTime: "Instant"
  },
  deso: {
    profileRequired: true,
    socialGraph: true,
    estimatedCost: 10,
    estimatedTime: "Instant"
  },
  roll: {
    gaslessTransactions: true,
    setupFee: 100,
    estimatedCost: 100,
    estimatedTime: "1-2 days"
  },
  calaxy: {
    creatorVerification: true,
    experienceFeatures: true,
    estimatedCost: 0,
    estimatedTime: "1 week"
  },
  letsbonk: {
    bonkBurn: true,
    communityRewards: true,
    estimatedCost: 1,
    estimatedTime: "Instant"
  }
};

interface UnifiedLaunchFormProps {
  selectedPlatforms: string[];
  onLaunchComplete?: (results: LaunchProgress[]) => void;
}

const UnifiedLaunchForm: React.FC<UnifiedLaunchFormProps> = ({ 
  selectedPlatforms = ['believe', 'pumpfun', 'friendtech'], 
  onLaunchComplete 
}) => {
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
    name: '',
    symbol: '',
    description: '',
    totalSupply: 1000000,
    initialPrice: 0.01
  });

  const [platformConfigs, setPlatformConfigs] = useState<PlatformConfig[]>([]);
  const [launchProgress, setLaunchProgress] = useState<LaunchProgress[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    // Initialize platform configurations
    const configs = selectedPlatforms.map(platformId => ({
      platformId,
      enabled: true,
      customSettings: { ...platformDefaults[platformId as keyof typeof platformDefaults] },
      estimatedCost: platformDefaults[platformId as keyof typeof platformDefaults]?.estimatedCost || 0,
      estimatedTime: platformDefaults[platformId as keyof typeof platformDefaults]?.estimatedTime || "Unknown"
    }));
    setPlatformConfigs(configs);

    // Initialize progress tracking
    const progress = selectedPlatforms.map(platformId => ({
      platformId,
      status: 'pending' as const,
      progress: 0
    }));
    setLaunchProgress(progress);
  }, [selectedPlatforms]);

  const totalEstimatedCost = platformConfigs
    .filter(config => config.enabled)
    .reduce((sum, config) => sum + config.estimatedCost, 0);

  const handleTokenConfigChange = (field: keyof TokenConfig, value: any) => {
    setTokenConfig(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platformId: string) => {
    setPlatformConfigs(prev => 
      prev.map(config => 
        config.platformId === platformId 
          ? { ...config, enabled: !config.enabled }
          : config
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTokenConfig(prev => ({ ...prev, logo: file }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setTokenConfig(prev => ({ ...prev, logo: files[0] }));
    }
  };

  const simulateLaunch = async (platformId: string): Promise<LaunchProgress> => {
    const steps = [
      { message: "Preparing token metadata...", progress: 20 },
      { message: "Validating configuration...", progress: 40 },
      { message: "Deploying smart contract...", progress: 60 },
      { message: "Setting up liquidity...", progress: 80 },
      { message: "Finalizing launch...", progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLaunchProgress(prev => 
        prev.map(p => 
          p.platformId === platformId 
            ? { ...p, progress: step.progress, status: 'launching' as const }
            : p
        )
      );
    }

    // Simulate random success/failure
    const isSuccess = Math.random() > 0.2; // 80% success rate
    
    if (isSuccess) {
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 40)}`;
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      return {
        platformId,
        status: 'success',
        progress: 100,
        txHash: mockTxHash,
        contractAddress: mockAddress
      };
    } else {
      return {
        platformId,
        status: 'error',
        progress: 0,
        error: 'Network congestion - please try again'
      };
    }
  };

  const handleLaunch = async () => {
    if (!tokenConfig.name || !tokenConfig.symbol) {
      toast({
        title: "Missing Information",
        description: "Please fill in token name and symbol",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);
    setCurrentStep(2);

    const enabledPlatforms = platformConfigs.filter(config => config.enabled);
    
    // Launch on all platforms simultaneously
    const launchPromises = enabledPlatforms.map(config => simulateLaunch(config.platformId));
    
    try {
      const results = await Promise.all(launchPromises);
      setLaunchProgress(results);
      
      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      
      if (successCount > 0) {
        toast({
          title: "Launch Successful!",
          description: `Token launched on ${successCount} platform${successCount !== 1 ? 's' : ''}${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        });
      }
      
      if (errorCount === enabledPlatforms.length) {
        toast({
          title: "Launch Failed",
          description: "Failed to launch on all platforms",
          variant: "destructive",
        });
      }

      onLaunchComplete?.(results);
    } catch (error) {
      toast({
        title: "Launch Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const getStatusIcon = (status: LaunchProgress['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'launching':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-white/50" />;
    }
  };

  const getPlatformName = (platformId: string) => {
    const names: { [key: string]: string } = {
      believe: 'Believe',
      rally: 'Rally',
      friendtech: 'friend.tech',
      pumpfun: 'Pump.fun',
      deso: 'DeSo',
      roll: 'Roll',
      calaxy: 'Calaxy',
      letsbonk: "Let's Bonk"
    };
    return names[platformId] || platformId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Launch Your Social Token</h2>
            <p className="text-white/70">Create and deploy tokens across {selectedPlatforms.length} platforms simultaneously</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Settings
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={currentStep.toString()} className="w-full">
        <TabsList className="bg-white/10 border border-white/20 rounded-lg">
          <TabsTrigger value="1" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Token Configuration
          </TabsTrigger>
          <TabsTrigger value="2" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Launch Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Token Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white">Token Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Token Name</label>
                        <Input
                          value={tokenConfig.name}
                          onChange={(e) => handleTokenConfigChange('name', e.target.value)}
                          placeholder="e.g. Creator Token"
                          className="bg-white/10 border-white/20 text-white placeholder-white/50"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Symbol</label>
                        <Input
                          value={tokenConfig.symbol}
                          onChange={(e) => handleTokenConfigChange('symbol', e.target.value.toUpperCase())}
                          placeholder="e.g. CRTR"
                          className="bg-white/10 border-white/20 text-white placeholder-white/50"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={tokenConfig.description}
                        onChange={(e) => handleTokenConfigChange('description', e.target.value)}
                        placeholder="Describe your token and community..."
                        className="bg-white/10 border-white/20 text-white placeholder-white/50"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">
                          Total Supply: {tokenConfig.totalSupply.toLocaleString()}
                        </label>
                        <Slider
                          value={[tokenConfig.totalSupply]}
                          onValueChange={([value]) => handleTokenConfigChange('totalSupply', value)}
                          min={1000}
                          max={1000000000}
                          step={1000}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">
                          Initial Price: ${tokenConfig.initialPrice}
                        </label>
                        <Slider
                          value={[tokenConfig.initialPrice]}
                          onValueChange={([value]) => handleTokenConfigChange('initialPrice', value)}
                          min={0.001}
                          max={10}
                          step={0.001}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Token Logo</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          dragOver ? 'border-primary bg-primary/10' : 'border-white/20'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                      >
                        {tokenConfig.logo ? (
                          <div className="flex items-center justify-center space-x-3">
                            <img 
                              src={URL.createObjectURL(tokenConfig.logo)} 
                              alt="Token logo" 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <span className="text-white">{tokenConfig.logo.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-white/50 mx-auto mb-2" />
                            <p className="text-white/70 text-sm">Drag and drop logo or click to upload</p>
                            <input
                              type="file"
                              onChange={handleFileUpload}
                              accept="image/*"
                              className="hidden"
                              id="logo-upload"
                            />
                            <label htmlFor="logo-upload">
                              <Button variant="outline" size="sm" className="mt-2 border-white/20 text-white hover:bg-white/10" asChild>
                                <span>Choose File</span>
                              </Button>
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Website</label>
                        <Input
                          value={tokenConfig.website || ''}
                          onChange={(e) => handleTokenConfigChange('website', e.target.value)}
                          placeholder="https://your-website.com"
                          className="bg-white/10 border-white/20 text-white placeholder-white/50"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Twitter</label>
                        <Input
                          value={tokenConfig.twitter || ''}
                          onChange={(e) => handleTokenConfigChange('twitter', e.target.value)}
                          placeholder="@your_handle"
                          className="bg-white/10 border-white/20 text-white placeholder-white/50"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Configurations */}
              <Card className="glass-card border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white">Platform Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformConfigs.map((config) => (
                      <div key={config.platformId} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-white font-medium">{getPlatformName(config.platformId)}</h4>
                            <Badge variant="secondary" className="bg-white/10 text-white text-xs">
                              {config.estimatedTime}
                            </Badge>
                          </div>
                          <Switch
                            checked={config.enabled}
                            onCheckedChange={() => handlePlatformToggle(config.platformId)}
                          />
                        </div>
                        
                        {config.enabled && (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/70">Estimated Cost:</span>
                              <span className="text-white">
                                {config.estimatedCost === 0 ? 'Free' : `$${config.estimatedCost}`}
                              </span>
                            </div>
                            
                            {/* Platform-specific settings */}
                            {config.platformId === 'believe' && (
                              <div className="p-2 rounded bg-white/5">
                                <p className="text-white/70 text-xs mb-1">Tweet Template:</p>
                                <p className="text-white/90 text-xs font-mono">
                                  Launching ${tokenConfig.symbol || 'TOKEN'} on @believe_app! 🚀
                                </p>
                              </div>
                            )}
                            
                            {config.platformId === 'pumpfun' && (
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-white/70">DEX Listing:</span>
                                  <span className="text-green-400">Auto-enabled</span>
                                </div>
                              </div>
                            )}
                            
                            {config.platformId === 'rally' && (
                              <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20">
                                <p className="text-orange-400 text-xs">⚠️ Requires KYC verification and 2-3 week approval</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Launch Summary */}
            <div className="space-y-6">
              <Card className="glass-card border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white">Launch Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5">
                      <h4 className="text-white font-medium mb-2">{tokenConfig.name || 'Your Token'}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Symbol:</span>
                          <span className="text-white">{tokenConfig.symbol || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Supply:</span>
                          <span className="text-white">{tokenConfig.totalSupply.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Initial Price:</span>
                          <span className="text-white">${tokenConfig.initialPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Platforms:</span>
                        <span className="text-white">{platformConfigs.filter(c => c.enabled).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Cost:</span>
                        <span className="text-white">
                          {totalEstimatedCost === 0 ? 'Free' : `$${totalEstimatedCost}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Est. Market Cap:</span>
                        <span className="text-white">
                          ${(tokenConfig.totalSupply * tokenConfig.initialPrice).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleLaunch}
                      disabled={isLaunching || !tokenConfig.name || !tokenConfig.symbol}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      {isLaunching ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-pulse" />
                          Launching...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4 mr-2" />
                          Launch Token
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Pre-Launch Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { label: 'Token name & symbol', completed: tokenConfig.name && tokenConfig.symbol },
                      { label: 'Token description', completed: tokenConfig.description },
                      { label: 'Logo uploaded', completed: tokenConfig.logo },
                      { label: 'Platform selected', completed: platformConfigs.some(c => c.enabled) },
                      { label: 'Social links', completed: tokenConfig.website || tokenConfig.twitter }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-white/30" />
                        )}
                        <span className={`text-sm ${item.completed ? 'text-white' : 'text-white/50'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="2" className="mt-6">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Launch Progress</CardTitle>
              <p className="text-white/70 text-sm">
                Deploying {tokenConfig.name} across {platformConfigs.filter(c => c.enabled).length} platforms
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {launchProgress.map((progress) => (
                  <div key={progress.platformId} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(progress.status)}
                        <h4 className="text-white font-medium">{getPlatformName(progress.platformId)}</h4>
                        <Badge 
                          variant="secondary" 
                          className={
                            progress.status === 'success' ? 'bg-green-500/20 text-green-400' :
                            progress.status === 'error' ? 'bg-red-500/20 text-red-400' :
                            progress.status === 'launching' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-white/10 text-white'
                          }
                        >
                          {progress.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {progress.status === 'launching' && (
                      <div className="space-y-2">
                        <Progress value={progress.progress} className="h-2" />
                        <p className="text-white/70 text-sm">{progress.progress}% complete</p>
                      </div>
                    )}
                    
                    {progress.status === 'success' && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-400 text-sm">Token deployed successfully!</span>
                        </div>
                        {progress.contractAddress && (
                          <div className="flex items-center space-x-2">
                            <span className="text-white/70 text-sm">Contract:</span>
                            <code className="text-white text-xs font-mono bg-white/10 px-2 py-1 rounded">
                              {progress.contractAddress.substring(0, 20)}...
                            </code>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {progress.status === 'error' && (
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-red-400 text-sm">{progress.error}</span>
                      </div>
                    )}
                  </div>
                ))}

                {launchProgress.some(p => p.status === 'success') && (
                  <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <h4 className="text-green-400 font-medium">Launch Successful!</h4>
                    </div>
                    <p className="text-green-300 text-sm mb-3">
                      Your token is now live! Next steps:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                        <Users className="h-4 w-4 mr-2" />
                        Share with Community
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Add Liquidity
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedLaunchForm;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Play, 
  Save, 
  Download, 
  Copy,
  Settings,
  Zap,
  Shield,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface ContractClause {
  id: string;
  type: 'royalty' | 'license' | 'payment' | 'access' | 'time' | 'custom';
  title: string;
  description: string;
  parameters: { [key: string]: any };
  required: boolean;
  enabled: boolean;
}

interface SmartContract {
  id: string;
  name: string;
  description: string;
  template: string;
  clauses: ContractClause[];
  status: 'draft' | 'testing' | 'deployed' | 'verified';
  deployedAt?: Date;
  gasUsed?: number;
  address?: string;
}

// Mock data
const contractTemplates = [
  {
    id: 'music-royalty',
    name: 'Music Royalty Distribution',
    description: 'Automated royalty splits for music releases',
    icon: '🎵',
    category: 'Music'
  },
  {
    id: 'licensing-agreement',
    name: 'Licensing Agreement',
    description: 'Smart licensing with automated payments',
    icon: '📄',
    category: 'Legal'
  },
  {
    id: 'collaboration',
    name: 'Collaboration Contract',
    description: 'Multi-party collaboration with revenue sharing',
    icon: '🤝',
    category: 'Collaboration'
  },
  {
    id: 'nft-royalty',
    name: 'NFT Royalty Contract',
    description: 'Perpetual royalties for NFT creators',
    icon: '🖼️',
    category: 'NFT'
  }
];

const defaultClauses: ContractClause[] = [
  {
    id: 'royalty-split',
    type: 'royalty',
    title: 'Royalty Distribution',
    description: 'Define revenue sharing percentages',
    parameters: {
      recipients: [
        { address: '0x123...', percentage: 50, name: 'Artist' },
        { address: '0x456...', percentage: 30, name: 'Producer' },
        { address: '0x789...', percentage: 20, name: 'Label' }
      ]
    },
    required: true,
    enabled: true
  },
  {
    id: 'payment-schedule',
    type: 'payment',
    title: 'Payment Schedule',
    description: 'Automated payment intervals',
    parameters: {
      frequency: 'monthly',
      minimumPayout: 100,
      autoRelease: true
    },
    required: false,
    enabled: true
  },
  {
    id: 'access-control',
    type: 'access',
    title: 'Access Control',
    description: 'Define who can modify the contract',
    parameters: {
      admins: ['0x123...', '0x456...'],
      requireMultiSig: true,
      threshold: 2
    },
    required: true,
    enabled: true
  },
  {
    id: 'time-lock',
    type: 'time',
    title: 'Time Lock',
    description: 'Lock funds or features for a period',
    parameters: {
      duration: 90,
      unit: 'days',
      unlockConditions: []
    },
    required: false,
    enabled: false
  }
];

const deployedContracts: SmartContract[] = [
  {
    id: '1',
    name: 'Midnight Echoes Royalties',
    description: 'Royalty distribution for Midnight Echoes track',
    template: 'music-royalty',
    clauses: defaultClauses,
    status: 'deployed',
    deployedAt: new Date('2024-01-15'),
    gasUsed: 2450000,
    address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
  },
  {
    id: '2',
    name: 'Album Collaboration Contract',
    description: 'Multi-artist collaboration agreement',
    template: 'collaboration',
    clauses: defaultClauses,
    status: 'verified',
    deployedAt: new Date('2024-01-20'),
    gasUsed: 3200000,
    address: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c'
  }
];

const ContractBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [currentContract, setCurrentContract] = useState<Partial<SmartContract>>({
    name: '',
    description: '',
    clauses: [],
    status: 'draft'
  });
  const [activeTab, setActiveTab] = useState('builder');
  const [isDeploying, setIsDeploying] = useState(false);

  const initializeFromTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentContract({
      name: `New ${contractTemplates.find(t => t.id === templateId)?.name}`,
      description: '',
      template: templateId,
      clauses: [...defaultClauses],
      status: 'draft'
    });
  };

  const updateClause = (clauseId: string, updates: Partial<ContractClause>) => {
    setCurrentContract(prev => ({
      ...prev,
      clauses: prev.clauses?.map(clause =>
        clause.id === clauseId ? { ...clause, ...updates } : clause
      ) || []
    }));
  };

  const addClause = () => {
    const newClause: ContractClause = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      title: 'Custom Clause',
      description: 'Add your custom logic',
      parameters: {},
      required: false,
      enabled: true
    };
    
    setCurrentContract(prev => ({
      ...prev,
      clauses: [...(prev.clauses || []), newClause]
    }));
  };

  const removeClause = (clauseId: string) => {
    setCurrentContract(prev => ({
      ...prev,
      clauses: prev.clauses?.filter(clause => clause.id !== clauseId) || []
    }));
  };

  const deployContract = async () => {
    setIsDeploying(true);
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeploying(false);
    setActiveTab('deployed');
  };

  const getStatusColor = (status: SmartContract['status']) => {
    switch (status) {
      case 'deployed': return 'text-green-400';
      case 'verified': return 'text-blue-400';
      case 'testing': return 'text-yellow-400';
      default: return 'text-white/70';
    }
  };

  const getClauseIcon = (type: string) => {
    switch (type) {
      case 'royalty': return <DollarSign className="h-4 w-4" />;
      case 'payment': return <Calendar className="h-4 w-4" />;
      case 'access': return <Shield className="h-4 w-4" />;
      case 'license': return <Code className="h-4 w-4" />;
      case 'time': return <Calendar className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Smart Contract Automation</h2>
            <p className="text-white/70">Build and deploy smart contracts without coding</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Download className="h-4 w-4 mr-2" />
              Export Code
            </Button>
            <Button 
              onClick={() => setActiveTab('builder')}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/10 border border-white/20 rounded-lg">
          <TabsTrigger value="templates" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Templates
          </TabsTrigger>
          <TabsTrigger value="builder" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Contract Builder
          </TabsTrigger>
          <TabsTrigger value="deployed" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Deployed Contracts
          </TabsTrigger>
          <TabsTrigger value="automation" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Automation Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contractTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="glass-card border-white/10 backdrop-blur-md hover:border-white/20 transition-all cursor-pointer h-full"
                  onClick={() => initializeFromTemplate(template.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{template.icon}</div>
                    <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{template.description}</p>
                    <Badge variant="secondary" className="bg-white/10 text-white">
                      {template.category}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          {currentContract.clauses ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contract Builder */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">Contract Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Contract Name</label>
                          <Input
                            value={currentContract.name}
                            onChange={(e) => setCurrentContract(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Template</label>
                          <Badge className="bg-primary/20 text-primary">
                            {contractTemplates.find(t => t.id === selectedTemplate)?.name || 'Custom'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={currentContract.description}
                          onChange={(e) => setCurrentContract(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contract Clauses */}
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Contract Clauses</CardTitle>
                      <Button
                        onClick={addClause}
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Clause
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentContract.clauses.map((clause, index) => (
                        <motion.div
                          key={clause.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                {getClauseIcon(clause.type)}
                              </div>
                              <div>
                                <h4 className="text-white font-medium">{clause.title}</h4>
                                <p className="text-white/70 text-sm">{clause.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={clause.enabled}
                                onCheckedChange={(enabled) => updateClause(clause.id, { enabled })}
                                disabled={clause.required}
                              />
                              {!clause.required && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeClause(clause.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {clause.enabled && (
                            <div className="space-y-3 pl-11">
                              {clause.type === 'royalty' && (
                                <div className="space-y-2">
                                  <p className="text-white/70 text-sm">Revenue Distribution</p>
                                  {clause.parameters.recipients?.map((recipient: any, idx: number) => (
                                    <div key={idx} className="flex items-center space-x-3 p-2 rounded bg-white/5">
                                      <Input
                                        placeholder="Name"
                                        value={recipient.name}
                                        className="bg-white/10 border-white/20 text-white text-sm"
                                      />
                                      <Input
                                        placeholder="Address"
                                        value={recipient.address}
                                        className="bg-white/10 border-white/20 text-white text-sm"
                                      />
                                      <Input
                                        type="number"
                                        placeholder="Percentage"
                                        value={recipient.percentage}
                                        className="bg-white/10 border-white/20 text-white text-sm w-24"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {clause.type === 'payment' && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-white/70 text-xs">Frequency</label>
                                    <select className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm">
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Annually</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-white/70 text-xs">Minimum Payout</label>
                                    <Input
                                      type="number"
                                      value={clause.parameters.minimumPayout}
                                      className="bg-white/10 border-white/20 text-white text-sm"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview & Deploy */}
              <div className="space-y-6">
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">Contract Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-white/5">
                        <h4 className="text-white font-medium mb-2">{currentContract.name}</h4>
                        <p className="text-white/70 text-sm mb-3">{currentContract.description}</p>
                        
                        <div className="space-y-2">
                          <p className="text-white/70 text-xs">Active Clauses: {currentContract.clauses.filter(c => c.enabled).length}</p>
                          <p className="text-white/70 text-xs">Estimated Gas: ~2.5M</p>
                          <p className="text-white/70 text-xs">Deployment Cost: ~$45</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={deployContract}
                          disabled={isDeploying}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                        >
                          {isDeploying ? (
                            <>
                              <Zap className="h-4 w-4 mr-2 animate-pulse" />
                              Deploying...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Deploy Contract
                            </>
                          )}
                        </Button>
                        
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          <Save className="h-4 w-4 mr-2" />
                          Save Draft
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Security Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        'Access controls configured',
                        'Royalty splits validated',
                        'Payment schedule set',
                        'Time locks verified'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-white/70 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="glass-card border-white/10 backdrop-blur-md">
              <CardContent className="p-12 text-center">
                <Code className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Select a Template</h3>
                <p className="text-white/70 mb-6">Choose a template from the Templates tab to start building</p>
                <Button 
                  onClick={() => setActiveTab('templates')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deployed" className="mt-6">
          <div className="space-y-4">
            {deployedContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold">{contract.name}</h3>
                          <Badge className={getStatusColor(contract.status)} variant="secondary">
                            {contract.status}
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm mb-3">{contract.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-white/70 text-xs mb-1">Deployed</p>
                            <p className="text-white text-sm">{contract.deployedAt?.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-xs mb-1">Gas Used</p>
                            <p className="text-white text-sm">{contract.gasUsed?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-xs mb-1">Address</p>
                            <p className="text-white text-sm font-mono">
                              {contract.address?.substring(0, 10)}...
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <Zap className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Automation Rules</h3>
              <p className="text-white/70">Set up automated triggers and actions for your contracts</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractBuilder;
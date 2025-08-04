import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Settings, 
  DollarSign, 
  Users, 
  Clock, 
  Globe,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
  Eye,
  Edit3,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface LicenseTemplate {
  id: string;
  name: string;
  description: string;
  category: 'commercial' | 'creative' | 'research' | 'custom';
  permissions: LicensePermission[];
  restrictions: LicenseRestriction[];
  terms: LicenseTerm[];
  icon: string;
  popular: boolean;
}

interface LicensePermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  required?: boolean;
}

interface LicenseRestriction {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value?: string | number;
}

interface LicenseTerm {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'duration' | 'text';
  value: any;
  description: string;
}

interface DeployedLicense {
  id: string;
  name: string;
  assetId: string;
  assetTitle: string;
  template: string;
  deployedAt: Date;
  licensees: number;
  revenue: number;
  status: 'active' | 'paused' | 'expired';
}

// Mock data
const licenseTemplates: LicenseTemplate[] = [
  {
    id: 'commercial-standard',
    name: 'Commercial Standard',
    description: 'Standard commercial license with royalty sharing',
    category: 'commercial',
    icon: '💼',
    popular: true,
    permissions: [
      { id: 'commercial-use', name: 'Commercial Use', description: 'Allow commercial usage', enabled: true, required: true },
      { id: 'modify', name: 'Modify', description: 'Allow modifications', enabled: true },
      { id: 'distribute', name: 'Distribute', description: 'Allow distribution', enabled: true },
      { id: 'sublicense', name: 'Sublicense', description: 'Allow sublicensing', enabled: false }
    ],
    restrictions: [
      { id: 'attribution', name: 'Attribution Required', description: 'Must credit original creator', enabled: true },
      { id: 'territory', name: 'Territory Limit', description: 'Geographic restrictions', enabled: false, value: 'worldwide' },
      { id: 'duration', name: 'Time Limit', description: 'License duration', enabled: true, value: '5 years' }
    ],
    terms: [
      { id: 'royalty', name: 'Royalty Rate', type: 'percentage', value: 10, description: 'Percentage of revenue' },
      { id: 'minimum', name: 'Minimum Payment', type: 'fixed', value: 100, description: 'Minimum payment amount' }
    ]
  },
  {
    id: 'creative-commons',
    name: 'Creative Commons Plus',
    description: 'CC license with Story Protocol enhancements',
    category: 'creative',
    icon: '🎨',
    popular: true,
    permissions: [
      { id: 'share', name: 'Share', description: 'Allow sharing', enabled: true, required: true },
      { id: 'adapt', name: 'Adapt', description: 'Allow adaptations', enabled: true },
      { id: 'commercial-use', name: 'Commercial Use', description: 'Allow commercial usage', enabled: false }
    ],
    restrictions: [
      { id: 'attribution', name: 'Attribution Required', description: 'Must credit original creator', enabled: true },
      { id: 'share-alike', name: 'Share Alike', description: 'Derivatives must use same license', enabled: true }
    ],
    terms: [
      { id: 'attribution-format', name: 'Attribution Format', type: 'text', value: 'By [Creator] - Licensed under Story CC+', description: 'Required attribution text' }
    ]
  },
  {
    id: 'research-academic',
    name: 'Research & Academic',
    description: 'License for academic and research purposes',
    category: 'research',
    icon: '🔬',
    popular: false,
    permissions: [
      { id: 'research-use', name: 'Research Use', description: 'Allow research usage', enabled: true, required: true },
      { id: 'academic-use', name: 'Academic Use', description: 'Allow academic usage', enabled: true },
      { id: 'publish', name: 'Publish Results', description: 'Allow publishing research results', enabled: true }
    ],
    restrictions: [
      { id: 'non-commercial', name: 'Non-Commercial Only', description: 'No commercial use allowed', enabled: true },
      { id: 'attribution', name: 'Attribution Required', description: 'Must credit original creator', enabled: true }
    ],
    terms: [
      { id: 'citation-format', name: 'Citation Format', type: 'text', value: 'Cite as: [Title] by [Creator], Story Protocol ID: [ID]', description: 'Required citation format' }
    ]
  }
];

const deployedLicenses: DeployedLicense[] = [
  {
    id: '1',
    name: 'Commercial Standard',
    assetId: 'asset-1',
    assetTitle: 'Midnight Echoes',
    template: 'commercial-standard',
    deployedAt: new Date('2024-01-15'),
    licensees: 12,
    revenue: 2847.50,
    status: 'active'
  },
  {
    id: '2',
    name: 'Creative Commons Plus',
    assetId: 'asset-2',
    assetTitle: 'Digital Dreams Cover Art',
    template: 'creative-commons',
    deployedAt: new Date('2024-01-20'),
    licensees: 8,
    revenue: 0,
    status: 'active'
  }
];

const ProgrammableLicense: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<LicenseTemplate | null>(null);
  const [customLicense, setCustomLicense] = useState<Partial<LicenseTemplate> | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  const handleTemplateSelect = (template: LicenseTemplate) => {
    setSelectedTemplate(template);
    setCustomLicense({ ...template });
  };

  const updatePermission = (permissionId: string, enabled: boolean) => {
    if (!customLicense) return;
    setCustomLicense(prev => ({
      ...prev!,
      permissions: prev!.permissions!.map(p => 
        p.id === permissionId ? { ...p, enabled } : p
      )
    }));
  };

  const updateRestriction = (restrictionId: string, enabled: boolean, value?: any) => {
    if (!customLicense) return;
    setCustomLicense(prev => ({
      ...prev!,
      restrictions: prev!.restrictions!.map(r => 
        r.id === restrictionId ? { ...r, enabled, ...(value !== undefined && { value }) } : r
      )
    }));
  };

  const updateTerm = (termId: string, value: any) => {
    if (!customLicense) return;
    setCustomLicense(prev => ({
      ...prev!,
      terms: prev!.terms!.map(t => 
        t.id === termId ? { ...t, value } : t
      )
    }));
  };

  const deployLicense = async () => {
    if (!customLicense) return;
    setIsDeploying(true);
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeploying(false);
    setActiveTab('deployed');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'paused': return 'text-yellow-400';
      case 'expired': return 'text-red-400';
      default: return 'text-white/70';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Programmable IP Licenses</h2>
            <p className="text-white/70">Create and deploy smart licenses with Story Protocol</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={() => setActiveTab('builder')}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Create License
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
            License Builder
          </TabsTrigger>
          <TabsTrigger value="deployed" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Deployed Licenses
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Marketplace
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licenseTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="glass-card border-white/10 backdrop-blur-md hover:border-white/20 transition-all cursor-pointer h-full"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-3xl">{template.icon}</div>
                      <div className="flex space-x-2">
                        {template.popular && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                            Popular
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-white/10 text-white capitalize">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{template.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{template.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/70 text-xs mb-1">Permissions</p>
                        <div className="flex flex-wrap gap-1">
                          {template.permissions.filter(p => p.enabled).slice(0, 3).map(permission => (
                            <Badge key={permission.id} variant="outline" className="border-green-500/50 text-green-400 text-xs">
                              {permission.name}
                            </Badge>
                          ))}
                          {template.permissions.filter(p => p.enabled).length > 3 && (
                            <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                              +{template.permissions.filter(p => p.enabled).length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-white/70 text-xs mb-1">Key Terms</p>
                        <div className="text-white text-sm">
                          {template.terms.slice(0, 2).map(term => (
                            <div key={term.id} className="flex justify-between">
                              <span>{term.name}:</span>
                              <span className="text-primary">
                                {term.type === 'percentage' ? `${term.value}%` : term.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          {customLicense ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* License Configuration */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      License Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <h4 className="text-white font-medium">Basic Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-white text-sm font-medium mb-2 block">License Name</label>
                            <Input
                              value={customLicense.name}
                              onChange={(e) => setCustomLicense(prev => ({ ...prev!, name: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-white text-sm font-medium mb-2 block">Category</label>
                            <select 
                              value={customLicense.category}
                              onChange={(e) => setCustomLicense(prev => ({ ...prev!, category: e.target.value as any }))}
                              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                            >
                              <option value="commercial">Commercial</option>
                              <option value="creative">Creative</option>
                              <option value="research">Research</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Description</label>
                          <Textarea
                            value={customLicense.description}
                            onChange={(e) => setCustomLicense(prev => ({ ...prev!, description: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="space-y-4">
                        <h4 className="text-white font-medium">Permissions</h4>
                        <div className="space-y-3">
                          {customLicense.permissions?.map(permission => (
                            <div key={permission.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <Switch
                                    checked={permission.enabled}
                                    onCheckedChange={(checked) => updatePermission(permission.id, checked)}
                                    disabled={permission.required}
                                  />
                                  <div>
                                    <p className="text-white font-medium">{permission.name}</p>
                                    <p className="text-white/70 text-sm">{permission.description}</p>
                                  </div>
                                </div>
                              </div>
                              {permission.required && (
                                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                                  Required
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="space-y-4">
                        <h4 className="text-white font-medium">Financial Terms</h4>
                        <div className="space-y-4">
                          {customLicense.terms?.map(term => (
                            <div key={term.id} className="p-4 rounded-lg bg-white/5">
                              <label className="text-white font-medium mb-2 block">{term.name}</label>
                              <p className="text-white/70 text-sm mb-3">{term.description}</p>
                              {term.type === 'percentage' && (
                                <div className="space-y-2">
                                  <Slider
                                    value={[term.value]}
                                    onValueChange={(value) => updateTerm(term.id, value[0])}
                                    max={100}
                                    step={0.5}
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-white/70 text-sm">
                                    <span>0%</span>
                                    <span className="text-primary font-medium">{term.value}%</span>
                                    <span>100%</span>
                                  </div>
                                </div>
                              )}
                              {term.type === 'fixed' && (
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-white/70" />
                                  <Input
                                    type="number"
                                    value={term.value}
                                    onChange={(e) => updateTerm(term.id, parseFloat(e.target.value))}
                                    className="bg-white/10 border-white/20 text-white"
                                  />
                                </div>
                              )}
                              {term.type === 'text' && (
                                <Input
                                  value={term.value}
                                  onChange={(e) => updateTerm(term.id, e.target.value)}
                                  className="bg-white/10 border-white/20 text-white"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview & Deploy */}
              <div className="space-y-6">
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">License Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-white/5">
                        <h4 className="text-white font-medium mb-2">{customLicense.name}</h4>
                        <p className="text-white/70 text-sm mb-3">{customLicense.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-white/70 text-xs mb-1">Active Permissions</p>
                            <div className="flex flex-wrap gap-1">
                              {customLicense.permissions?.filter(p => p.enabled).map(permission => (
                                <Badge key={permission.id} variant="outline" className="border-green-500/50 text-green-400 text-xs">
                                  {permission.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-white/70 text-xs mb-1">Key Terms</p>
                            {customLicense.terms?.map(term => (
                              <div key={term.id} className="flex justify-between text-sm">
                                <span className="text-white/70">{term.name}:</span>
                                <span className="text-white">
                                  {term.type === 'percentage' ? `${term.value}%` : 
                                   term.type === 'fixed' ? `$${term.value}` : term.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={deployLicense}
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
                              <Zap className="h-4 w-4 mr-2" />
                              Deploy License
                            </>
                          )}
                        </Button>
                        
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          <Download className="h-4 w-4 mr-2" />
                          Export as JSON
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Deployment Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        'License terms configured',
                        'Permissions set',
                        'Financial terms defined',
                        'Asset linked'
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
                <Settings className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Select a Template</h3>
                <p className="text-white/70 mb-6">Choose a license template from the Templates tab to start building</p>
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
            {deployedLicenses.map((license, index) => (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold">{license.name}</h3>
                          <Badge className={getStatusColor(license.status)} variant="secondary">
                            {license.status}
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm mb-3">Asset: {license.assetTitle}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-white/70 text-xs mb-1">Deployed</p>
                            <p className="text-white text-sm">{license.deployedAt.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-white/70 text-xs mb-1">Licensees</p>
                            <p className="text-white text-sm flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {license.licensees}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/70 text-xs mb-1">Revenue</p>
                            <p className="text-white text-sm flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {license.revenue.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              <Copy className="h-4 w-4" />
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

        <TabsContent value="marketplace" className="mt-6">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardContent className="p-12 text-center">
              <Globe className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">License Marketplace</h3>
              <p className="text-white/70 mb-6">Browse and acquire licenses from other creators</p>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                Explore Marketplace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgrammableLicense;
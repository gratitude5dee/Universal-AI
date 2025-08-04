import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Music, 
  Image, 
  Video,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
  X,
  Shield,
  Hash,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Types
interface IPAsset {
  id: string;
  title: string;
  type: 'music' | 'artwork' | 'video' | 'text';
  status: 'draft' | 'pending' | 'registered' | 'verified';
  creator: string;
  registrationDate: Date;
  ipHash: string;
  storyId?: string;
  metadata: {
    description: string;
    tags: string[];
    collaborators: string[];
    rights: string[];
  };
  file?: File;
}

interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

// Mock data
const mockAssets: IPAsset[] = [
  {
    id: '1',
    title: 'Midnight Echoes',
    type: 'music',
    status: 'verified',
    creator: 'Artist Name',
    registrationDate: new Date('2024-01-15'),
    ipHash: '0x1a2b3c4d5e6f...',
    storyId: 'SP-001',
    metadata: {
      description: 'Ambient electronic track with ethereal vocals',
      tags: ['electronic', 'ambient', 'vocal'],
      collaborators: ['Producer X', 'Vocalist Y'],
      rights: ['streaming', 'sync', 'remix']
    }
  },
  {
    id: '2',
    title: 'Digital Dreams Cover Art',
    type: 'artwork',
    status: 'pending',
    creator: 'Visual Artist',
    registrationDate: new Date('2024-01-20'),
    ipHash: '0x2b3c4d5e6f7a...',
    metadata: {
      description: 'Surreal digital artwork for album cover',
      tags: ['digital', 'surreal', 'album-art'],
      collaborators: [],
      rights: ['commercial', 'derivative']
    }
  }
];

const registrationSteps: RegistrationStep[] = [
  {
    id: 1,
    title: 'Upload Asset',
    description: 'Upload your creative work',
    completed: false,
    current: true
  },
  {
    id: 2,
    title: 'Add Metadata',
    description: 'Provide details and descriptions',
    completed: false,
    current: false
  },
  {
    id: 3,
    title: 'Set Rights',
    description: 'Configure licensing terms',
    completed: false,
    current: false
  },
  {
    id: 4,
    title: 'Deploy to Story',
    description: 'Register on Story Protocol',
    completed: false,
    current: false
  }
];

const IPAssetRegistry: React.FC = () => {
  const [assets, setAssets] = useState<IPAsset[]>(mockAssets);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newAsset, setNewAsset] = useState<Partial<IPAsset>>({
    title: '',
    type: 'music',
    metadata: {
      description: '',
      tags: [],
      collaborators: [],
      rights: []
    }
  });
  const [dragOver, setDragOver] = useState(false);

  const getStatusIcon = (status: IPAsset['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'registered':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: IPAsset['type']) => {
    switch (type) {
      case 'music':
        return <Music className="h-5 w-5" />;
      case 'artwork':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setNewAsset(prev => ({ ...prev, file: files[0] }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAsset(prev => ({ ...prev, file }));
    }
  };

  const addTag = (tag: string) => {
    if (tag && newAsset.metadata?.tags && !newAsset.metadata.tags.includes(tag)) {
      setNewAsset(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata!,
          tags: [...prev.metadata!.tags, tag]
        }
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewAsset(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata!,
        tags: prev.metadata!.tags.filter(tag => tag !== tagToRemove)
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < registrationSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegistration = async () => {
    setIsRegistering(true);
    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newRegisteredAsset: IPAsset = {
      id: Date.now().toString(),
      title: newAsset.title!,
      type: newAsset.type as IPAsset['type'],
      status: 'pending',
      creator: 'Current User',
      registrationDate: new Date(),
      ipHash: `0x${Math.random().toString(16).substr(2, 12)}...`,
      metadata: newAsset.metadata as IPAsset['metadata']
    };

    setAssets(prev => [newRegisteredAsset, ...prev]);
    setIsRegistering(false);
    setCurrentStep(1);
    setNewAsset({
      title: '',
      type: 'music',
      metadata: { description: '', tags: [], collaborators: [], rights: [] }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white/10 backdrop-blur-md">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">IP Asset Registry</h2>
            <p className="text-white/70">Register and manage your intellectual property on Story Protocol</p>
          </div>
          <Button
            onClick={() => setIsRegistering(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Register New Asset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="bg-white/10 border border-white/20 rounded-lg">
          <TabsTrigger value="assets" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            My Assets
          </TabsTrigger>
          <TabsTrigger value="register" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Register Asset
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-6">
          <div className="grid grid-cols-1 gap-4">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 backdrop-blur-md hover:border-white/20 transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center text-white">
                          {getTypeIcon(asset.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-white font-semibold">{asset.title}</h3>
                            {getStatusIcon(asset.status)}
                            <Badge variant="secondary" className="bg-white/10 text-white capitalize">
                              {asset.status}
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">{asset.metadata.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {asset.metadata.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="border-white/20 text-white/70 text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-white/70 text-sm">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {asset.creator}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {asset.registrationDate.toLocaleDateString()}
                            </div>
                            {asset.storyId && (
                              <div className="flex items-center">
                                <Hash className="h-4 w-4 mr-1" />
                                {asset.storyId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/50" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="register" className="mt-6">
          <Card className="glass-card border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Register New IP Asset</CardTitle>
              <div className="flex items-center justify-between mt-4">
                {registrationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id <= currentStep ? 'bg-primary text-white' : 'bg-white/10 text-white/50'
                    }`}>
                      {step.id}
                    </div>
                    {index < registrationSteps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step.id < currentStep ? 'bg-primary' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragOver ? 'border-primary bg-primary/10' : 'border-white/20'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                    >
                      <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
                      <p className="text-white mb-2">Drag and drop your file here</p>
                      <p className="text-white/70 text-sm mb-4">or</p>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        accept="audio/*,image/*,video/*,.pdf,.txt"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                    {newAsset.file && (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                        <FileText className="h-5 w-5 text-white" />
                        <span className="text-white">{newAsset.file.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setNewAsset(prev => ({ ...prev, file: undefined }))}
                          className="ml-auto text-white/70 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Asset Title</label>
                      <Input
                        value={newAsset.title}
                        onChange={(e) => setNewAsset(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter asset title"
                        className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={newAsset.metadata?.description}
                        onChange={(e) => setNewAsset(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata!, description: e.target.value }
                        }))}
                        placeholder="Describe your asset"
                        className="bg-white/10 border-white/20 text-white placeholder-white/50"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newAsset.metadata?.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-primary/20 text-white">
                            #{tag}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTag(tag)}
                              className="ml-1 h-4 w-4 p-0 text-white/70 hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add tag"
                          className="bg-white/10 border-white/20 text-white placeholder-white/50"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addTag(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addTag(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-white text-sm font-medium mb-4 block">Select Rights to Grant</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['streaming', 'sync', 'remix', 'commercial', 'derivative', 'exclusive'].map(right => (
                          <label key={right} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                            <input
                              type="checkbox"
                              className="rounded"
                              onChange={(e) => {
                                const rights = newAsset.metadata?.rights || [];
                                if (e.target.checked) {
                                  setNewAsset(prev => ({
                                    ...prev,
                                    metadata: { ...prev.metadata!, rights: [...rights, right] }
                                  }));
                                } else {
                                  setNewAsset(prev => ({
                                    ...prev,
                                    metadata: { ...prev.metadata!, rights: rights.filter(r => r !== right) }
                                  }));
                                }
                              }}
                            />
                            <span className="text-white capitalize">{right}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-white text-xl font-semibold mb-2">Ready to Register</h3>
                      <p className="text-white/70 mb-6">Your asset will be registered on Story Protocol with immutable proof of creation</p>
                      
                      {isRegistering && (
                        <div className="space-y-3">
                          <Progress value={66} className="h-2" />
                          <p className="text-white/70 text-sm">Registering asset on blockchain...</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
                <div className="flex space-x-3">
                  {currentStep < 4 ? (
                    <Button
                      onClick={nextStep}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRegistration}
                      disabled={isRegistering}
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      {isRegistering ? 'Registering...' : 'Register Asset'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card border-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">Total Assets</h3>
                <p className="text-3xl font-bold text-white">{assets.length}</p>
                <p className="text-green-400 text-sm">+2 this month</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">Verified Assets</h3>
                <p className="text-3xl font-bold text-white">
                  {assets.filter(a => a.status === 'verified').length}
                </p>
                <p className="text-blue-400 text-sm">100% verification rate</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">License Revenue</h3>
                <p className="text-3xl font-bold text-white">$2,847</p>
                <p className="text-green-400 text-sm">+15% from licenses</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IPAssetRegistry;
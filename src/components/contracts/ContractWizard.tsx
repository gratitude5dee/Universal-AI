import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, Users, FileText, Shield } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const steps: WizardStep[] = [
  { id: 'template', title: 'Select Template', description: 'Choose a contract template', icon: FileText },
  { id: 'details', title: 'Contract Details', description: 'Add basic information', icon: Shield },
  { id: 'parties', title: 'Add Parties', description: 'Define collaborators', icon: Users },
  { id: 'review', title: 'Review & Generate', description: 'AI-powered generation', icon: Sparkles },
];

const templates = [
  {
    id: 'performance',
    name: 'Performance Agreement',
    category: 'Live Events',
    description: 'Comprehensive venue performance contract with payment terms',
    recommended: true,
  },
  {
    id: 'collaboration',
    name: 'Collaboration Split Sheet',
    category: 'Music Rights',
    description: 'Revenue sharing for co-created works',
    recommended: true,
  },
  {
    id: 'licensing',
    name: 'Licensing Agreement',
    category: 'IP Rights',
    description: 'Music licensing and sync rights contract',
    recommended: false,
  },
  {
    id: 'management',
    name: 'Management Agreement',
    category: 'Business',
    description: 'Artist management representation contract',
    recommended: false,
  },
];

interface Party {
  id: string;
  name: string;
  role: string;
  email: string;
}

export const ContractWizard = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [contractDetails, setContractDetails] = useState({ name: '', description: '' });
  const [parties, setParties] = useState<Party[]>([{ id: '1', name: '', role: 'Collaborator', email: '' }]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const addParty = () => {
    setParties([...parties, { id: Date.now().toString(), name: '', role: 'Collaborator', email: '' }]);
  };

  const updateParty = (id: string, field: keyof Party, value: string) => {
    setParties(parties.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeParty = (id: string) => {
    setParties(parties.filter((p) => p.id !== id));
  };

  const canProceed = () => {
    if (currentStep === 0) return selectedTemplate !== '';
    if (currentStep === 1) return contractDetails.name.trim() !== '';
    if (currentStep === 2) return parties.every((p) => p.name.trim() !== '');
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl"
      >
        <Card className="glass-card border-white/20 shadow-2xl">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-white">Create New Contract</CardTitle>
              <Button variant="ghost" onClick={onClose} className="text-white/70 hover:text-white">
                ✕
              </Button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          index < currentStep
                            ? 'bg-green-500 text-white'
                            : index === currentStep
                            ? 'bg-studio-accent text-white'
                            : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {index < currentStep ? <CheckCircle size={20} /> : <StepIcon size={20} />}
                      </div>
                      <span className="text-xs text-white/70 mt-2 absolute top-12 whitespace-nowrap">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-green-500' : 'bg-white/10'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="p-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Template Selection */}
              {currentStep === 0 && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Select a Contract Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedTemplate === template.id
                            ? 'border-studio-accent bg-studio-accent/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-semibold">{template.name}</h4>
                          {template.recommended && <Badge className="bg-studio-accent/20 text-studio-accent">Recommended</Badge>}
                        </div>
                        <p className="text-white/60 text-sm mb-2">{template.description}</p>
                        <Badge variant="outline" className="border-white/20 text-white/70 text-xs">{template.category}</Badge>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contract Details */}
              {currentStep === 1 && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Contract Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm font-medium block mb-2">Contract Name</label>
                      <Input
                        value={contractDetails.name}
                        onChange={(e) => setContractDetails({ ...contractDetails, name: e.target.value })}
                        placeholder="e.g., Performance at The Fillmore - November 2024"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium block mb-2">Description (Optional)</label>
                      <Textarea
                        value={contractDetails.description}
                        onChange={(e) => setContractDetails({ ...contractDetails, description: e.target.value })}
                        placeholder="Add any additional context or notes..."
                        rows={4}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Sparkles className="text-blue-400 mt-1" size={20} />
                        <div>
                          <p className="text-blue-300 font-medium text-sm">AI Suggestion</p>
                          <p className="text-blue-200/80 text-sm mt-1">
                            Based on your selection, I recommend including standard payment terms and force majeure clauses.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Add Parties */}
              {currentStep === 2 && (
                <motion.div
                  key="parties"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Add Parties</h3>
                    <Button onClick={addParty} size="sm" className="bg-studio-accent hover:bg-studio-accent/90">
                      + Add Party
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {parties.map((party, index) => (
                      <div key={party.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-white/70 text-sm">Party {index + 1}</span>
                          {parties.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeParty(party.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input
                            placeholder="Full Name"
                            value={party.name}
                            onChange={(e) => updateParty(party.id, 'name', e.target.value)}
                            className="bg-white/10 border-white/20 text-white text-sm"
                          />
                          <Input
                            placeholder="Role (e.g., Artist, Venue)"
                            value={party.role}
                            onChange={(e) => updateParty(party.id, 'role', e.target.value)}
                            className="bg-white/10 border-white/20 text-white text-sm"
                          />
                          <Input
                            placeholder="Email Address"
                            type="email"
                            value={party.email}
                            onChange={(e) => updateParty(party.id, 'email', e.target.value)}
                            className="bg-white/10 border-white/20 text-white text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Generate */}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Review & Generate</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">Template</h4>
                      <p className="text-white/70">{templates.find((t) => t.id === selectedTemplate)?.name}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">Contract Name</h4>
                      <p className="text-white/70">{contractDetails.name}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-white font-medium mb-2">Parties ({parties.length})</h4>
                      <div className="space-y-2">
                        {parties.map((party) => (
                          <div key={party.id} className="flex items-center justify-between text-sm">
                            <span className="text-white/70">{party.name}</span>
                            <span className="text-white/50">{party.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Sparkles className="text-purple-400 mt-1" size={24} />
                        <div>
                          <p className="text-purple-300 font-semibold">AI Contract Generation</p>
                          <p className="text-purple-200/80 text-sm mt-1">
                            Your contract will be generated with industry-standard clauses, compliance checks, and AI-powered
                            optimization for fairness and clarity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Footer Navigation */}
          <div className="border-t border-white/10 p-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </Button>
            <Button
              onClick={currentStep === steps.length - 1 ? onClose : nextStep}
              disabled={!canProceed()}
              className="bg-studio-accent hover:bg-studio-accent/90"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Generate Contract
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

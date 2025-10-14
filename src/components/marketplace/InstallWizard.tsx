import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { MarketplaceListing } from '@/types/marketplace';

interface InstallWizardProps {
  listing: MarketplaceListing;
  open: boolean;
  onClose: () => void;
}

type InstallStep = 'dependencies' | 'configuration' | 'testing' | 'complete';

const InstallWizard: React.FC<InstallWizardProps> = ({ listing, open, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<InstallStep>('dependencies');
  const [isInstalling, setIsInstalling] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const steps = [
    { id: 'dependencies', label: 'Dependencies', icon: CheckCircle },
    { id: 'configuration', label: 'Configuration', icon: CheckCircle },
    { id: 'testing', label: 'Testing', icon: CheckCircle },
    { id: 'complete', label: 'Complete', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleInstallDependencies = async () => {
    setIsInstalling(true);
    // Simulate dependency installation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsInstalling(false);
    setCurrentStep('configuration');
  };

  const handleConfigure = () => {
    const newErrors = [];
    
    // Validate required fields
    if (listing.requiredPlugins.includes('openai') && !config.openai_key) {
      newErrors.push('OpenAI API Key is required');
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors([]);
    setCurrentStep('testing');
    handleTestConnection();
  };

  const handleTestConnection = async () => {
    setIsInstalling(true);
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsInstalling(false);
    setCurrentStep('complete');
  };

  const handleFinish = () => {
    onClose();
    navigate('/agents');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Install {listing.name}</DialogTitle>
          <DialogDescription>
            Follow these steps to install and configure the agent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between text-xs">
              {steps.map((step, idx) => (
                <span
                  key={step.id}
                  className={idx <= currentStepIndex ? 'text-primary font-medium' : 'text-muted-foreground'}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 'dependencies' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Dependencies Check</h3>
              <div className="space-y-2">
                {listing.dependencies.map((dep, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      {dep.type === 'required' ? (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium">{dep.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {dep.type === 'required' ? 'Required' : 'Optional'}
                        </div>
                      </div>
                    </div>
                    {dep.installed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Not installed</span>
                    )}
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleInstallDependencies} 
                disabled={isInstalling}
                className="w-full"
              >
                {isInstalling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Installing Dependencies...
                  </>
                ) : (
                  'Install Missing Dependencies'
                )}
              </Button>
            </div>
          )}

          {currentStep === 'configuration' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Enter the required credentials and settings for this agent.
              </p>

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.map((error, idx) => (
                      <div key={idx}>{error}</div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai_key">
                    OpenAI API Key <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="openai_key"
                    type="password"
                    placeholder="sk-..."
                    value={config.openai_key || ''}
                    onChange={(e) => setConfig({ ...config, openai_key: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Required for AI functionality. Get your key from{' '}
                    <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      OpenAI Platform <ExternalLink className="inline w-3 h-3" />
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github_token">GitHub Token (Optional)</Label>
                  <Input
                    id="github_token"
                    type="password"
                    placeholder="ghp_..."
                    value={config.github_token || ''}
                    onChange={(e) => setConfig({ ...config, github_token: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: For GitHub integration features
                  </p>
                </div>
              </div>

              <Button onClick={handleConfigure} className="w-full">
                Test Configuration
              </Button>
            </div>
          )}

          {currentStep === 'testing' && (
            <div className="space-y-4 text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
              <h3 className="font-semibold">Testing Connection...</h3>
              <p className="text-sm text-muted-foreground">
                Verifying your credentials and testing the agent configuration
              </p>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="space-y-4 text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-xl">Installation Complete!</h3>
              <p className="text-sm text-muted-foreground">
                {listing.name} has been successfully installed and configured.
                You can now start using it in your workspace.
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={handleFinish}>
                  Go to Agent Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstallWizard;

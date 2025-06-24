import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import WizardStepContent from "./WizardStepContent";

interface WizardViewProps {
  wizardStep: number;
  setWizardStep: (step: number) => void;
  agentPurpose: string;
  setAgentPurpose: (purpose: string) => void;
  blockchain: string;
  setBlockchain: (blockchain: string) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  outputFormat: string;
  setOutputFormat: (format: string) => void;
  feePercentage: string;
  setFeePercentage: (fee: string) => void;
}

const WizardView: React.FC<WizardViewProps> = ({
  wizardStep,
  setWizardStep,
  agentPurpose,
  setAgentPurpose,
  blockchain,
  setBlockchain,
  aiModel,
  setAiModel,
  outputFormat,
  setOutputFormat,
  feePercentage,
  setFeePercentage
}) => {
  const handleNextWizardStep = () => {
    if (wizardStep < 6) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handlePrevWizardStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  return (
    <div className="glass-card p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white text-shadow-sm animate-glow-pulse">AI Agent Wizard</h2>
        <div className="text-sm font-medium text-white text-shadow-sm">Step {wizardStep} of 6</div>
      </div>
      
      <div className="mb-6">
        <div className="h-2 bg-white/10 rounded-full">
          <div 
            className="h-2 bg-purple-500 rounded-full transition-all animate-glow-pulse" 
            style={{ width: `${(wizardStep / 6) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-white/70 text-shadow-sm">Purpose</span>
          <span className="text-xs text-white/70 text-shadow-sm">Economics</span>
        </div>
      </div>
      
      <WizardStepContent 
        wizardStep={wizardStep}
        agentPurpose={agentPurpose}
        setAgentPurpose={setAgentPurpose}
        blockchain={blockchain}
        setBlockchain={setBlockchain}
        aiModel={aiModel}
        setAiModel={setAiModel}
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        feePercentage={feePercentage}
        setFeePercentage={setFeePercentage}
      />
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevWizardStep}
          disabled={wizardStep === 1}
          className="text-white border-white/30 hover:bg-white/10"
        >
          Back
        </Button>
        
        <Button
          onClick={handleNextWizardStep}
          disabled={wizardStep === 6}
          className="bg-studio-accent hover:bg-studio-accent/90 text-white"
        >
          {wizardStep === 6 ? 'Create Agent' : 'Continue'}
          {wizardStep !== 6 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default WizardView;
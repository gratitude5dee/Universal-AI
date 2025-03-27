
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
    <div className="bg-white rounded-xl border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-dark">AI Agent Wizard</h2>
        <div className="text-sm font-medium text-blue-dark">Step {wizardStep} of 6</div>
      </div>
      
      <div className="mb-6">
        <div className="h-2 bg-gray-100 rounded-full">
          <div 
            className="h-2 bg-purple-500 rounded-full transition-all" 
            style={{ width: `${(wizardStep / 6) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-blue-dark">Purpose</span>
          <span className="text-xs text-blue-dark">Economics</span>
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
        >
          Back
        </Button>
        
        <Button
          onClick={handleNextWizardStep}
          disabled={wizardStep === 6}
        >
          {wizardStep === 6 ? 'Create Agent' : 'Continue'}
          {wizardStep !== 6 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default WizardView;

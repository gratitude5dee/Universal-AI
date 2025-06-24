import React from "react";
import PurposeStep from "./PurposeStep";
import BlockchainStep from "./BlockchainStep";
import EventTriggersStep from "./EventTriggersStep";
import AIModelStep from "./AIModelStep";
import OutputConfigStep from "./OutputConfigStep";
import EconomicStep from "./EconomicStep";

interface WizardStepContentProps {
  wizardStep: number;
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

const WizardStepContent: React.FC<WizardStepContentProps> = ({
  wizardStep,
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
  switch (wizardStep) {
    case 1:
      return (
        <PurposeStep 
          agentPurpose={agentPurpose} 
          setAgentPurpose={setAgentPurpose} 
        />
      );
    
    case 2:
      return (
        <BlockchainStep 
          blockchain={blockchain} 
          setBlockchain={setBlockchain} 
          agentPurpose={agentPurpose} 
        />
      );
    
    case 3:
      return <EventTriggersStep />;
    
    case 4:
      return (
        <AIModelStep 
          aiModel={aiModel} 
          setAiModel={setAiModel} 
          agentPurpose={agentPurpose} 
        />
      );
    
    case 5:
      return (
        <OutputConfigStep 
          outputFormat={outputFormat} 
          setOutputFormat={setOutputFormat} 
        />
      );
    
    case 6:
      return (
        <EconomicStep 
          feePercentage={feePercentage} 
          setFeePercentage={setFeePercentage} 
          agentPurpose={agentPurpose} 
        />
      );
        
    default:
      return null;
  }
};

export default WizardStepContent;
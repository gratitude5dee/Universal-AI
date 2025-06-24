import React from "react";
import { Button } from "@/components/ui/button";
import TableOfContents from "@/components/agent/TableOfContents";
import BasicInfoSection from "@/components/agent/BasicInfoSection";
import KnowledgeSection from "@/components/agent/KnowledgeSection";
import MessageExamplesSection from "@/components/agent/MessageExamplesSection";
import PostExamplesSection from "@/components/agent/PostExamplesSection";
import StyleSection from "@/components/agent/StyleSection";
import LoreSection from "@/components/agent/LoreSection";
import TopicsAndAdjectives from "@/components/agent/TopicsAndAdjectives";
import BioSection from "@/components/agent/BioSection";
import SecretsSection from "@/components/agent/SecretsSection";
import AgentConfirmation from "@/components/agent/AgentConfirmation";

interface FormViewProps {
  currentStep: 'form' | 'secrets' | 'confirmation';
  setCurrentStep: (step: 'form' | 'secrets' | 'confirmation') => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

const FormView: React.FC<FormViewProps> = ({
  currentStep,
  setCurrentStep,
  activeSection,
  setActiveSection,
  handleScroll
}) => {
  const handleContinue = () => {
    if (currentStep === 'form') {
      setCurrentStep('secrets');
    } else if (currentStep === 'secrets') {
      setCurrentStep('confirmation');
    }
  };

  const handleGoBack = () => {
    if (currentStep === 'confirmation') {
      setCurrentStep('secrets');
    } else if (currentStep === 'secrets') {
      setCurrentStep('form');
    }
  };

  return (
    <>
      {currentStep === 'form' && (
        <div className="grid md:grid-cols-[280px_1fr] gap-6 h-full">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 h-fit sticky top-4">
            <TableOfContents activeSection={activeSection} />
          </div>
          
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 max-h-[75vh] overflow-auto" onScroll={handleScroll}>
            <BasicInfoSection />
            <BioSection />
            <LoreSection />
            <KnowledgeSection />
            <MessageExamplesSection />
            <PostExamplesSection />
            <StyleSection />
            <TopicsAndAdjectives />
          </div>
        </div>
      )}
      
      {currentStep === 'secrets' && (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
          <SecretsSection />
        </div>
      )}
      
      {currentStep === 'confirmation' && (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
          <AgentConfirmation 
            name="Trump" 
            modelProvider="OpenAI" 
            clients={["X (Twitter)"]} 
            onGoBack={handleGoBack}
          />
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleGoBack}
          disabled={currentStep === 'form'}
          className="text-white border-white/30 hover:bg-white/10"
        >
          Back
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={currentStep === 'confirmation'}
          className="bg-studio-accent hover:bg-studio-accent/90 text-white"
        >
          {currentStep === 'form' ? 'Next: Configuration' : currentStep === 'secrets' ? 'Next: Confirmation' : 'Create Agent'}
        </Button>
      </div>
    </>
  );
};

export default FormView;
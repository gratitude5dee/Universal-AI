import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import WizardStepContent from "./WizardStepContent";

interface WizardViewProps {
  wizardStep: number;
  setWizardStep: (step: number) => void;
  archetype: string;
  setArchetype: (archetype: string) => void;
  template: string | null;
  setTemplate: (template: string | null) => void;
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
  voiceProvider: string;
  setVoiceProvider: (provider: string) => void;
  voiceId: string;
  setVoiceId: (id: string) => void;
  bio: string[];
  setBio: (bio: string[]) => void;
  lore: string[];
  setLore: (lore: string[]) => void;
  topics: string[];
  setTopics: (topics: string[]) => void;
  adjectives: string[];
  setAdjectives: (adjectives: string[]) => void;
  blockchain: string;
  setBlockchain: (blockchain: string) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  launchMode: string;
  setLaunchMode: (mode: string) => void;
}

const WizardView: React.FC<WizardViewProps> = ({
  wizardStep,
  setWizardStep,
  archetype,
  setArchetype,
  template,
  setTemplate,
  name,
  setName,
  username,
  setUsername,
  avatar,
  setAvatar,
  voiceProvider,
  setVoiceProvider,
  voiceId,
  setVoiceId,
  bio,
  setBio,
  lore,
  setLore,
  topics,
  setTopics,
  adjectives,
  setAdjectives,
  blockchain,
  setBlockchain,
  aiModel,
  setAiModel,
  launchMode,
  setLaunchMode
}) => {
  const handleNextWizardStep = () => {
    if (wizardStep < 7) {
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
        <h2 className="text-xl font-semibold text-[hsl(var(--text-primary))] animate-glow-pulse">AI Agent Wizard</h2>
        <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Step {wizardStep} of 7</div>
      </div>
      
      <div className="mb-6">
        <div className="h-2 bg-white/10 rounded-full">
          <div 
            className="h-2 bg-[hsl(var(--accent-purple))] rounded-full transition-all animate-glow-pulse" 
            style={{ width: `${(wizardStep / 7) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[hsl(var(--text-tertiary))]">Archetype</span>
          <span className="text-xs text-[hsl(var(--text-tertiary))]">Deploy</span>
        </div>
      </div>
      
      <WizardStepContent 
        wizardStep={wizardStep}
        archetype={archetype}
        setArchetype={setArchetype}
        template={template}
        setTemplate={setTemplate}
        name={name}
        setName={setName}
        username={username}
        setUsername={setUsername}
        avatar={avatar}
        setAvatar={setAvatar}
        voiceProvider={voiceProvider}
        setVoiceProvider={setVoiceProvider}
        voiceId={voiceId}
        setVoiceId={setVoiceId}
        bio={bio}
        setBio={setBio}
        lore={lore}
        setLore={setLore}
        topics={topics}
        setTopics={setTopics}
        adjectives={adjectives}
        setAdjectives={setAdjectives}
        blockchain={blockchain}
        setBlockchain={setBlockchain}
        aiModel={aiModel}
        setAiModel={setAiModel}
        launchMode={launchMode}
        setLaunchMode={setLaunchMode}
      />
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevWizardStep}
          disabled={wizardStep === 1}
          className="text-[hsl(var(--text-primary))] border-white/30 hover:bg-white/10"
        >
          Back
        </Button>
        
        <Button
          onClick={handleNextWizardStep}
          disabled={wizardStep === 7}
          className="bg-[hsl(var(--accent-purple))] hover:bg-[hsl(var(--accent-purple))]/90 text-white"
        >
          {wizardStep === 7 ? 'Create Agent' : 'Continue'}
          {wizardStep !== 7 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default WizardView;
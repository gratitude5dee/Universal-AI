import React from "react";
import ArchetypeSelector from "./ArchetypeSelector";
import TemplateLibrary from "./TemplateLibrary";
import CoreConfig from "./CoreConfig";
import PersonalityBuilder from "./PersonalityBuilder";
import BlockchainStep from "./BlockchainStep";
import AIModelStep from "./AIModelStep";
import ReviewSummary from "./ReviewSummary";

interface WizardStepContentProps {
  wizardStep: number;
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

const WizardStepContent: React.FC<WizardStepContentProps> = ({
  wizardStep,
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
  switch (wizardStep) {
    case 1:
      return (
        <ArchetypeSelector 
          selectedArchetype={archetype} 
          setSelectedArchetype={setArchetype} 
        />
      );
    
    case 2:
      return (
        <TemplateLibrary 
          selectedArchetype={archetype}
          selectedTemplate={template}
          setSelectedTemplate={setTemplate}
        />
      );
    
    case 3:
      return (
        <CoreConfig 
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
        />
      );
    
    case 4:
      return (
        <PersonalityBuilder 
          bio={bio}
          setBio={setBio}
          lore={lore}
          setLore={setLore}
          topics={topics}
          setTopics={setTopics}
          adjectives={adjectives}
          setAdjectives={setAdjectives}
        />
      );
    
    case 5:
      return (
        <BlockchainStep 
          blockchain={blockchain} 
          setBlockchain={setBlockchain} 
          agentPurpose={archetype}
        />
      );
    
    case 6:
      return (
        <AIModelStep 
          aiModel={aiModel} 
          setAiModel={setAiModel} 
          agentPurpose={archetype}
        />
      );
    
    case 7:
      return (
        <ReviewSummary 
          config={{
            name,
            username,
            archetype,
            template,
            avatar,
            bio,
            topics,
            adjectives,
            voiceProvider
          }}
          launchMode={launchMode}
          setLaunchMode={setLaunchMode}
        />
      );
        
    default:
      return null;
  }
};

export default WizardStepContent;
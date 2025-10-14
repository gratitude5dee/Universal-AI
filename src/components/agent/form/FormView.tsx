import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, User, FileText, Book, Lightbulb, MessageCircle, MessageSquare, Palette, Hash, Download, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import BasicInfoSection from "../BasicInfoSection";
import BioSection from "../BioSection";
import LoreSection from "../LoreSection";
import KnowledgeSection from "../KnowledgeSection";
import MessageExamplesSection from "../MessageExamplesSection";
import PostExamplesSection from "../PostExamplesSection";
import StyleSection from "../StyleSection";
import TopicsAndAdjectives from "../TopicsAndAdjectives";
import EnhancedTableOfContents from "../EnhancedTableOfContents";
import EnhancedSecretsSection from "../EnhancedSecretsSection";
import EnhancedConfirmation from "../EnhancedConfirmation";
import SectionCard from "../SectionCard";
import ProgressStepper from "../ProgressStepper";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { toast } from "@/hooks/use-toast";

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
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  const { 
    data: formData, 
    updateData, 
    saveData, 
    exportData, 
    importData, 
    lastSaved, 
    hasUnsavedChanges 
  } = useFormPersistence({}, { key: 'agent-form-data' });

  const steps = [
    { id: 'form', label: 'Configuration', description: 'Basic setup' },
    { id: 'secrets', label: 'Credentials', description: 'API keys' },
    { id: 'confirmation', label: 'Review', description: 'Deploy' },
  ];

  const completedSteps = currentStep === 'secrets' 
    ? ['form'] 
    : currentStep === 'confirmation' 
    ? ['form', 'secrets'] 
    : [];

  return (
    <div className="space-y-6">
      <ProgressStepper
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={(stepId) => {
          if (completedSteps.includes(stepId) || stepId === currentStep) {
            setCurrentStep(stepId as any);
          }
        }}
      />

      {hasUnsavedChanges && (
        <div className="flex items-center justify-between px-4 py-2 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg text-sm">
          <span className="text-[hsl(var(--text-secondary))]">
            {lastSaved ? `Saved ${Math.floor((Date.now() - lastSaved.getTime()) / 1000)}s ago` : 'Unsaved changes'}
          </span>
          <Button onClick={saveData} variant="ghost" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-1">
          {currentStep === 'form' && (
            <div className="space-y-6">
              <div className="space-y-6 max-h-[calc(100vh-350px)] overflow-y-auto pr-4" onScroll={handleScroll}>
                <SectionCard id="name" title="Basic Information" icon={<User className="w-5 h-5" />} required>
                  <BasicInfoSection />
                </SectionCard>
                <SectionCard id="bio" title="Bio" icon={<FileText className="w-5 h-5" />}>
                  <BioSection />
                </SectionCard>
                <SectionCard id="lore" title="Lore" icon={<Book className="w-5 h-5" />}>
                  <LoreSection />
                </SectionCard>
                <SectionCard id="knowledge" title="Knowledge" icon={<Lightbulb className="w-5 h-5" />}>
                  <KnowledgeSection />
                </SectionCard>
                <SectionCard id="messageExamples" title="Messages" icon={<MessageCircle className="w-5 h-5" />}>
                  <MessageExamplesSection />
                </SectionCard>
                <SectionCard id="postExamples" title="Posts" icon={<MessageSquare className="w-5 h-5" />}>
                  <PostExamplesSection />
                </SectionCard>
                <SectionCard id="style" title="Style" icon={<Palette className="w-5 h-5" />}>
                  <StyleSection />
                </SectionCard>
                <SectionCard id="topics" title="Topics & Adjectives" icon={<Hash className="w-5 h-5" />}>
                  <TopicsAndAdjectives />
                </SectionCard>
              </div>
              
              <div className="flex justify-between pt-6 border-t border-white/10">
                <div className="flex gap-2">
                  <Button onClick={exportData} variant="outline" className="border-white/20">
                    <Download className="w-4 h-4 mr-2" />Export
                  </Button>
                  <label>
                    <Button variant="outline" className="border-white/20" asChild>
                      <span><Upload className="w-4 h-4 mr-2" />Import</span>
                    </Button>
                    <input type="file" accept=".json" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) importData(file);
                    }} />
                  </label>
                </div>
                <Button onClick={() => setCurrentStep('secrets')} className="bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))]">
                  Continue <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 'secrets' && (
            <div className="space-y-6">
              <EnhancedSecretsSection />
              <div className="flex justify-between pt-6 border-t border-white/10">
                <Button onClick={() => setCurrentStep('form')} variant="outline" className="border-white/20">
                  <ChevronLeft className="h-4 w-4 mr-2" />Back
                </Button>
                <Button onClick={() => setCurrentStep('confirmation')} className="bg-gradient-to-r from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-blue))]">
                  Continue <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 'confirmation' && (
            <EnhancedConfirmation
              name="Trump"
              modelProvider="OpenAI"
              clients={["X (Twitter)"]}
              onGoBack={() => setCurrentStep('secrets')}
              formData={formData}
            />
          )}
        </div>

        {currentStep === 'form' && (
          <div className="hidden lg:block w-72 flex-shrink-0">
            <EnhancedTableOfContents 
              activeSection={activeSection}
              completedSections={completedSections}
              sectionProgress={sectionProgress}
              onSectionClick={setActiveSection}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormView;

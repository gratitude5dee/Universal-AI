import React, { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Settings } from "lucide-react";
import WizardView from "@/components/agent/wizard/WizardView";
import FormView from "@/components/agent/form/FormView";

const CreateAgent = () => {
  // Form view state
  const [currentStep, setCurrentStep] = useState<'form' | 'secrets' | 'confirmation'>('form');
  const [activeSection, setActiveSection] = useState<string>("name");
  
  // Wizard view state
  const [wizardStep, setWizardStep] = useState(1);
  const [agentPurpose, setAgentPurpose] = useState("art");
  const [blockchain, setBlockchain] = useState("ethereum");
  const [aiModel, setAiModel] = useState("gpt-4o");
  const [outputFormat, setOutputFormat] = useState("image");
  const [feePercentage, setFeePercentage] = useState("5");

  // Handle scrolling to update the active section in the form view
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const sections = [
      "startTemplate", "name", "avatar", "modelProvider", "clients", "plugins", 
      "bio", "lore", "knowledge", "messageExamples", "postExamples", "style", 
      "topics", "adjectives"
    ];
    
    const scrollPosition = e.currentTarget.scrollTop;
    
    // Find which section is currently in view
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { top } = element.getBoundingClientRect();
        const offset = 100; // Adjust based on your layout
        
        if (top <= offset) {
          setActiveSection(section);
        }
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="container mx-auto py-6 px-4 md:px-6 flex-1">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white animate-text-glow">Create AI Agent</h1>
              <p className="text-white/80 text-shadow-sm">Configure and deploy your creative AI agent</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">
              <Tabs defaultValue="wizard" className="flex-1">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                  <TabsTrigger value="wizard" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Step-by-Step Wizard
                  </TabsTrigger>
                  <TabsTrigger value="form" className="text-white data-[state=active]:bg-studio-accent data-[state=active]:text-white">
                    <Bot className="w-4 h-4 mr-2" />
                    Detailed Form
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="wizard" className="flex-1 space-y-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
                  <WizardView 
                    wizardStep={wizardStep}
                    setWizardStep={setWizardStep}
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
                </TabsContent>
                
                <TabsContent value="form" className="flex-1 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
                  <FormView 
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    handleScroll={handleScroll}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateAgent;
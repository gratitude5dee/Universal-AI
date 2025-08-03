
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Users, 
  Building, 
  Globe, 
  Clock, 
  Calendar, 
  FileText, 
  Check,
  Lock,
  Shield,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransferStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const RightsTransferWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showWizard, setShowWizard] = useState(false);
  
  const steps: TransferStep[] = [
    {
      id: 1,
      title: "Transfer Type",
      description: "Choose between full rights transfer or licensing agreement",
      icon: Shield
    },
    {
      id: 2,
      title: "Recipient",
      description: "Select the recipient of the rights transfer",
      icon: User
    },
    {
      id: 3,
      title: "Terms & Scope",
      description: "Define the scope and limitations of the transfer",
      icon: FileText
    },
    {
      id: 4,
      title: "Timeframe",
      description: "Set the duration and key dates for the agreement",
      icon: Calendar
    },
    {
      id: 5,
      title: "Compensation",
      description: "Define payment terms and royalty arrangements",
      icon: DollarSign
    },
    {
      id: 6,
      title: "Review & Confirm",
      description: "Review all terms and finalize the agreement",
      icon: Check
    }
  ];
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const toggleWizard = () => {
    setShowWizard(!showWizard);
    if (!showWizard) {
      setCurrentStep(1);
    }
  };
  
  const transferTypes = [
    {
      id: "full",
      title: "Full Rights Transfer",
      description: "Transfer complete ownership and control to the recipient",
      icon: Lock,
    },
    {
      id: "exclusive",
      title: "Exclusive License",
      description: "Grant exclusive usage rights while retaining ownership",
      icon: Users,
    },
    {
      id: "non-exclusive",
      title: "Non-Exclusive License",
      description: "Allow usage while retaining ability to license to others",
      icon: Globe,
    },
    {
      id: "time-limited",
      title: "Time-Limited Transfer",
      description: "Transfer rights for a specific time period with automatic reversion",
      icon: Clock,
    }
  ];
  
  const recipientTypes = [
    {
      id: "individual",
      title: "Individual",
      description: "Transfer rights to a single person",
      icon: User,
    },
    {
      id: "company",
      title: "Company or Organization",
      description: "Transfer rights to a legal entity",
      icon: Building,
    },
    {
      id: "multiple",
      title: "Multiple Recipients",
      description: "Transfer rights to several parties with custom splits",
      icon: Users,
    }
  ];

  return (
    <div className="mt-6">
      <motion.div 
        className={`p-4 rounded-lg border ${showWizard ? 'border-[#9b87f5]' : 'border-[#9b87f5]/30'} ${showWizard ? 'bg-[#F1F0FB]' : 'bg-[#9b87f5]/5'} flex flex-col`}
        whileHover={{ scale: 1.01 }}
        animate={{ height: showWizard ? 'auto' : 'auto' }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        <div className="flex items-center justify-between cursor-pointer" onClick={toggleWizard}>
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Lock size={18} className="text-[#9b87f5]" />
            </div>
            <div>
              <h3 className="font-medium">Rights Transfer Wizard</h3>
              <p className="text-sm text-studio-clay">Transfer or license your IP rights to others</p>
            </div>
          </div>
          <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]">
            {showWizard ? "Close Wizard" : "Start Transfer"}
          </Button>
        </div>
        
        {showWizard && (
          <div className="mt-6">
            <div className="flex justify-between mb-6">
              {steps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div 
                    key={step.id}
                    className="flex flex-col items-center"
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep === step.id 
                          ? 'bg-[#9b87f5] text-white' 
                          : currentStep > step.id 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {currentStep > step.id ? <Check size={18} /> : <StepIcon size={18} />}
                    </div>
                    <div className="text-center mt-2">
                      <p className={`text-xs font-medium ${currentStep === step.id ? 'text-[#9b87f5]' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                    </div>
                    <div 
                      className={`h-1 w-[50px] ${
                        step.id === steps.length ? 'hidden' : 'block'
                      } ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      } absolute translate-x-[30px]`}
                    ></div>
                  </div>
                )
              })}
            </div>
            
            <div className="glass-card p-6 rounded-lg border border-white/10 backdrop-blur-md mt-6">
              <h4 className="text-lg font-medium mb-2">{steps[currentStep-1].title}</h4>
              <p className="text-sm text-studio-clay mb-6">{steps[currentStep-1].description}</p>
              
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transferTypes.map((type) => {
                    const TypeIcon = type.icon;
                    return (
                      <motion.div
                        key={type.id}
                        className="p-4 border border-studio-sand/30 rounded-lg hover:border-[#9b87f5]/50 cursor-pointer"
                        whileHover={{ scale: 1.02, borderColor: "#9b87f5" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-[#F1F0FB]">
                            <TypeIcon size={18} className="text-[#9b87f5]" />
                          </div>
                          <div>
                            <h5 className="font-medium">{type.title}</h5>
                            <p className="text-xs text-studio-clay mt-1">{type.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recipientTypes.map((type) => {
                    const TypeIcon = type.icon;
                    return (
                      <motion.div
                        key={type.id}
                        className="p-4 border border-studio-sand/30 rounded-lg hover:border-[#9b87f5]/50 cursor-pointer"
                        whileHover={{ scale: 1.02, borderColor: "#9b87f5" }}
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className="p-2 rounded-full bg-[#F1F0FB]">
                            <TypeIcon size={18} className="text-[#9b87f5]" />
                          </div>
                          <h5 className="font-medium">{type.title}</h5>
                          <p className="text-xs text-studio-clay">{type.description}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F1F0FB] rounded-lg flex items-start gap-3">
                    <AlertTriangle size={18} className="text-[#9b87f5] mt-0.5" />
                    <p className="text-sm">Defining the scope of your transfer is critical to protecting your future rights. Be specific about what uses are permitted and what limitations apply.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-studio-sand/30 rounded-lg">
                      <h5 className="font-medium mb-2">Rights Included</h5>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Reproduction Rights</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Distribution Rights</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Public Performance Rights</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Derivative Works Rights</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Display Rights</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-studio-sand/30 rounded-lg">
                      <h5 className="font-medium mb-2">Scope Limitations</h5>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Territory Restrictions</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Media Type Limitations</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Industry Restrictions</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Usage Context Limitations</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded text-[#9b87f5]" />
                          <span>Non-Commercial Only</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep > 3 && (
                <div className="flex items-center justify-center p-10">
                  <p className="text-studio-clay">Additional wizard steps will be configured here...</p>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
                
                <Button 
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] gap-2"
                  onClick={handleNext}
                >
                  {currentStep === steps.length ? 'Complete' : 'Next'}
                  {currentStep !== steps.length && <ArrowRight size={16} />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RightsTransferWizard;


import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Download, Send, Zap, Bot, ChevronRight, 
  Landmark, Wallet, Globe, Plus, Shield, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface AccountSetupWizardProps {
  wizardStep: number;
  totalSteps: number;
  setWizardStep: (step: number) => void;
  finishWizard: () => void;
  setHasAccount: (hasAccount: boolean) => void;
}

const AccountSetupWizard: React.FC<AccountSetupWizardProps> = ({
  wizardStep,
  totalSteps,
  setWizardStep,
  finishWizard,
  setHasAccount,
}) => {
  const getWizardTitle = () => {
    switch(wizardStep) {
      case 1: return "Select Account Purpose";
      case 2: return "Choose Your Agent";
      case 3: return "Select Account Type";
      case 4: return "Initial Funding";
      case 5: return "Risk Profile & Limits";
      case 6: return "Compliance Verification";
      default: return "Create Agent Account";
    }
  };

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{getWizardTitle()}</h2>
        <div className="flex items-center mt-4 mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300", 
                  wizardStep > index 
                    ? "bg-studio-accent text-white" 
                    : wizardStep === index + 1 
                      ? "bg-studio-accent/20 text-studio-accent border border-studio-accent" 
                      : "bg-studio-sand/30 text-studio-charcoal"
                )}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div 
                  className={cn(
                    "h-0.5 w-12 transition-all duration-300",
                    wizardStep > index + 1 
                      ? "bg-studio-accent" 
                      : "bg-studio-sand/50"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={wizardStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[320px]"
        >
          {wizardStep === 1 && (
            <div className="grid grid-cols-3 gap-4">
              <div onClick={() => setWizardStep(2)} className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-studio-accent/50">
                <div className="mb-3 bg-studio-highlight/30 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Download className="h-6 w-6 text-studio-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">Payment Collection</h3>
                <p className="text-muted-foreground text-sm">Receive payments from clients and services automatically.</p>
              </div>
              <div onClick={() => setWizardStep(2)} className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-studio-accent/50">
                <div className="mb-3 bg-studio-highlight/30 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Send className="h-6 w-6 text-studio-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">Disbursement</h3>
                <p className="text-muted-foreground text-sm">Pay for services and subscriptions without manual approval.</p>
              </div>
              <div onClick={() => setWizardStep(2)} className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-studio-accent/50">
                <div className="mb-3 bg-studio-highlight/30 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Zap className="h-6 w-6 text-studio-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">Full Autonomy</h3>
                <p className="text-muted-foreground text-sm">Complete financial freedom within your defined limits.</p>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search agents..."
                  className="w-full p-3 rounded-lg glass-card border border-white/10 backdrop-blur-md mb-4 pl-10"
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                {[1, 2, 3, 4].map((index) => (
                  <div 
                    key={index}
                    onClick={() => setWizardStep(3)}
                    className="flex items-center p-3 glass-card rounded-lg border border-white/10 backdrop-blur-md cursor-pointer hover:border-studio-accent/50"
                  >
                    <div className="bg-studio-highlight/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <Bot className="h-5 w-5 text-studio-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Research Assistant {index}</h4>
                      <p className="text-xs text-muted-foreground">Created on {new Date(2023, 0, index * 5).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="grid grid-cols-3 gap-4">
              <div onClick={() => setWizardStep(4)} className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-studio-accent/50">
                <div className="mb-3 bg-studio-highlight/30 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Landmark className="h-6 w-6 text-studio-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">Checking</h3>
                <p className="text-muted-foreground text-sm">Standard account for regular transactions.</p>
              </div>
              <div onClick={() => setWizardStep(4)} className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-studio-accent/50">
                <div className="mb-3 bg-studio-highlight/30 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Wallet className="h-6 w-6 text-studio-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">Savings</h3>
                <p className="text-muted-foreground text-sm">Optimized for saving funds with limited transactions.</p>
              </div>
              <div onClick={() => setWizardStep(4)} className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-studio-accent/50">
                <div className="mb-3 bg-studio-highlight/30 w-12 h-12 flex items-center justify-center rounded-lg">
                  <Globe className="h-6 w-6 text-studio-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">Multi-Currency</h3>
                <p className="text-muted-foreground text-sm">Hold and transact in multiple currencies.</p>
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-5">
              <div className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-medium mb-3">Initial Deposit</h3>
                <div className="flex items-end gap-4 mb-5">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground mb-1 block">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <input
                        type="text"
                        defaultValue="1000.00"
                        className="w-full p-2 rounded-lg glass-card border border-white/10 backdrop-blur-md pl-8"
                      />
                    </div>
                  </div>
                  <Button onClick={() => setWizardStep(5)} variant="outline" className="mb-0.5">Continue</Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-studio-highlight/10 rounded-lg cursor-pointer">
                    <input type="radio" name="fundingSource" id="mainAccount" defaultChecked className="mr-3" />
                    <div className="flex-1">
                      <label htmlFor="mainAccount" className="font-medium cursor-pointer">Transfer from Main Account</label>
                      <p className="text-xs text-muted-foreground">Available balance: $12,459.32</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 glass-card rounded-lg border border-white/10 backdrop-blur-md cursor-pointer">
                    <input type="radio" name="fundingSource" id="externalSource" className="mr-3" />
                    <div className="flex-1">
                      <label htmlFor="externalSource" className="font-medium cursor-pointer">Connect External Funding Source</label>
                      <p className="text-xs text-muted-foreground">Link your bank account or credit card</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {wizardStep === 5 && (
            <div className="space-y-5">
              <div className="glass-card p-5 rounded-xl border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-medium mb-4">Transaction Limits</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-muted-foreground">Per Transaction Limit</label>
                      <span className="text-sm font-medium">$500</span>
                    </div>
                    <input type="range" min="100" max="10000" defaultValue="500" className="w-full" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-muted-foreground">Daily Limit</label>
                      <span className="text-sm font-medium">$2,000</span>
                    </div>
                    <input type="range" min="100" max="20000" defaultValue="2000" className="w-full" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-muted-foreground">Monthly Limit</label>
                      <span className="text-sm font-medium">$10,000</span>
                    </div>
                    <input type="range" min="1000" max="50000" defaultValue="10000" className="w-full" />
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-studio-sand/30">
                  <h4 className="text-sm font-medium mb-3">Approval Requirements</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="exceedLimit" defaultChecked className="mr-2" />
                      <label htmlFor="exceedLimit" className="text-sm">Require approval for transactions exceeding limits</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input type="checkbox" id="newRecipient" defaultChecked className="mr-2" />
                      <label htmlFor="newRecipient" className="text-sm">Require approval for first-time recipients</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input type="checkbox" id="highRisk" defaultChecked className="mr-2" />
                      <label htmlFor="highRisk" className="text-sm">Require approval for high-risk categories</label>
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => setWizardStep(6)} className="w-full mt-5">Continue</Button>
              </div>
            </div>
          )}

          {wizardStep === 6 && (
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-lg border border-white/10 backdrop-blur-md">
                <div className="flex items-start mb-3">
                  <Shield className="h-5 w-5 text-studio-accent mr-2 mt-0.5" />
                  <h3 className="text-lg font-medium">Compliance Information</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  By creating an Agent Banking account, you acknowledge that you will comply with all applicable financial regulations and that your agent's transactions will be monitored for fraud prevention and regulatory compliance.
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <p className="text-sm">Transactions will be monitored and logged for regulatory compliance</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <p className="text-sm">You remain responsible for your agent's financial activities</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <p className="text-sm">Suspicious activities will be flagged for review</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-5">
                  <input type="checkbox" id="agreeTerms" className="mr-2" />
                  <label htmlFor="agreeTerms" className="text-sm">
                    I have read and agree to the <a href="#" className="text-studio-accent underline">Terms of Service</a> and <a href="#" className="text-studio-accent underline">Agent Banking Agreement</a>
                  </label>
                </div>
                
                <Button onClick={finishWizard} className="w-full">Create Agent Account</Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setHasAccount(true)}
        >
          Back
        </Button>
        
        <Button 
          onClick={() => wizardStep < totalSteps ? setWizardStep(wizardStep + 1) : finishWizard()}
          disabled={wizardStep === totalSteps}
        >
          {wizardStep < totalSteps ? "Next" : "Create Account"}
        </Button>
      </div>
    </motion.div>
  );
};

export default AccountSetupWizard;

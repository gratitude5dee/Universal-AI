import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Twitter, Github, Figma, Database, FileText, Share2 } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';

interface Connector {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface DataConnectorsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const connectors: Connector[] = [
  { id: 'twitter', name: 'Twitter / X', icon: Twitter },
  { id: 'google_drive', name: 'Google Drive', icon: Database }, // Using Database as a generic icon
  { id: 'github', name: 'GitHub', icon: Github },
  { id: 'notion', name: 'Notion', icon: FileText }, // Using FileText as a generic icon
  { id: 'dropbox', name: 'Dropbox', icon: Share2 }, // Using Share2 as a generic icon
  { id: 'figma', name: 'Figma', icon: Figma }
];

const DataConnectorsStep: React.FC<DataConnectorsStepProps> = ({ onNext, onBack }) => {
  const { connectedAccounts, toggleConnectedAccount } = useOnboarding();
  const { handleAreaClick } = useOnboardingNavigation({ onNext, onBack });

  return (
    <div 
      className="bg-background/20 backdrop-blur-sm border border-border rounded-lg max-w-3xl mx-auto p-8 cursor-pointer"
      onClick={handleAreaClick}
      role="button"
      tabIndex={0}
      aria-label="Click anywhere or press Enter/Space to continue to next step"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Connect the Constellations</h2>
        <p className="text-muted-foreground">Link your existing digital universe to provide context for your AI.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6"> {/* Increased gap slightly */}
        {connectors.map((connector, index) => {
          const isConnected = connectedAccounts.includes(connector.id);
          const IconComponent = connector.icon;
          return (
            <motion.div
              key={connector.id}
              className={`relative p-6 border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ${
                isConnected ? 'bg-cyan-500/20 border-cyan-500 shadow-cyan-500/30' : 'bg-slate-700/30 border-slate-600 hover:bg-slate-600/40 hover:border-slate-500'
              }`}
              onClick={() => toggleConnectedAccount(connector.id)}
              data-interactive="true"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: `0px 10px 20px rgba(0, 255, 255, 0.2)` }} // Enhanced hover
            >
              <AnimatePresence>
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-2 right-2"
                  >
                    <CheckCircle className="h-6 w-6 text-cyan-400" />
                  </motion.div>
                )}
              </AnimatePresence>
              <IconComponent className={`w-10 h-10 mb-3 ${isConnected ? 'text-cyan-400' : 'text-slate-300'}`}/>
              <span className={`text-sm font-medium ${isConnected ? 'text-cyan-50' : 'text-slate-100'}`}>{connector.name}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between mt-10 pt-6 border-t border-slate-700"> {/* Adjusted mt, pt and border color */}
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DataConnectorsStep;
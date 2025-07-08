import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion } from 'framer-motion';

interface DataConnectorsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const connectors = [
  { id: 'twitter', name: 'Twitter / X', logo: '/placeholder.svg' },
  { id: 'google_drive', name: 'Google Drive', logo: '/placeholder.svg' },
  { id: 'github', name: 'GitHub', logo: '/placeholder.svg' },
  { id: 'notion', name: 'Notion', logo: '/placeholder.svg' },
  { id: 'dropbox', name: 'Dropbox', logo: '/placeholder.svg' },
  { id: 'figma', name: 'Figma', logo: '/placeholder.svg' }
];

const DataConnectorsStep: React.FC<DataConnectorsStepProps> = ({ onNext, onBack }) => {
  const { connectedAccounts, toggleConnectedAccount } = useOnboarding();

  return (
    <div className="bg-background/20 backdrop-blur-sm border border-border rounded-lg max-w-3xl mx-auto p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Connect the Constellations</h2>
        <p className="text-muted-foreground">Link your existing digital universe to provide context for your AI.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {connectors.map((connector, index) => {
          const isConnected = connectedAccounts.includes(connector.id);
          return (
            <motion.div
              key={connector.id}
              className={`relative p-4 border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                isConnected ? 'bg-green-500/20 border-green-500' : 'bg-muted/10 border-border hover:bg-muted/20'
              }`}
              onClick={() => toggleConnectedAccount(connector.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {isConnected && <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-green-400" />}
              <img src={connector.logo} alt={connector.name} className="w-12 h-12 mb-2"/>
              <span className="text-sm font-medium">{connector.name}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-border">
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
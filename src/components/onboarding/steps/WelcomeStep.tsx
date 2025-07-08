import React, { useState } from 'react';
import FuturisticLoader from '@/components/ui/animations/FuturisticLoader';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <FuturisticLoader onComplete={handleLoaderComplete} />;
  }

  return (
    <motion.div
      className="text-center max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to UniversalAI</h1>
      <p className="text-lg text-white/80 mb-8">
        You are about to embark on the Genesis Ritual. This process will align the Creator OS with your unique essence, skills, and creative spirit.
      </p>
      <Button onClick={onNext} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
        Begin the Ritual <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export default WelcomeStep;
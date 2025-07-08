import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const FinalizationStep = () => {
  const { personalityType, connectedAccounts, uploadedFiles, preferences } = useOnboarding();
  const navigate = useNavigate();
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleFinalize = () => {
    setIsFinalizing(true);
    
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };
  
  return (
    <div className="bg-background/20 backdrop-blur-sm border border-border rounded-lg max-w-3xl mx-auto p-8 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center shadow-lg mb-6"
      >
        <CheckCircle className="h-12 w-12 text-white"/>
      </motion.div>

      <h2 className="text-3xl font-bold mb-4">Genesis Complete</h2>
      <p className="text-muted-foreground mb-6">Your Creator OS has been aligned with your essence. Here is your personalized configuration:</p>
      
      <div className="text-left bg-muted/10 border border-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Creative Archetype:</strong> {personalityType || 'The Universalist'}</p>
            <p><strong>Preferred LLM:</strong> {preferences.llm}</p>
            <p><strong>Connected Accounts:</strong> {connectedAccounts.length}</p>
            <p><strong>Training Files:</strong> {uploadedFiles.length}</p>
            <p><strong>Default Chain:</strong> {preferences.chain}</p>
            <p><strong>Creative Style:</strong> {preferences.style}</p>
        </div>
      </div>
      
      <Button onClick={handleFinalize} disabled={isFinalizing} size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
        {isFinalizing ? 'Entering Studio...' : 'Enter Your Creative Studio'} <Zap className="ml-2 h-5 w-5"/>
      </Button>
    </div>
  );
};

export default FinalizationStep;
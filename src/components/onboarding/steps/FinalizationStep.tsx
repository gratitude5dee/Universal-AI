import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const FinalizationStep = () => {
  const { connectedAccounts, uploadedFiles, preferences, saveOnboardingData, loading: saveLoading } = useOnboarding();
  const navigate = useNavigate();
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleFinalize = async () => {
    setIsFinalizing(true);
    
    try {
      await saveOnboardingData();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      setIsFinalizing(false);
    }
  };
  
  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-lg max-w-3xl mx-auto p-8 text-center shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg mb-6 shadow-cyan-500/30"
      >
        <CheckCircle className="h-12 w-12 text-white"/>
      </motion.div>

      <h2 className="text-3xl font-bold mb-4 text-slate-100">Genesis Complete</h2>
      <p className="text-slate-400 mb-6">Your Creator OS has been aligned with your essence. Here is your personalized configuration:</p>
      
      <motion.div
        className="text-left bg-slate-700/30 border border-slate-600 rounded-lg p-6 space-y-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <SummaryItem label="Creative Archetype" value="The Universalist" />
            <SummaryItem label="Preferred LLM" value={preferences.llm} />
            <SummaryItem label="Connected Accounts" value={connectedAccounts.length.toString()} />
            <SummaryItem label="Training Files" value={uploadedFiles.length.toString()} />
            <SummaryItem label="Default Chain" value={preferences.chain} />
            <SummaryItem label="Creative Style" value={preferences.style} />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          onClick={handleFinalize}
          disabled={isFinalizing || saveLoading}
          size="lg"
          className="mt-10 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-sky-500 text-white hover:from-cyan-600 hover:to-sky-600 text-base font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {isFinalizing || saveLoading ? 'Finalizing & Entering Studio...' : 'Enter Your Creative Studio'}
          <Zap className="ml-2 h-5 w-5"/>
        </Button>
      </motion.div>
    </motion.div>
  );
};

const SummaryItem: React.FC<{label: string, value: string | number}> = ({ label, value}) => (
  <div className="py-1">
    <span className="text-sm text-slate-400 block">{label}</span>
    <span className="font-semibold text-slate-100">{value}</span>
  </div>
);

export default FinalizationStep;
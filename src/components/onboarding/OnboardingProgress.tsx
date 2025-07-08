import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-cyan-400">Genesis Process</span>
        <span className="text-xs font-mono text-white/80">Step {currentStep} / {totalSteps}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 backdrop-blur-sm">
        <motion.div
          className="bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full h-1.5"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default OnboardingProgress;
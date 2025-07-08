import React, { useState } from 'react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import WelcomeStep from '@/components/onboarding/steps/WelcomeStep';
import PersonalityQuizStep from '@/components/onboarding/steps/PersonalityQuizStep';
import DataConnectorsStep from '@/components/onboarding/steps/DataConnectorsStep';
import TrainingDataStep from '@/components/onboarding/steps/TrainingDataStep';
import PreferencesStep from '@/components/onboarding/steps/PreferencesStep';
import FinalizationStep from '@/components/onboarding/steps/FinalizationStep';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { AnimatePresence, motion } from 'framer-motion';

const OnboardingPage = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const steps = [
    <WelcomeStep onNext={nextStep} />,
    <PersonalityQuizStep onNext={nextStep} onBack={prevStep} />,
    <DataConnectorsStep onNext={nextStep} onBack={prevStep} />,
    <TrainingDataStep onNext={nextStep} onBack={prevStep} />,
    <PreferencesStep onNext={nextStep} onBack={prevStep} />,
    <FinalizationStep />,
  ];

  return (
    <OnboardingProvider>
      <OnboardingLayout currentStep={step} totalSteps={steps.length}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </OnboardingLayout>
    </OnboardingProvider>
  );
};

export default OnboardingPage;
import React, { ReactNode } from 'react';
import OnboardingProgress from './OnboardingProgress';
import Ambient from '@/components/ui/ambient';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

const OnboardingLayout = ({ children, currentStep, totalSteps }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white p-4 relative overflow-hidden">
      <Ambient showAsciiStreams={true} />
      <div className="w-full max-w-4xl mx-auto relative z-10">
        <OnboardingProgress currentStep={currentStep + 1} totalSteps={totalSteps} />
        <main className="mt-8">{children}</main>
      </div>
    </div>
  );
};

export default OnboardingLayout;
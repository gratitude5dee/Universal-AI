import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingState {
  creatorName: string;
  personalityType: string;
  connectedAccounts: string[];
  uploadedFiles: { type: 'image' | 'video' | 'voice'; name: string }[];
  preferences: {
    llm: string;
    chain: string;
    style: string;
  };
}

interface OnboardingContextType extends OnboardingState {
  setCreatorName: (name: string) => void;
  setPersonalityType: (type: string) => void;
  toggleConnectedAccount: (account: string) => void;
  addUploadedFile: (file: { type: 'image' | 'video' | 'voice'; name: string }) => void;
  setPreferences: (prefs: Partial<OnboardingState['preferences']>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OnboardingState>({
    creatorName: '',
    personalityType: '',
    connectedAccounts: [],
    uploadedFiles: [],
    preferences: {
      llm: 'gpt-4o',
      chain: 'ethereum',
      style: 'balanced',
    },
  });

  const setCreatorName = (name: string) => setState(s => ({ ...s, creatorName: name }));
  const setPersonalityType = (type: string) => setState(s => ({ ...s, personalityType: type }));
  
  const toggleConnectedAccount = (account: string) => {
    setState(s => {
      const newAccounts = s.connectedAccounts.includes(account)
        ? s.connectedAccounts.filter(a => a !== account)
        : [...s.connectedAccounts, account];
      return { ...s, connectedAccounts: newAccounts };
    });
  };

  const addUploadedFile = (file: { type: 'image' | 'video' | 'voice'; name: string }) => {
    setState(s => ({ ...s, uploadedFiles: [...s.uploadedFiles, file] }));
  };
  
  const setPreferences = (prefs: Partial<OnboardingState['preferences']>) => {
    setState(s => ({ ...s, preferences: { ...s.preferences, ...prefs } }));
  };

  return (
    <OnboardingContext.Provider value={{ ...state, setCreatorName, setPersonalityType, toggleConnectedAccount, addUploadedFile, setPreferences }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
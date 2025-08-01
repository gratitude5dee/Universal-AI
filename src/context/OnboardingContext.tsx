import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingState {
  creatorName: string;
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
  toggleConnectedAccount: (account: string) => void;
  addUploadedFile: (file: { type: 'image' | 'video' | 'voice'; name: string }) => void;
  setPreferences: (prefs: Partial<OnboardingState['preferences']>) => void;
  saveOnboardingData: () => Promise<void>;
  loading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [state, setState] = useState<OnboardingState>({
    creatorName: '',
    connectedAccounts: [],
    uploadedFiles: [],
    preferences: {
      llm: 'gpt-4o',
      chain: 'ethereum',
      style: 'balanced',
    },
  });

  const setCreatorName = (name: string) => setState(s => ({ ...s, creatorName: name }));
  
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

  const saveOnboardingData = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          connected_accounts: state.connectedAccounts,
          uploaded_files: state.uploadedFiles,
          ai_preferences: state.preferences,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Profile saved!",
        description: "Your Creator OS has been configured successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingContext.Provider value={{ ...state, setCreatorName, toggleConnectedAccount, addUploadedFile, setPreferences, saveOnboardingData, loading }}>
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
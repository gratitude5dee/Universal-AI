import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setWalletAddress: (address: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  walletAddress: null,
  isAuthenticated: false,
  loading: true,
  setWalletAddress: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed property: authenticated if user OR wallet connected
  const isAuthenticated = !!(user || walletAddress);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      walletAddress, 
      isAuthenticated, 
      loading, 
      setWalletAddress 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

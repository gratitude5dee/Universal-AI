import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const GUEST_MODE_KEY = "universalai-guest-mode";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  walletAddress: string | null;
  guestMode: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  setWalletAddress: (address: string | null) => void;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  walletAddress: null,
  guestMode: false,
  isAuthenticated: false,
  loading: true,
  setWalletAddress: () => {},
  enterGuestMode: () => {},
  exitGuestMode: () => {},
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
  const [guestMode, setGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Computed property: authenticated if user, wallet, or guest access is active.
  const isAuthenticated = !!(user || walletAddress || guestMode);

  const enterGuestMode = () => {
    localStorage.setItem(GUEST_MODE_KEY, "true");
    setGuestMode(true);
  };

  const exitGuestMode = () => {
    localStorage.removeItem(GUEST_MODE_KEY);
    setGuestMode(false);
  };

  useEffect(() => {
    setGuestMode(localStorage.getItem(GUEST_MODE_KEY) === "true");

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          localStorage.removeItem(GUEST_MODE_KEY);
          setGuestMode(false);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.removeItem(GUEST_MODE_KEY);
        setGuestMode(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      walletAddress, 
      guestMode,
      isAuthenticated, 
      loading, 
      setWalletAddress,
      enterGuestMode,
      exitGuestMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

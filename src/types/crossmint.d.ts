
declare module '@crossmint/client-sdk-react-ui' {
  import React from 'react';

  export interface User {
    id: string;
    email?: string;
    wallets?: Array<{ chain: string; address: string }>;
  }

  export interface Session {
    user: User;
  }

  export interface AuthContextType {
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isLoading?: boolean;
  }

  export function useAuth(): AuthContextType;

  export interface CrossmintProviderProps {
    apiKey: string;
    children: React.ReactNode;
  }

  export interface CrossmintAuthProviderProps {
    loginMethods: Array<"email" | "wallet" | "farcaster" | string>;
    children: React.ReactNode;
  }

  export const CrossmintProvider: React.FC<CrossmintProviderProps>;
  export const CrossmintAuthProvider: React.FC<CrossmintAuthProviderProps>;
}

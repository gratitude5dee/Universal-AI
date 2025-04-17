
declare module '@crossmint/client-sdk-react-ui' {
  import React from 'react';

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

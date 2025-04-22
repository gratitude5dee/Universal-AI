
import React, { createContext, useContext, useState, useEffect } from 'react';

// Try to import from Crossmint first, fallback to our mock implementation
let useAuth: any;
try {
  useAuth = require("@crossmint/client-sdk-react-ui").useAuth;
} catch (e) {
  useAuth = require("@/context/AuthContext").useAuth;
}

interface WalletContextType {
  address: string;
  balance: number;
  isLoading: boolean;
  fetchBalance: () => Promise<void>;
}

const defaultContext: WalletContextType = {
  address: '',
  balance: 0,
  isLoading: false,
  fetchBalance: async () => {},
};

const WalletContext = createContext<WalletContextType>(defaultContext);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  
  const fetchWallet = async () => {
    // Set a demo address if user isn't available (Crossmint not configured)
    if (!user) {
      setAddress('8yCk...Z1vQ'); // Demo address
      return;
    }
    
    try {
      // Attempt to fetch real wallet, but don't error if API isn't available
      try {
        const response = await fetch('/api/create-wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
        
        if (response.ok) {
          const { address: walletAddress } = await response.json();
          setAddress(walletAddress);
          return;
        }
      } catch (error) {
        console.log('Wallet API not available, using demo wallet');
      }
      
      // Fallback to demo address if API call fails
      setAddress('8yCk...Z1vQ');
      
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };
  
  const fetchBalance = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      // For demonstration purposes - in a real app you would fetch from an endpoint
      // This is a placeholder and would need to be replaced with actual balance fetching logic
      setBalance(0.5); // Example balance
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Small delay to prevent immediate fetch on mount
    const timer = setTimeout(() => {
      fetchWallet();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  useEffect(() => {
    if (address) {
      fetchBalance();
    }
  }, [address]);
  
  return (
    <WalletContext.Provider value={{ address, balance, isLoading, fetchBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ChainId = 1514 | 1315;
export type NetworkType = 'mainnet' | 'testnet';

interface NetworkInfo {
  chainId: ChainId;
  name: string;
  type: NetworkType;
  rpcUrl: string;
  explorerUrl: string;
  ipExplorerUrl: string;
  faucetUrl?: string;
}

const networks: Record<ChainId, NetworkInfo> = {
  1514: {
    chainId: 1514,
    name: 'Story Mainnet',
    type: 'mainnet',
    rpcUrl: 'https://rpc.story.foundation',
    explorerUrl: 'https://explorer.story.foundation',
    ipExplorerUrl: 'https://explorer.story.foundation/ipa',
  },
  1315: {
    chainId: 1315,
    name: 'Aeneid Testnet',
    type: 'testnet',
    rpcUrl: 'https://testnet.rpc.story.foundation',
    explorerUrl: 'https://testnet.explorer.story.foundation',
    ipExplorerUrl: 'https://testnet.explorer.story.foundation/ipa',
    faucetUrl: 'https://faucet.story.foundation',
  },
};

interface RPCStatus {
  isHealthy: boolean;
  latency: number;
  blockHeight: number;
  lastChecked: Date;
}

interface NetworkContextType {
  currentNetwork: NetworkInfo;
  rpcStatus: RPCStatus;
  switchNetwork: (chainId: ChainId) => void;
  checkRPCHealth: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [currentChainId, setCurrentChainId] = useState<ChainId>(1315); // Default to testnet
  const [rpcStatus, setRPCStatus] = useState<RPCStatus>({
    isHealthy: true,
    latency: 0,
    blockHeight: 0,
    lastChecked: new Date(),
  });

  const checkRPCHealth = async () => {
    const startTime = Date.now();
    try {
      // Simulate RPC health check
      const latency = Date.now() - startTime;
      const blockHeight = Math.floor(Math.random() * 1000000) + 5000000; // Mock block height
      
      setRPCStatus({
        isHealthy: true,
        latency,
        blockHeight,
        lastChecked: new Date(),
      });
    } catch (error) {
      setRPCStatus({
        isHealthy: false,
        latency: 0,
        blockHeight: 0,
        lastChecked: new Date(),
      });
    }
  };

  useEffect(() => {
    checkRPCHealth();
    const interval = setInterval(checkRPCHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [currentChainId]);

  const switchNetwork = (chainId: ChainId) => {
    setCurrentChainId(chainId);
  };

  const value: NetworkContextType = {
    currentNetwork: networks[currentChainId],
    rpcStatus,
    switchNetwork,
    checkRPCHealth,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
};

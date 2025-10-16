import { useState, useEffect } from 'react';
import { ChainId } from '@/types/on-chain';

interface MultiChainState {
  connectedChains: ChainId[];
  activeChain: ChainId | null;
  addresses: Record<ChainId, string | null>;
}

export const useMultiChain = () => {
  const [state, setState] = useState<MultiChainState>({
    connectedChains: [],
    activeChain: null,
    addresses: {
      solana: null,
      ethereum: null,
      base: null,
      polygon: null,
      arbitrum: null,
      optimism: null,
      bnb: null,
      avalanche: null,
    },
  });

  useEffect(() => {
    // Mock initial connection (in real app, integrate with Crossmint + Wagmi)
    const mockAddresses: Record<ChainId, string | null> = {
      solana: '7xK...mN9',
      ethereum: '0x742...a3f9',
      base: '0x742...a3f9',
      polygon: '0x742...a3f9',
      arbitrum: '0x742...a3f9',
      optimism: null,
      bnb: null,
      avalanche: null,
    };

    setState({
      connectedChains: ['solana', 'ethereum', 'base', 'polygon', 'arbitrum'],
      activeChain: 'solana',
      addresses: mockAddresses,
    });
  }, []);

  const switchChain = async (chainId: ChainId) => {
    setState(prev => ({ ...prev, activeChain: chainId }));
  };

  const connectChain = async (chainId: ChainId) => {
    // Mock connection logic
    const mockAddress = chainId === 'solana' ? '7xK...mN9' : '0x742...a3f9';
    setState(prev => ({
      ...prev,
      connectedChains: [...prev.connectedChains, chainId],
      addresses: { ...prev.addresses, [chainId]: mockAddress },
    }));
  };

  const disconnectChain = async (chainId: ChainId) => {
    setState(prev => ({
      ...prev,
      connectedChains: prev.connectedChains.filter(c => c !== chainId),
      addresses: { ...prev.addresses, [chainId]: null },
      activeChain: prev.activeChain === chainId ? prev.connectedChains[0] || null : prev.activeChain,
    }));
  };

  return {
    ...state,
    switchChain,
    connectChain,
    disconnectChain,
    isConnected: state.connectedChains.length > 0,
  };
};

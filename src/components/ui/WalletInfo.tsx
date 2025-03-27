
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { WalletIcon } from '@/components/ui/icons';

export const WalletInfo = () => {
  const { address, balance, isLoading, fetchBalance } = useWallet();
  
  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="flex items-center gap-2"
      onClick={fetchBalance}
    >
      <WalletIcon className="h-4 w-4" isGlowing={false} />
      <span>
        {isLoading 
          ? 'Loading...' 
          : `${balance.toFixed(4)} SOL`
        }
      </span>
      <span className="text-xs opacity-70">{shortenAddress(address)}</span>
    </Button>
  );
};

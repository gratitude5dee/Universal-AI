
import React from 'react';
import { Button } from '@/components/ui/button';
import { WalletIcon } from '@/components/ui/icons';
import { useEvmWallet } from '@/context/EvmWalletContext';

export const WalletInfo = () => {
  const { address, nativeBalance, chainMeta, isLoading, refresh } = useEvmWallet();
  
  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="flex items-center gap-2"
      onClick={refresh}
    >
      <WalletIcon className="h-4 w-4" isGlowing={false} />
      <span>
        {isLoading 
          ? 'Loading...' 
          : nativeBalance && chainMeta
            ? `${Number(nativeBalance.formatted).toFixed(4)} ${chainMeta.nativeSymbol}`
            : '—'
        }
      </span>
      <span className="text-xs opacity-70">
        {chainMeta ? chainMeta.name : 'Unknown'} • {address ? shortenAddress(address) : 'Not connected'}
      </span>
    </Button>
  );
};

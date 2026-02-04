import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Wallet, BarChart3, AlertTriangle } from 'lucide-react';
import { useEvmWallet } from '@/context/EvmWalletContext';

export function MntBalanceChecker() {
  const { address, nativeBalance, isLoading, refresh } = useEvmWallet();
  const [mntBalance, setMntBalance] = useState('0.00');
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [walletInput, setWalletInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Simulate checking MNT balance
  const checkMntBalance = async (checkAddress: string) => {
    if (!checkAddress && !address) {
      setError('Please enter a wallet address to check');
      return;
    }
    
    setError(null);
    setIsChecking(true);
    
    try {
      // In a real implementation, this would call the Mantle API
      // For demo purposes, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random balance for demo purposes
      const randomBalance = (Math.random() * 100).toFixed(4);
      setMntBalance(randomBalance);
      setHasChecked(true);
      setIsChecking(false);
    } catch (err) {
      setError('Failed to fetch MNT balance');
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Reset state when address changes
    if (address) {
      setWalletInput(address);
    }
  }, [address]);

  return (
    <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20 shadow-card-glow">
      <h2 className="text-xl font-medium flex items-center gap-2 mb-4 text-white text-shadow-sm">
        <Wallet className="text-studio-accent" size={20} />
        Mantle MNT Balance Checker
      </h2>
      
      <p className="text-white/80 mb-6 text-shadow-sm">
        Check your MNT balance on the Mantle network - a secure, scalable Layer 2 solution.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wallet-address" className="text-white/90 text-shadow-sm">Wallet Address</Label>
          <div className="flex gap-2">
            <Input
              id="wallet-address"
              placeholder="Enter Mantle wallet address"
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
            />
            <Button 
              onClick={() => checkMntBalance(walletInput)}
              disabled={isChecking}
              className="bg-studio-accent hover:bg-studio-accent/90 text-white"
            >
              {isChecking ? 'Checking...' : 'Check Balance'}
            </Button>
          </div>
          {error && (
            <div className="text-red-400 text-sm flex items-center gap-1 mt-1">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
        </div>
        
        {hasChecked && (
          <div className="mt-6 p-4 backdrop-blur-md bg-studio-accent/10 rounded-lg border border-studio-accent/20 shadow-card-glow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-white/80 text-shadow-sm">MNT Balance:</p>
                <p className="text-2xl font-bold text-white text-shadow-sm">{mntBalance} MNT</p>
              </div>
              <BarChart3 className="text-studio-accent h-8 w-8" />
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/20">
              <h4 className="text-sm font-medium mb-2 text-white text-shadow-sm">What can you do with MNT?</h4>
              <ul className="space-y-2 text-sm text-white/80 text-shadow-sm">
                <li className="flex items-center gap-2">
                  <ArrowRight size={14} className="text-studio-accent" />
                  Pay for transaction fees on Mantle Network
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight size={14} className="text-studio-accent" />
                  Participate in Mantle DAO governance
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight size={14} className="text-studio-accent" />
                  Stake MNT to earn protocol rewards
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

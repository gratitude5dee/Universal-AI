import React, { createContext, useContext, useMemo } from "react";
import { useEvmWallet } from "@/context/EvmWalletContext";

interface WalletContextType {
  address: string;
  balance: number;
  isLoading: boolean;
  fetchBalance: () => Promise<void>;
}

const defaultContext: WalletContextType = {
  address: "",
  balance: 0,
  isLoading: false,
  fetchBalance: async () => {},
};

const WalletContext = createContext<WalletContextType>(defaultContext);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, nativeBalance, isLoading, refresh } = useEvmWallet();

  const value = useMemo<WalletContextType>(
    () => ({
      address: address ?? "",
      balance: Number.parseFloat(nativeBalance?.formatted ?? "0"),
      isLoading,
      fetchBalance: refresh,
    }),
    [address, nativeBalance?.formatted, isLoading, refresh],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

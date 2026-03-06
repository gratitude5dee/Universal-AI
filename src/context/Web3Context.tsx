import React, { createContext, useContext } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Web3Config } from "@/lib/web3/config";

export interface Web3ContextValue {
  client: ThirdwebClient;
  config: Web3Config;
  writesEnabled: boolean;
}

const Web3Context = createContext<Web3ContextValue | null>(null);

export function Web3Provider({
  client,
  config,
  children,
}: {
  client: ThirdwebClient;
  config: Web3Config;
  children: React.ReactNode;
}) {
  const writesEnabled = String((import.meta as any)?.env?.VITE_ENABLE_WEB3_WRITES ?? "").toLowerCase() === "true";
  return <Web3Context.Provider value={{ client, config, writesEnabled }}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within Web3Provider");
  return ctx;
}


declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        publicKey?: { toString: () => string };
        connect?: () => Promise<{ publicKey?: { toString: () => string } }>;
      };
    };
    solana?: {
      isPhantom?: boolean;
      publicKey?: { toString: () => string };
      connect?: () => Promise<{ publicKey?: { toString: () => string } }>;
    };
  }
}

export interface SolanaRouteWalletConnection {
  address: string;
  providerLabel: string;
}

function getInjectedProvider() {
  if (typeof window === "undefined") return null;
  return window.phantom?.solana ?? window.solana ?? null;
}

export function hasInjectedSolanaWallet() {
  const provider = getInjectedProvider();
  return Boolean(provider?.connect);
}

export async function connectInjectedSolanaWallet(): Promise<SolanaRouteWalletConnection> {
  const provider = getInjectedProvider();
  if (!provider?.connect) {
    throw new Error("No injected Solana wallet detected in this browser.");
  }

  const result = await provider.connect();
  const address = result?.publicKey?.toString?.() ?? provider.publicKey?.toString?.();
  if (!address) {
    throw new Error("The connected wallet did not return a public key.");
  }

  return {
    address,
    providerLabel: provider.isPhantom ? "Phantom" : "Injected Solana Wallet",
  };
}

export function normalizeSolanaAddress(address: string) {
  return address.trim();
}

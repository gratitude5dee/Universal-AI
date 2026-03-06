import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useWeb3 } from "@/context/Web3Context";
import { CHAIN_META, getChainMetaByChainId, type ChainMeta } from "@/lib/web3/chains";
import { useAuth as useAppAuth } from "@/context/AuthContext";

type TokenBalances = {
  usdc?: { address: string; decimals: number; raw: string; formatted: string };
  wzrd?: { address: string; decimals: number; raw: string; formatted: string };
};

export interface EvmWalletContextValue {
  address: string | null;
  chainId: number | null;
  chainMeta: ChainMeta | null;
  nativeBalance: { raw: string; formatted: string } | null;
  tokenBalances: TokenBalances;
  isLoading: boolean;
  refresh: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendNative: (params: { to: string; amount: string }) => Promise<string>;
  sendErc20: (params: { tokenAddress: string; to: string; amount: string; decimals: number }) => Promise<string>;
}

const EvmWalletContext = createContext<EvmWalletContextValue | null>(null);

function hexToBigInt(hex: string): bigint {
  const normalized = hex.startsWith("0x") ? hex : `0x${hex}`;
  return BigInt(normalized);
}

function bigIntToHex(value: bigint): string {
  return `0x${value.toString(16)}`;
}

function parseUnits(amount: string, decimals: number): bigint {
  const [whole, frac = ""] = amount.split(".");
  const cleanWhole = whole.replace(/_/g, "") || "0";
  const cleanFrac = frac.replace(/_/g, "");
  const fracPadded = (cleanFrac + "0".repeat(decimals)).slice(0, decimals);
  const wholeBig = BigInt(cleanWhole || "0") * BigInt(10) ** BigInt(decimals);
  const fracBig = BigInt(fracPadded || "0");
  return wholeBig + fracBig;
}

function formatUnits(value: bigint, decimals: number, precision = 4): string {
  const base = BigInt(10) ** BigInt(decimals);
  const whole = value / base;
  const frac = value % base;
  const fracStr = frac.toString().padStart(decimals, "0").slice(0, Math.max(0, precision));
  return precision > 0 ? `${whole.toString()}.${fracStr}` : whole.toString();
}

function pad32(hexNo0x: string): string {
  return hexNo0x.padStart(64, "0");
}

function addressToPaddedHex(address: string): string {
  const a = address.toLowerCase().replace(/^0x/, "");
  return pad32(a);
}

async function rpcCall<T>(rpcUrl: string, method: string, params: any[]): Promise<T> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json?.error) throw new Error(json.error?.message ?? "RPC error");
  return json.result as T;
}

async function erc20BalanceOf(rpcUrl: string, tokenAddress: string, owner: string): Promise<bigint> {
  // balanceOf(address) => 0x70a08231
  const data = `0x70a08231${addressToPaddedHex(owner)}`;
  const result = await rpcCall<string>(rpcUrl, "eth_call", [{ to: tokenAddress, data }, "latest"]);
  return hexToBigInt(result);
}

export const EvmWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config, writesEnabled } = useWeb3();
  const account = useActiveAccount() as any;
  const { setWalletAddress } = useAppAuth();

  const address = account?.address ?? null;

  const [chainId, setChainId] = useState<number | null>(null);
  const [nativeBalance, setNativeBalance] = useState<{ raw: string; formatted: string } | null>(null);
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});
  const [isLoading, setIsLoading] = useState(false);

  const chainMeta = useMemo(() => getChainMetaByChainId(chainId), [chainId]);

  useEffect(() => {
    // Keep AuthContext in sync so ProtectedRoute can treat wallet-only sessions as authenticated.
    setWalletAddress(address);
  }, [address, setWalletAddress]);

  // Track chainId via EIP-1193 (works regardless of thirdweb hook surface area).
  useEffect(() => {
    let cancelled = false;
    async function loadChainId() {
      try {
        const eth = (window as any)?.ethereum;
        if (!eth?.request) return;
        const hex = await eth.request({ method: "eth_chainId" });
        const id = parseInt(hex, 16);
        if (!cancelled) setChainId(Number.isFinite(id) ? id : null);
      } catch {
        if (!cancelled) setChainId(null);
      }
    }
    loadChainId();

    const eth = (window as any)?.ethereum;
    const onChainChanged = (hex: string) => {
      const id = parseInt(hex, 16);
      setChainId(Number.isFinite(id) ? id : null);
    };
    eth?.on?.("chainChanged", onChainChanged);
    return () => {
      cancelled = true;
      eth?.removeListener?.("chainChanged", onChainChanged);
    };
  }, []);

  const resolveUsdcAddress = (cid: number): string | null => {
    const cfg = config.paymentTokensByChainId?.[cid]?.usdc;
    if (cfg) return cfg;
    // Mainnet defaults (per spec)
    if (cid === 1) return "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    if (cid === 8453) return "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    if (cid === 137) return "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    return null;
  };

  const resolveWzrdAddress = (cid: number): string | null => {
    const cfg = config.contractsByChainId?.[cid]?.wzrdToken;
    return cfg ?? null;
  };

  const refresh = async () => {
    if (!address || !chainId) return;
    const meta = getChainMetaByChainId(chainId);
    if (!meta?.rpcUrl) return;

    setIsLoading(true);
    try {
      const balHex = await rpcCall<string>(meta.rpcUrl, "eth_getBalance", [address, "latest"]);
      const bal = hexToBigInt(balHex);
      setNativeBalance({ raw: bal.toString(), formatted: formatUnits(bal, 18, 4) });

      const nextTokenBalances: TokenBalances = {};

      const usdc = resolveUsdcAddress(chainId);
      if (usdc) {
        const raw = await erc20BalanceOf(meta.rpcUrl, usdc, address);
        nextTokenBalances.usdc = { address: usdc, decimals: 6, raw: raw.toString(), formatted: formatUnits(raw, 6, 2) };
      }

      const wzrd = resolveWzrdAddress(chainId);
      if (wzrd) {
        const raw = await erc20BalanceOf(meta.rpcUrl, wzrd, address);
        nextTokenBalances.wzrd = { address: wzrd, decimals: 18, raw: raw.toString(), formatted: formatUnits(raw, 18, 4) };
      }

      setTokenBalances(nextTokenBalances);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chainId, config.contractsByChainId, config.paymentTokensByChainId]);

  const switchChain = async (targetChainId: number) => {
    const eth = (window as any)?.ethereum;
    if (!eth?.request) throw new Error("No injected wallet found");
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (e: any) {
      // 4902: unknown chain in many wallets (e.g., MetaMask)
      if (e?.code === 4902) {
        const meta = getChainMetaByChainId(targetChainId);
        if (!meta) throw e;
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: meta.name,
              rpcUrls: [meta.rpcUrl],
              nativeCurrency: {
                name: meta.nativeSymbol,
                symbol: meta.nativeSymbol,
                decimals: 18,
              },
              blockExplorerUrls: [meta.explorerBaseUrl],
            },
          ],
        });
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
        return;
      }
      throw e;
    }
  };

  const connect = async () => {
    const eth = (window as any)?.ethereum;
    if (!eth?.request) throw new Error("No injected wallet found");
    await eth.request({ method: "eth_requestAccounts" });
  };

  const disconnect = async () => {
    // Most injected wallets do not support programmatic disconnect.
    // Users can disconnect from the ConnectButton UI.
    return;
  };

  const signMessage = async (message: string) => {
    if (!address) throw new Error("Wallet not connected");
    // Prefer thirdweb account signer if available.
    if (account?.signMessage) {
      return await account.signMessage({ message });
    }
    const eth = (window as any)?.ethereum;
    if (!eth?.request) throw new Error("No injected wallet found");
    return await eth.request({ method: "personal_sign", params: [message, address] });
  };

  const sendNative = async ({ to, amount }: { to: string; amount: string }) => {
    if (!writesEnabled) throw new Error("Web3 writes disabled (set VITE_ENABLE_WEB3_WRITES=true)");
    if (!address) throw new Error("Wallet not connected");
    const eth = (window as any)?.ethereum;
    if (!eth?.request) throw new Error("No injected wallet found");
    const value = bigIntToHex(parseUnits(amount, 18));
    const txHash = await eth.request({
      method: "eth_sendTransaction",
      params: [{ from: address, to, value }],
    });
    return String(txHash);
  };

  const sendErc20 = async ({
    tokenAddress,
    to,
    amount,
    decimals,
  }: {
    tokenAddress: string;
    to: string;
    amount: string;
    decimals: number;
  }) => {
    if (!writesEnabled) throw new Error("Web3 writes disabled (set VITE_ENABLE_WEB3_WRITES=true)");
    if (!address) throw new Error("Wallet not connected");
    const eth = (window as any)?.ethereum;
    if (!eth?.request) throw new Error("No injected wallet found");

    // transfer(address,uint256) => 0xa9059cbb
    const value = parseUnits(amount, decimals);
    const data = `0xa9059cbb${addressToPaddedHex(to)}${pad32(value.toString(16))}`;
    const txHash = await eth.request({
      method: "eth_sendTransaction",
      params: [{ from: address, to: tokenAddress, data, value: "0x0" }],
    });
    return String(txHash);
  };

  const value: EvmWalletContextValue = {
    address,
    chainId,
    chainMeta,
    nativeBalance,
    tokenBalances,
    isLoading,
    refresh,
    connect,
    disconnect,
    switchChain,
    signMessage,
    sendNative,
    sendErc20,
  };

  return <EvmWalletContext.Provider value={value}>{children}</EvmWalletContext.Provider>;
};

export function useEvmWallet(): EvmWalletContextValue {
  const ctx = useContext(EvmWalletContext);
  if (!ctx) throw new Error("useEvmWallet must be used within EvmWalletProvider");
  return ctx;
}

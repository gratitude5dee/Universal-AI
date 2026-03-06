// Web3 config loader (clientId + contract addresses + payment token addresses)
// Source of truth: Supabase edge function `get-thirdweb-config`.

export type ContractsByChainId = Record<
  number,
  {
    nftCollection?: string;
    edition?: string;
    ticketCollection?: string;
    agentPass?: string;
    marketplace?: string;
    split?: string;
    wzrdToken?: string;
  }
>;

export type PaymentTokensByChainId = Record<
  number,
  {
    usdc?: string;
  }
>;

export interface Web3Config {
  clientId: string;
  contractsByChainId: ContractsByChainId;
  paymentTokensByChainId: PaymentTokensByChainId;
}

let cachedConfig: Web3Config | null = null;

function safeJsonParse<T>(value: string | undefined | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getEnvConfig(): Web3Config {
  const clientId = (import.meta as any)?.env?.VITE_THIRDWEB_CLIENT_ID ?? "";
  const contractsByChainId = safeJsonParse<ContractsByChainId>(
    (import.meta as any)?.env?.VITE_THIRDWEB_CONTRACTS_JSON,
    {},
  );
  const paymentTokensByChainId = safeJsonParse<PaymentTokensByChainId>(
    (import.meta as any)?.env?.VITE_PAYMENT_TOKENS_JSON,
    {},
  );

  return { clientId, contractsByChainId, paymentTokensByChainId };
}

export function getWeb3ConfigSync(): Web3Config {
  if (cachedConfig) return cachedConfig;
  cachedConfig = getEnvConfig();
  return cachedConfig;
}

export async function getWeb3Config(): Promise<Web3Config> {
  // Only use cache if it has a valid clientId
  if (cachedConfig?.clientId) return cachedConfig;

  const envFallback = getEnvConfig();

  try {
    const res = await fetch(
      "https://ixkkrousepsiorwlaycp.supabase.co/functions/v1/get-thirdweb-config",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!res.ok) {
      cachedConfig = envFallback;
      return cachedConfig;
    }

    const data = await res.json();
    cachedConfig = {
      clientId: data?.clientId ?? envFallback.clientId ?? "",
      contractsByChainId: (data?.contractsByChainId ?? envFallback.contractsByChainId ?? {}) as ContractsByChainId,
      paymentTokensByChainId:
        (data?.paymentTokensByChainId ?? envFallback.paymentTokensByChainId ?? {}) as PaymentTokensByChainId,
    };
    return cachedConfig;
  } catch {
    cachedConfig = envFallback;
    return cachedConfig;
  }
}

export function clearWeb3ConfigCacheForTests() {
  cachedConfig = null;
}


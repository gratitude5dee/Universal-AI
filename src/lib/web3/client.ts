import { createThirdwebClient, ThirdwebClient } from "thirdweb";
import { getWeb3ConfigSync, type Web3Config } from "./config";

let cachedClient: ThirdwebClient | null = null;

export function getThirdwebClientSync(): ThirdwebClient | null {
  if (cachedClient) return cachedClient;

  const cfg = getWeb3ConfigSync();
  if (!cfg.clientId) return null;

  cachedClient = createThirdwebClient({ clientId: cfg.clientId });
  return cachedClient;
}

export function createThirdwebClientFromConfig(cfg: Web3Config): ThirdwebClient {
  if (!cfg.clientId) {
    throw new Error("Missing thirdweb clientId. Set VITE_THIRDWEB_CLIENT_ID or configure get-thirdweb-config.");
  }
  return createThirdwebClient({ clientId: cfg.clientId });
}

export function setThirdwebClientForTests(client: ThirdwebClient | null) {
  cachedClient = client;
}


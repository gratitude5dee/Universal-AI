import { createThirdwebClient, ThirdwebClient } from "thirdweb";

let cachedClient: ThirdwebClient | null = null;
let cachedClientId: string | null = null;

// Fetch client ID from edge function
export async function getThirdwebClientId(): Promise<string> {
  if (cachedClientId) return cachedClientId;
  
  try {
    const response = await fetch(
      "https://ixkkrousepsiorwlaycp.supabase.co/functions/v1/get-thirdweb-config",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch thirdweb config");
    }
    
    const data = await response.json();
    cachedClientId = data.clientId;
    return data.clientId;
  } catch (error) {
    console.error("Error fetching thirdweb config:", error);
    // Fallback to env variable if edge function fails
    const fallbackId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
    if (fallbackId) {
      cachedClientId = fallbackId;
      return fallbackId;
    }
    throw error;
  }
}

// Create client dynamically
export async function getThirdwebClient(): Promise<ThirdwebClient> {
  if (cachedClient) return cachedClient;
  
  const clientId = await getThirdwebClientId();
  cachedClient = createThirdwebClient({ clientId });
  return cachedClient;
}

// Synchronous client for ThirdwebProvider (uses cached or placeholder)
export function getThirdwebClientSync(): ThirdwebClient | null {
  return cachedClient;
}

// Initialize client on module load
export const initializeThirdwebClient = async () => {
  try {
    await getThirdwebClient();
  } catch (error) {
    console.error("Failed to initialize thirdweb client:", error);
  }
};

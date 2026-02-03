import { createThirdwebClient } from "thirdweb";

// Thirdweb Client ID - Get yours free at https://thirdweb.com/dashboard
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-client-id";

export const thirdwebClient = createThirdwebClient({
  clientId,
});


# Plan: Thirdweb Auth with Supabase Secrets + Home Navigation

## Overview
This plan updates the Thirdweb authentication to use the client ID from Supabase secrets and ensures users are properly redirected to the home page after wallet connection.

---

## The Challenge

Currently, there are two issues:
1. The Thirdweb client ID is hardcoded or uses `VITE_` env variables
2. After wallet connection, users can't access `/home` because `ProtectedRoute` only checks for Supabase auth - not wallet connections

---

## Solution Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Auth Page                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐     ┌─────────────────┐                │
│  │  Supabase Auth  │ OR  │  Wallet Connect │                │
│  └────────┬────────┘     └────────┬────────┘                │
│           │                       │                          │
│           ▼                       ▼                          │
│  ┌─────────────────────────────────────────┐                │
│  │         AuthContext (Updated)           │                │
│  │  - Tracks Supabase user                 │                │
│  │  - Tracks wallet address (NEW)          │                │
│  │  - isAuthenticated = user OR wallet     │                │
│  └─────────────────┬───────────────────────┘                │
│                    │                                         │
│                    ▼                                         │
│           Navigate to /home                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Create Edge Function for Client ID
Create `supabase/functions/get-thirdweb-config/index.ts`:
- Reads `THIRDWEB_CLIENT_ID` from Supabase secrets
- Returns it as JSON (this is a public key, safe to expose)
- No authentication required

### Step 2: Update Thirdweb Client Library
Update `src/lib/thirdweb.ts`:
- Export a function to create the client dynamically
- Fetch client ID from edge function on first use
- Cache the result

### Step 3: Update AuthContext
Modify `src/context/AuthContext.tsx`:
- Add `walletAddress` state to track connected wallet
- Add `isAuthenticated` computed property (true if user OR wallet connected)
- Export a `setWalletAddress` function for wallet connections

### Step 4: Update ProtectedRoute
Modify `src/components/ui/ProtectedRoute.tsx`:
- Check for `isAuthenticated` instead of just `user`
- Allow access if user has Supabase auth OR wallet connection

### Step 5: Update Auth Page
Modify `src/pages/Auth.tsx`:
- Import `useActiveAccount` from thirdweb/react to detect wallet connection
- On wallet connect, update AuthContext with wallet address
- Navigate to `/home` after successful connection

---

## Technical Details

### Edge Function: get-thirdweb-config
```typescript
// Returns { clientId: "..." }
// Public endpoint - no auth needed
Deno.serve(async () => {
  const clientId = Deno.env.get("THIRDWEB_CLIENT_ID");
  return new Response(JSON.stringify({ clientId }), {
    headers: { "Content-Type": "application/json" }
  });
});
```

### Updated AuthContext Interface
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  walletAddress: string | null;
  isAuthenticated: boolean;  // NEW: true if user OR wallet
  loading: boolean;
  setWalletAddress: (address: string | null) => void;
}
```

### Auth Page Wallet Connection
```typescript
// Use thirdweb hook to detect connection
const account = useActiveAccount();

useEffect(() => {
  if (account?.address) {
    setWalletAddress(account.address);
    navigate("/home");
  }
}, [account]);
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/get-thirdweb-config/index.ts` | Create | Edge function to serve client ID |
| `src/lib/thirdweb.ts` | Modify | Dynamic client creation with fetched ID |
| `src/context/AuthContext.tsx` | Modify | Add wallet tracking + isAuthenticated |
| `src/components/ui/ProtectedRoute.tsx` | Modify | Check isAuthenticated |
| `src/pages/Auth.tsx` | Modify | Handle wallet connection properly |

---

## Security Notes

- The Thirdweb Client ID is a **public key** (similar to a Supabase anon key) - it's designed to be exposed to the client
- The edge function adds a layer of configuration management but doesn't add security
- Wallet authentication is cryptographically secure - the user proves ownership by signing

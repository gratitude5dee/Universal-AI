
# Plan: Add Thirdweb Auth + Fix Build Errors

## Overview
This plan adds Thirdweb wallet authentication to the Auth page and fixes the existing edge function build errors.

---

## Part 1: Add Thirdweb Authentication

### Step 1: Install Thirdweb SDK
Add the thirdweb package to the project:
```
thirdweb@^5
```

### Step 2: Create Thirdweb Client Configuration
Create `src/lib/thirdweb.ts` with client initialization:
- Use the thirdweb client ID (will need to be added as a secret or env variable)
- Configure supported wallets (MetaMask, Coinbase, WalletConnect, in-app wallet)

### Step 3: Add ThirdwebProvider to App
Update `src/App.tsx`:
- Import `ThirdwebProvider` from thirdweb/react
- Wrap the app with `ThirdwebProvider` (inside AuthProvider)

### Step 4: Update Auth Page
Modify `src/pages/Auth.tsx`:
- Add Thirdweb `ConnectButton` component below the "or continue with" divider
- Configure wallet options (MetaMask, Coinbase Wallet, WalletConnect)
- Style the button to match the existing dark theme
- Handle wallet connection success to navigate to /home

### Step 5: Update AuthContext (Optional Enhancement)
Optionally update `src/context/AuthContext.tsx` to:
- Track both Supabase auth and wallet connection state
- Allow users to link their wallet address to their Supabase profile

---

## Part 2: Fix Edge Function Build Errors

### Fix 1: cerebras-research/index.ts (Lines 68-75)
**Problem**: Duplicate declarations of `sessionIdentifier` and `sessionRecordId`
**Solution**: Remove the duplicate `let` declarations on lines 68-70, keeping only the `const` version on line 72

### Fix 2: cerebras-stream/index.ts (Line 92-94)
**Problem**: Duplicate `hasAccess` variable declaration
**Solution**: Remove the duplicate declaration, keep only one

### Fix 3: manage-user-secrets/index.ts
**Problem**: 
- Missing `sodium` import
- `encryptionKeyBase64` used before declaration
- Type issues with Uint8Array
- Missing `serviceClient` variable

**Solution**:
- Add sodium import: `import sodium from "https://deno.land/x/sodium@0.2.0/sumo.ts"`
- Move `encryptionKeyBase64` declaration before usage
- Fix type assertions for crypto operations
- Fix or remove the `serviceClient` reference

### Fix 4: Multiple functions (connect-print-partner, create-print-order, etc.)
**Problem**: `error` is of type `unknown`
**Solution**: Add proper type guard: `error instanceof Error ? error.message : 'Unknown error'`

---

## Technical Details

### Thirdweb Configuration
```typescript
// src/lib/thirdweb.ts
import { createThirdwebClient } from "thirdweb";

export const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-client-id"
});
```

### Auth Page Integration
The ConnectButton will be placed in the existing "or continue with" section, alongside the Guest Access button. It will:
- Show wallet options (MetaMask, Coinbase, WalletConnect)
- Match the dark glass-morphism theme
- Auto-navigate to /home on successful connection

### Files to Modify
1. `package.json` - Add thirdweb dependency
2. `src/lib/thirdweb.ts` - New file for client config
3. `src/App.tsx` - Add ThirdwebProvider
4. `src/pages/Auth.tsx` - Add ConnectButton
5. `supabase/functions/cerebras-research/index.ts` - Fix duplicate vars
6. `supabase/functions/cerebras-stream/index.ts` - Fix duplicate vars
7. `supabase/functions/manage-user-secrets/index.ts` - Fix sodium + types
8. `supabase/functions/connect-print-partner/index.ts` - Fix error type
9. `supabase/functions/create-print-order/index.ts` - Fix error type
10. `supabase/functions/get-dashboard-stats/index.ts` - Fix error type
11. `supabase/functions/get-gig-revenue/index.ts` - Fix error type

---

## API Key Requirement
Thirdweb requires a Client ID which can be obtained free from [thirdweb.com/dashboard](https://thirdweb.com/dashboard). You'll need to:
1. Create a thirdweb account
2. Create a new project to get a Client ID
3. Add `VITE_THIRDWEB_CLIENT_ID` to the .env file (this is a public/publishable key, safe to store in code)

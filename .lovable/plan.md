
# Plan: Fix Build Errors for Thirdweb Client

## Overview
The Thirdweb client is **already** configured to load from Supabase secrets via the `get-thirdweb-config` edge function. The current build errors need to be fixed for it to work properly.

---

## Current Architecture (Already Correct)

```text
┌─────────────────────────────────────────────────────────────┐
│               Supabase Edge Function                        │
│         get-thirdweb-config/index.ts                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Reads THIRDWEB_CLIENT_ID from Supabase secrets     │   │
│  │  Returns { clientId, contractsByChainId, ... }      │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               Frontend: src/lib/web3/config.ts              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  getWeb3Config() fetches from edge function         │   │
│  │  Falls back to VITE_* env vars if fetch fails       │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               App.tsx                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Creates ThirdwebClient from config                 │   │
│  │  Wraps app in ThirdwebProvider                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**The secret `THIRDWEB_CLIENT_ID` already exists in Supabase.** The architecture is correct - we just need to fix build errors.

---

## Build Errors to Fix

### Error 1: ThirdwebProvider Props (App.tsx)
**Problem**: The `ThirdwebProvider` from thirdweb v5 SDK does not accept `client` or `supportedChains` props directly. The v5 API changed - it uses a connectionManager pattern.

**Solution**: Remove the invalid props from `ThirdwebProvider`. The thirdweb v5 provider doesn't need these props - the `ConnectButton` component handles the client internally.

**File**: `src/App.tsx` (Line 146)
```typescript
// Before (broken):
<ThirdwebProvider client={thirdwebClient} supportedChains={supportedChains}>

// After (fixed):
<ThirdwebProvider>
```

### Error 2: Uint8Array Type Incompatibility (manage-user-secrets)
**Problem**: TypeScript strict mode complains about `Uint8Array<ArrayBufferLike>` not matching `BufferSource`.

**Solution**: Convert `Uint8Array` to proper `ArrayBuffer` format for crypto operations:

**File**: `supabase/functions/manage-user-secrets/index.ts`
```typescript
// Fix line 35-41: Use .buffer property with proper type
return crypto.subtle.importKey(
  'raw',
  rawKey.buffer as ArrayBuffer,
  { name: 'AES-GCM' },
  false,
  ['encrypt', 'decrypt']
);

// Fix line 125: Cast iv to BufferSource
{ name: 'AES-GCM', iv: iv.buffer as ArrayBuffer }
```

### Error 3: bun:test Import Errors (Test Files)
**Problem**: Test files import from `bun:test` which doesn't exist in this environment.

**Solution**: Convert tests to use Vitest (already in the project) or Deno test conventions:

**Files**: `src/lib/web3/gating.test.ts`, `src/lib/web3/idempotency.test.ts`
```typescript
// Before:
import { describe, expect, test } from "bun:test";

// After (Vitest):
import { describe, expect, test } from "vitest";
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Remove `client` and `supportedChains` props from ThirdwebProvider |
| `supabase/functions/manage-user-secrets/index.ts` | Fix Uint8Array to ArrayBuffer conversions |
| `src/lib/web3/gating.test.ts` | Change import from `bun:test` to `vitest` |
| `src/lib/web3/idempotency.test.ts` | Change import from `bun:test` to `vitest` |

---

## Technical Details

### Thirdweb v5 Provider Pattern
In thirdweb v5, the provider doesn't require client props. The `ConnectButton` and other components receive the client from the `Web3Context` we've set up. Our custom `Web3Provider` already passes the client via context.

### Crypto Buffer Fix
The Deno runtime has strict typing for Web Crypto API. Using `.buffer as ArrayBuffer` ensures type compatibility:
```typescript
const rawKey = toUint8Array(secret);
// rawKey.buffer gives us the underlying ArrayBuffer
crypto.subtle.importKey('raw', rawKey.buffer as ArrayBuffer, ...)
```

---

## Verification

After these fixes:
1. The app will load without TypeScript errors
2. Wallet connection will fetch the client ID from `get-thirdweb-config`
3. The edge function reads `THIRDWEB_CLIENT_ID` from Supabase secrets
4. On successful wallet connection, users navigate to `/home`

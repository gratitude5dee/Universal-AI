

# Plan: Fix Web3 Config Caching Bug

## Root Cause Analysis

The edge function **is working** - it returns a valid clientId:
```json
{
  "clientId": "f3a41a11153f2f75d55056f08c1d36d4",
  "contractsByChainId": {},
  "paymentTokensByChainId": {}
}
```

But the frontend never reaches it because of a **caching bug**:

```text
App.tsx loads
     │
     ├─► getWeb3ConfigSync() called
     │        │
     │        └─► Sets cachedConfig = { clientId: "", ... }  (empty - no env var)
     │
     └─► useEffect runs getWeb3Config()
              │
              └─► Checks: if (cachedConfig) return cachedConfig
                       │
                       └─► Returns EMPTY cached config ❌
                           (Never fetches from edge function!)
```

---

## The Fix

Modify `src/lib/web3/config.ts` to only use the cache if it has a valid `clientId`. If the cached config has an empty `clientId`, still try fetching from the edge function.

### Before (Broken)
```typescript
export async function getWeb3Config(): Promise<Web3Config> {
  if (cachedConfig) return cachedConfig;  // ❌ Returns empty config
  // ... fetch logic never runs
}
```

### After (Fixed)
```typescript
export async function getWeb3Config(): Promise<Web3Config> {
  // Only use cache if it has a valid clientId
  if (cachedConfig && cachedConfig.clientId) return cachedConfig;
  // ... fetch logic now runs when clientId is empty
}
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/web3/config.ts` | Fix cache check to require valid `clientId` before returning cached config |

---

## Code Change

**File: `src/lib/web3/config.ts`**

Line 62 - Change from:
```typescript
if (cachedConfig) return cachedConfig;
```

To:
```typescript
// Only use cache if it has a valid clientId
if (cachedConfig?.clientId) return cachedConfig;
```

This ensures:
1. On first load, `getWeb3ConfigSync()` returns empty config (app shows loading)
2. `useEffect` calls `getWeb3Config()` which now fetches from edge function since cache has no `clientId`
3. Edge function returns real `clientId`, config is cached properly
4. App re-renders with valid thirdweb client

---

## Verification

After this fix:
1. The app will fetch the client ID from `get-thirdweb-config` edge function
2. The thirdweb client will be created with `clientId: "f3a41a11153f2f75d55056f08c1d36d4"`
3. The Web3 Initialization Error will be resolved
4. Wallet connection will work properly


# UniversalAI MCP Server

The UniversalAI MCP package exposes the Agents Commerce Protocol (x402) toolchain for orchestrators and marketplace agents.

## Requirements

- Node.js 18+
- npm or bun (tests use `bun test`)
- Supabase project (URL, anon/service keys)
- Crossmint API credentials for live wallet operations

## Installation

```bash
npm install
# or
bun install
```

## Environment Variables

Create `.env.mcp` with:

```env
MCP_BEARER_TOKEN=dev-secret
MCP_PORT=8974
MCP_MODE=mock # set to live in production
MCP_SUPABASE_URL=https://<project>.supabase.co
MCP_SUPABASE_SERVICE_ROLE_KEY=<service-role>
MCP_SUPABASE_FUNCTION_JWT=<edge-function-jwt>
MCP_CROSSMINT_API_KEY=<crossmint-key>
MCP_CROSSMINT_PROJECT_ID=<project-id>
MCP_WALLET_CONFIRMATION_SECRET=<shared-hmac-secret>
MCP_WEB_SEARCH_API_KEY=<tavily-or-provider-key>
MCP_EMBEDDING_API_KEY=<openai-or-provider-key>
```

Optional overrides:

- `MCP_ALLOWLISTED_SQL`, `MCP_ALLOWLISTED_RPCS`, `MCP_STORAGE_BUCKETS` as JSON.
- `MCP_WEB_SEARCH_ENDPOINT` for custom providers.
- `MCP_EMBEDDING_ENDPOINT` for alternative embedding models.

## Running the Server

Use your preferred TypeScript runner (e.g. `tsx` or `ts-node`). In mock mode no external calls are made.

```bash
MCP_MODE=mock MCP_BEARER_TOKEN=dev-secret npx tsx mcp/server.ts
```

Health check:

```bash
curl http://localhost:8974/health
```

Tool invocation example:

```bash
curl -X POST http://localhost:8974/invoke \
  -H "Authorization: Bearer $MCP_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tool":"kb_search","input":{"query":"latest mint results"}}'
```

Resource listing:

```bash
curl "http://localhost:8974/resources?uri=kb://universalai/"
```

Prompt rendering:

```bash
curl -X POST http://localhost:8974/prompt \
  -H "Authorization: Bearer $MCP_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"mint_transaction_plan","params":{"assetName":"Genesis Drop","chain":"solana","priceSol":1.5,"distributionTargets":["primary","secondary"]}}'
```

## Example Client Snippet

```ts
const BASE_URL = "http://localhost:8974";
const TOKEN = process.env.MCP_BEARER_TOKEN ?? "dev-secret";

async function callRpc() {
  const response = await fetch(`${BASE_URL}/invoke`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tool: "supabase_call_rpc",
      input: { functionId: "create-wallet", payload: { creatorId: "demo" } }
    })
  });
  console.log(await response.json());
}

async function searchKb() {
  const response = await fetch(`${BASE_URL}/invoke`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tool: "kb_search",
      input: { query: "creator onboarding" }
    })
  });
  console.log(await response.json());
}

await callRpc();
await searchKb();
```

## Testing

```bash
bun test mcp/tests
```

The suite covers schema validation, allowlists, and idempotency behavior.

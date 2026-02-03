import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get("Authorization") ?? "";
  const apiKeyHeader = req.headers.get("apikey") ?? req.headers.get("x-supabase-apikey") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const functionJwt = Deno.env.get("SUPABASE_FUNCTION_JWT");

  if (serviceRoleKey) {
    if (apiKeyHeader === serviceRoleKey) return true;
    if (authHeader === `Bearer ${serviceRoleKey}`) return true;
  }
  if (functionJwt && authHeader === `Bearer ${functionJwt}`) {
    return true;
  }
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!isAuthorized(req)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    const apiKey = requireEnv("CROSSMINT_API_KEY");
    const projectId = requireEnv("CROSSMINT_PROJECT_ID");
    const baseUrl = Deno.env.get("CROSSMINT_BASE_URL") ?? "https://staging.crossmint.com";

    const body = await req.json();
    const creatorId = body?.creatorId;
    const email = body?.email;
    const chain = body?.chain ?? "solana";

    if (!creatorId || !email) {
      return jsonResponse({ error: "creatorId and email are required" }, 400);
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-client-secret": apiKey,
      "x-project-id": projectId,
      "X-Correlation-Id": req.headers.get("X-Correlation-Id") ?? "",
    };
    const idempotencyKey = req.headers.get("Idempotency-Key");
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }

    const response = await fetch(`${baseUrl}/api/v1-alpha1/wallets`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        chain,
        email,
        metadata: { creatorId },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse(
        { error: "Crossmint wallet creation failed", detail: errorText },
        response.status,
      );
    }

    const data = await response.json();

    return jsonResponse({
      walletId: data.id ?? data.walletId ?? "unknown",
      walletAddress: data.publicKey ?? data.walletAddress ?? "",
      chain: data.chain ?? chain,
      status: data.status ?? "pending",
    });
  } catch (error) {
    console.error("Error in create-wallet function:", error);
    return jsonResponse({ error: "Internal Server Error" }, 500);
  }
});

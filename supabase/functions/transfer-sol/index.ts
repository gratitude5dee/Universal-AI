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
    const transferEndpoint = requireEnv("CROSSMINT_TRANSFER_ENDPOINT");

    const body = await req.json();
    const fromWallet = body?.fromWallet;
    const toWallet = body?.toWallet;
    const amount = body?.amount;
    const memo = body?.memo;

    if (!fromWallet || !toWallet || amount === undefined) {
      return jsonResponse({ error: "fromWallet, toWallet, and amount are required" }, 400);
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

    const response = await fetch(transferEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        fromWallet,
        toWallet,
        amount,
        memo,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse(
        { error: "Crossmint transfer failed", detail: errorText },
        response.status,
      );
    }

    const data = await response.json();

    return jsonResponse({
      signature: data.signature ?? data.txSignature ?? data.transaction ?? null,
      status: data.status ?? "submitted",
    });
  } catch (error) {
    console.error("Error in transfer-sol function:", error);
    return jsonResponse({ error: "Internal Server Error" }, 500);
  }
});

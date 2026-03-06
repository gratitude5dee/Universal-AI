import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

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

function randomHex(bytes = 16): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function buildMessageToSign(params: {
  origin: string;
  userId: string;
  walletAddress: string;
  sessionId: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
}) {
  // Keep this format stable; wallet-link-complete reconstructs it.
  return [
    "UniversalAI Wallet Link",
    "",
    `Origin: ${params.origin}`,
    `User: ${params.userId}`,
    `Wallet: ${params.walletAddress}`,
    `Session: ${params.sessionId}`,
    `Nonce: ${params.nonce}`,
    `Issued At: ${params.issuedAt}`,
    `Expires At: ${params.expiresAt}`,
  ].join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Missing authorization header" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase credentials are not configured");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const accessToken = authHeader.replace("Bearer ", "").trim();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);
    if (authError || !user) return jsonResponse({ error: "Invalid authorization token" }, 401);

    const body = await req.json().catch(() => ({}));
    const walletAddress = String(body?.walletAddress ?? "").trim();
    const walletType = String(body?.walletType ?? "evm").trim();
    if (!walletAddress) return jsonResponse({ error: "walletAddress is required" }, 400);

    const nonce = randomHex(16);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 min

    // Create the DB session first so the message includes the session id.
    const { data: inserted, error: insertError } = await supabase
      .from("wallet_sessions")
      .insert({
        user_id: user.id,
        wallet_address: walletAddress,
        wallet_type: walletType,
        nonce,
        is_active: false,
        expires_at: expiresAt.toISOString(),
      })
      .select("id, created_at, expires_at")
      .single();

    if (insertError || !inserted) {
      console.error("[wallet-link-start] insertError:", insertError);
      return jsonResponse({ error: "Failed to create wallet session" }, 500);
    }

    const origin = req.headers.get("origin") ?? "unknown";
    const messageToSign = buildMessageToSign({
      origin,
      userId: user.id,
      walletAddress,
      sessionId: inserted.id,
      nonce,
      issuedAt: inserted.created_at,
      expiresAt: inserted.expires_at ?? expiresAt.toISOString(),
    });

    return jsonResponse({
      sessionId: inserted.id,
      nonce,
      messageToSign,
      expiresAt: inserted.expires_at ?? expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("[wallet-link-start] Error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});


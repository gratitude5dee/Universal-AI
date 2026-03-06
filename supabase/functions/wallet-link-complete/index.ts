import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";
import { verifyMessage } from "https://esm.sh/ethers@6.13.4?target=deno";

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

function buildMessageToSign(params: {
  origin: string;
  userId: string;
  walletAddress: string;
  sessionId: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
}) {
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
    const sessionId = String(body?.sessionId ?? "").trim();
    const walletAddress = String(body?.walletAddress ?? "").trim();
    const signature = String(body?.signature ?? "").trim();

    if (!sessionId || !walletAddress || !signature) {
      return jsonResponse({ error: "sessionId, walletAddress, and signature are required" }, 400);
    }

    const { data: session, error: sessionError } = await supabase
      .from("wallet_sessions")
      .select("id, user_id, wallet_address, wallet_type, nonce, created_at, expires_at, is_active")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (sessionError) throw sessionError;
    if (!session) return jsonResponse({ error: "Session not found" }, 404);
    if (session.is_active) return jsonResponse({ ok: true, alreadyLinked: true });
    if (session.wallet_address?.toLowerCase() !== walletAddress.toLowerCase()) {
      return jsonResponse({ error: "walletAddress mismatch" }, 400);
    }

    const expires = session.expires_at ? new Date(session.expires_at).getTime() : 0;
    if (!expires || Date.now() > expires) return jsonResponse({ error: "Session expired" }, 400);

    const origin = req.headers.get("origin") ?? "unknown";
    const messageToSign = buildMessageToSign({
      origin,
      userId: user.id,
      walletAddress,
      sessionId: session.id,
      nonce: session.nonce ?? "",
      issuedAt: session.created_at,
      expiresAt: session.expires_at,
    });

    const recovered = verifyMessage(messageToSign, signature);
    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return jsonResponse({ error: "Signature verification failed" }, 401);
    }

    const nowIso = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("wallet_sessions")
      .update({ is_active: true, signature })
      .eq("id", session.id)
      .eq("user_id", user.id);
    if (updateError) throw updateError;

    // Link wallet to user (multi-wallet support)
    await supabase.from("wallet_users").upsert(
      {
        user_id: user.id,
        wallet_address: walletAddress,
      },
      { onConflict: "user_id,wallet_address" },
    );

    // Update the primary wallet fields on profile for convenience.
    await supabase
      .from("profiles")
      .update({
        wallet_address: walletAddress,
        wallet_type: session.wallet_type ?? "evm",
        last_wallet_connection: nowIso,
      })
      .eq("id", user.id);

    return jsonResponse({ ok: true, walletAddress });
  } catch (error) {
    console.error("[wallet-link-complete] Error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});


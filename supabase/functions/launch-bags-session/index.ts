import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  createAuthedClient,
  HttpError,
  insertLaunchJob,
  insertLaunchStep,
  isHttpError,
  jsonResponse,
  providerMode,
  upsertProviderConnection,
} from "../_shared/provider-boundary.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const { supabase, user } = await createAuthedClient(req);
    const body = await req.json().catch(() => ({}));

    const name = String(body?.name ?? "").trim();
    const symbol = String(body?.symbol ?? "").trim().toUpperCase();
    const description = String(body?.description ?? "").trim();
    const launchWallet = String(body?.launchWallet ?? "").trim();

    if (!name || !symbol || !description || !launchWallet) {
      throw new HttpError("name, symbol, description, and launchWallet are required", 400);
    }

    const warnings: string[] = [];
    if (!body?.imageUrl) {
      warnings.push("Token artwork is missing. Bags metadata upload should include a final image before launch.");
    }
    if (!body?.socialHandle) {
      warnings.push("No social handle provided. Bags social discovery and launch attribution will be limited.");
    }

    const mode = providerMode(["BAGS_API_KEY", "BAGS_API_URL", "BAGS_SECRET"]);

    await upsertProviderConnection(supabase, {
      userId: user.id,
      providerId: "bags",
      status: "ready",
      secretType: "bags_api_key",
      connectionMetadata: {
        route_wallet: "solana_wallet_standard",
      },
    });

    const sessionId = await insertLaunchJob(supabase, {
      creatorId: user.id,
      launchProvider: "bags",
      walletProvider: "solana_wallet_standard",
      executionProvider: "bags",
      custodyMode: "external_user",
      chain: "solana",
      walletAddress: launchWallet,
      requestPayload: body,
      responsePayload: { warnings, adapterMode: "route_scoped", mode },
      status: "session_ready",
    });

    await insertLaunchStep(supabase, {
      jobId: sessionId,
      stepKey: "bags_launch_session",
      stepOrder: 1,
      provider: "bags",
      status: "ready",
      metadata: {
        adapterMode: "route_scoped",
        launchWallet,
      },
    });

    return jsonResponse({
      mode,
      launchProvider: "bags",
      executionProvider: "bags",
      walletProvider: "solana_wallet_standard",
      custodyMode: "external_user",
      sessionId,
      warnings,
      adapterMode: "route_scoped",
      nextAction:
        mode === "configured"
          ? "Continue into the Bags launch flow and request the user-scoped Solana signature."
          : "Configure Bags credentials and metadata upload before creating the final launch transaction.",
    });
  } catch (error) {
    console.error("[launch-bags-session]", error);
    if (isHttpError(error)) {
      return jsonResponse({ error: error.message }, error.status);
    }
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

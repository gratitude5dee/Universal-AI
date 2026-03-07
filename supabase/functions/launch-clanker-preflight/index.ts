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
    const walletAddress = String(body?.walletAddress ?? "").trim();
    const chainId = Number(body?.chainId);

    if (!name || !symbol || !description || !walletAddress || !Number.isFinite(chainId)) {
      throw new HttpError("name, symbol, description, walletAddress, and chainId are required", 400);
    }

    const warnings: string[] = [];
    if (chainId !== 8453) {
      warnings.push("Clanker is optimized for Base. Switch the connected thirdweb wallet to Base before submission.");
    }
    if (!body?.imageUrl) {
      warnings.push("Add token artwork before final launch so metadata is complete.");
    }
    if (!body?.website) {
      warnings.push("Website is optional, but launch analytics work better with a canonical project URL.");
    }

    const mode = providerMode(["CLANKER_API_KEY", "CLANKER_RPC_URL", "CLANKER_BASE_URL"]);

    await upsertProviderConnection(supabase, {
      userId: user.id,
      providerId: "clanker",
      status: "ready",
      connectionMetadata: {
        last_chain_id: chainId,
        wallet_provider: "thirdweb_evm",
      },
    });

    const preflightId = await insertLaunchJob(supabase, {
      creatorId: user.id,
      launchProvider: "clanker",
      walletProvider: "thirdweb_evm",
      executionProvider: "clanker",
      custodyMode: "external_user",
      chain: chainId === 8453 ? "base" : `eip155:${chainId}`,
      walletAddress,
      requestPayload: body,
      responsePayload: { warnings, mode },
      status: "preflight_ready",
    });

    await insertLaunchStep(supabase, {
      jobId: preflightId,
      stepKey: "clanker_preflight",
      stepOrder: 1,
      provider: "clanker",
      status: "ready",
      metadata: {
        chainId,
        walletAddress,
      },
    });

    return jsonResponse({
      mode,
      launchProvider: "clanker",
      executionProvider: "clanker",
      walletProvider: "thirdweb_evm",
      custodyMode: "external_user",
      preflightId,
      chainId,
      warnings,
      nextAction:
        mode === "configured"
          ? "Request a signed Clanker launch from the connected thirdweb wallet."
          : "Configure Clanker server credentials before submitting the final launch transaction.",
    });
  } catch (error) {
    console.error("[launch-clanker-preflight]", error);
    if (isHttpError(error)) {
      return jsonResponse({ error: error.message }, error.status);
    }
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

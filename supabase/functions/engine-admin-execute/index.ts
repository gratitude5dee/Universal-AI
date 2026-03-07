import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  createAuthedClient,
  HttpError,
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

    const action = String(body?.action ?? "").trim();
    const contractAddress = String(body?.contractAddress ?? "").trim();
    const method = String(body?.method ?? "").trim();
    const chainId = Number(body?.chainId);

    if (!action || !contractAddress || !method || !Number.isFinite(chainId)) {
      throw new HttpError("action, contractAddress, method, and chainId are required", 400);
    }

    const mode = providerMode(["THIRDWEB_ENGINE_ACCESS_TOKEN", "THIRDWEB_ENGINE_URL"]);
    const requestId = crypto.randomUUID();

    await upsertProviderConnection(supabase, {
      userId: user.id,
      providerId: "thirdweb_engine",
      status: "server_managed",
      secretType: "thirdweb_engine_access_token",
      connectionMetadata: {
        last_chain_id: chainId,
        last_action: action,
      },
    });

    return jsonResponse({
      mode,
      executionProvider: "thirdweb_engine",
      requestId,
      status: "ready",
      nextAction:
        mode === "configured"
          ? "Submit the admin action through thirdweb Engine using delegated server credentials."
          : "Configure thirdweb Engine credentials before promoting this admin action beyond preflight.",
    });
  } catch (error) {
    console.error("[engine-admin-execute]", error);
    if (isHttpError(error)) {
      return jsonResponse({ error: error.message }, error.status);
    }
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

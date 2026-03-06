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

    const prompt = String(body?.prompt ?? "").trim();
    const chain = String(body?.chain ?? "").trim().toLowerCase();
    const objective = String(body?.objective ?? "").trim().toLowerCase();

    if (!prompt || !chain || !objective) {
      throw new HttpError("prompt, chain, and objective are required", 400);
    }

    const mode = providerMode(["BANKR_API_KEY", "BANKR_API_URL", "BANKR_WALLET_PRIVATE_KEY"]);

    await upsertProviderConnection(supabase, {
      userId: user.id,
      providerId: "bankr",
      status: "optional",
      secretType: "bankr_api_key",
      connectionMetadata: {
        chain,
        objective,
      },
    });

    const guidance =
      objective === "research"
        ? "Use Bankr for optional market research only. Do not route core launch execution through it."
        : objective === "profile"
          ? "Bankr can publish advanced agent profiles, but it must remain decoupled from creator identity and wallet ownership."
          : "Bankr can automate post-launch workflows and operator research, but Clanker and Bags remain the primary launch providers.";

    return jsonResponse({
      mode,
      executionProvider: "bankr",
      launchProvider: objective === "automation" ? "bankr" : undefined,
      guidance,
      nextAction:
        mode === "configured"
          ? "Continue with the optional Bankr automation workflow after the core launch boundary is satisfied."
          : "Add a Bankr API key to user_secrets or server env before running advanced automation.",
    });
  } catch (error) {
    console.error("[bankr-automation-session]", error);
    if (isHttpError(error)) {
      return jsonResponse({ error: error.message }, error.status);
    }
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

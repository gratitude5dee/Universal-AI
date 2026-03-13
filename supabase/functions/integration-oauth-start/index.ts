import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const providerId = String(payload.providerId ?? "").trim();
    const redirectUri = String(payload.redirectUri ?? "").trim();

    if (!providerId || !redirectUri) {
      throw new Error("providerId and redirectUri are required");
    }

    const state = crypto.randomUUID();
    const codeVerifier = crypto.randomUUID().replaceAll("-", "");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await adminClient.from("oauth_states").insert({
      state,
      creator_id: user.id,
      provider_id: providerId,
      redirect_uri: redirectUri,
      requested_scopes: Array.isArray(payload.scopes) ? payload.scopes : [],
      status: "issued",
      code_verifier: codeVerifier,
      metadata: payload.metadata ?? {},
      expires_at: expiresAt,
    });

    if (error) {
      throw new Error(`Failed to create oauth state: ${error.message}`);
    }

    const baseUrl = Deno.env.get("INTEGRATION_OAUTH_BASE_URL") ?? "https://example.com/oauth";
    const authUrl = `${baseUrl}/${providerId}?${new URLSearchParams({
      state,
      redirect_uri: redirectUri,
    }).toString()}`;

    return {
      creatorId: user.id,
      subjectType: "oauth_state",
      subjectId: state,
      jobType: "integration_oauth_start",
      jobStatus: "succeeded",
      eventDomain: "integrations",
      eventType: "integration_oauth_started",
      response: {
        providerId,
        state,
        codeVerifier,
        expiresAt,
        authUrl,
      },
    };
  },
});

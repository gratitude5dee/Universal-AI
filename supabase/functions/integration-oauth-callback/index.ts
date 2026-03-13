import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  allowUnauthenticated: true,
  handle: async ({ body, adminClient }) => {
    const payload = body as Record<string, unknown>;
    const state = String(payload.state ?? "").trim();
    if (!state) {
      throw new Error("state is required");
    }

    const { data: oauthState, error: oauthError } = await adminClient
      .from("oauth_states")
      .select("*")
      .eq("state", state)
      .maybeSingle();

    if (oauthError || !oauthState) {
      throw new Error(`Failed to resolve oauth state: ${oauthError?.message ?? "Unknown state"}`);
    }

    const creatorId = oauthState.creator_id as string;
    const providerId = oauthState.provider_id as string;

    const { data: account, error: accountError } = await adminClient
      .from("integration_accounts")
      .upsert({
        creator_id: creatorId,
        provider_id: providerId,
        external_account_id: payload.externalAccountId ?? payload.accountId ?? state,
        display_name: payload.displayName ?? providerId,
        status: "connected",
        scopes: oauthState.requested_scopes ?? [],
        account_metadata: payload.metadata ?? {},
        last_synced_at: new Date().toISOString(),
      }, {
        onConflict: "creator_id,provider_id,external_account_id",
      })
      .select("id")
      .single();

    if (accountError || !account) {
      throw new Error(`Failed to upsert integration account: ${accountError?.message ?? "Unknown error"}`);
    }

    if (payload.accessToken) {
      await adminClient
        .from("integration_tokens")
        .insert({
          creator_id: creatorId,
          integration_account_id: account.id,
          provider_id: providerId,
          token_type: "oauth",
          ciphertext: String(payload.accessToken),
          nonce: String(payload.nonce ?? "server-managed"),
          key_version: Number(payload.keyVersion ?? 1),
          expires_at: payload.expiresAt ?? null,
        });
    }

    await adminClient
      .from("provider_connections")
      .upsert({
        user_id: creatorId,
        provider_id: providerId,
        status: "connected",
        secret_type: null,
        connection_metadata: payload.metadata ?? {},
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,provider_id",
      });

    await adminClient
      .from("oauth_states")
      .update({
        status: "consumed",
        consumed_at: new Date().toISOString(),
      })
      .eq("state", state);

    return {
      creatorId,
      subjectType: "integration_account",
      subjectId: account.id as string,
      jobType: "integration_oauth_callback",
      jobStatus: "succeeded",
      eventDomain: "integrations",
      eventType: "integration_oauth_completed",
      response: {
        integrationAccountId: account.id,
        providerId,
      },
    };
  },
});

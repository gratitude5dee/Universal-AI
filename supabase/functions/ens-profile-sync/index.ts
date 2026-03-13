import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["ENS_RPC_URL"],
  handle: async ({ body, adminClient, user, mode }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const ensName = String(payload.ensName ?? "").trim();
    if (!ensName) {
      throw new Error("ensName is required");
    }

    const { data: account, error } = await adminClient
      .from("integration_accounts")
      .upsert({
        creator_id: user.id,
        provider_id: "ens",
        external_account_id: payload.address ?? user.id,
        display_name: ensName,
        status: "connected",
        scopes: [],
        account_metadata: {
          address: payload.address ?? null,
          mode,
        },
        last_synced_at: new Date().toISOString(),
      }, {
        onConflict: "creator_id,provider_id,external_account_id",
      })
      .select("id")
      .single();

    if (error || !account) {
      throw new Error(`Failed to sync ENS profile: ${error?.message ?? "Unknown error"}`);
    }

    await adminClient
      .from("provider_connections")
      .upsert({
        user_id: user.id,
        provider_id: "ens",
        status: "connected",
        secret_type: null,
        connection_metadata: { ensName, address: payload.address ?? null },
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,provider_id",
      });

    return {
      creatorId: user.id,
      subjectType: "integration_account",
      subjectId: account.id as string,
      jobType: "ens_profile_sync",
      jobStatus: "succeeded",
      eventDomain: "integrations",
      eventType: "ens_profile_synced",
      response: {
        integrationAccountId: account.id,
        ensName,
      },
    };
  },
});

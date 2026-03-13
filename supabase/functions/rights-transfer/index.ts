import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["STORY_API_KEY"],
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const ipAssetId = String(payload.ipAssetId ?? "").trim();
    const toWallet = String(payload.toWallet ?? "").trim();

    if (!ipAssetId || !toWallet) {
      throw new Error("ipAssetId and toWallet are required");
    }

    const { data, error } = await adminClient
      .from("ip_transfers")
      .insert({
        creator_id: user.id,
        ip_asset_id: ipAssetId,
        from_wallet: payload.fromWallet ?? null,
        to_wallet: toWallet,
        status: "queued",
        metadata: payload.metadata ?? {},
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to create rights transfer: ${error?.message ?? "Unknown error"}`);
    }

    return {
      creatorId: user.id,
      subjectType: "ip_transfer",
      subjectId: data.id as string,
      jobType: "rights_transfer",
      jobStatus: "queued",
      eventDomain: "rights",
      eventType: "rights_transfer_requested",
      payload: { ipAssetId, toWallet },
      response: { transferId: data.id },
    };
  },
});

import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["STORY_API_KEY"],
  handle: async ({ body, adminClient, user, mode }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const ipAssetId = String(payload.ipAssetId ?? "").trim();
    if (!ipAssetId) {
      throw new Error("ipAssetId is required");
    }

    const { data, error } = await adminClient
      .from("ip_licenses")
      .insert({
        creator_id: user.id,
        ip_asset_id: ipAssetId,
        license_template_id: payload.licenseTemplateId ?? null,
        licensee_name: payload.licenseeName ?? null,
        licensee_wallet: payload.licenseeWallet ?? null,
        scope: payload.scope ?? "commercial",
        status: "queued",
        price_amount: payload.priceAmount ?? 0,
        currency: payload.currency ?? "USD",
        metadata: {
          ...(payload.metadata as Record<string, unknown> | undefined),
          mode,
        },
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to queue license mint: ${error?.message ?? "Unknown error"}`);
    }

    await adminClient.from("rights_audit").insert({
      creator_id: user.id,
      ip_asset_id: ipAssetId,
      event_type: "license_mint_requested",
      subject_type: "ip_license",
      subject_id: data.id,
      metadata: payload.metadata ?? {},
    });

    return {
      creatorId: user.id,
      subjectType: "ip_license",
      subjectId: data.id as string,
      jobType: "license_mint",
      jobStatus: "queued",
      eventDomain: "rights",
      eventType: "license_mint_requested",
      payload: { ipAssetId },
      response: { licenseId: data.id, status: "queued" },
    };
  },
});

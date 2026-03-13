import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["STORY_API_KEY"],
  handle: async ({ body, adminClient, user, mode }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const title = String(payload.title ?? "").trim();
    if (!title) {
      throw new Error("title is required");
    }

    const { data, error } = await adminClient
      .from("ip_assets")
      .insert({
        creator_id: user.id,
        content_item_id: payload.contentItemId ?? null,
        title,
        network: payload.network ?? "story",
        registration_status: "queued",
        story_ip_id: payload.storyIpId ?? null,
        metadata: {
          ...(payload.metadata as Record<string, unknown> | undefined),
          mode,
        },
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to create IP asset: ${error?.message ?? "Unknown error"}`);
    }

    await adminClient.from("rights_audit").insert({
      creator_id: user.id,
      ip_asset_id: data.id,
      event_type: "story_register_asset_requested",
      subject_type: "ip_asset",
      subject_id: data.id,
      metadata: payload.metadata ?? {},
    });

    return {
      creatorId: user.id,
      subjectType: "ip_asset",
      subjectId: data.id as string,
      jobType: "story_register_asset",
      jobStatus: "queued",
      eventDomain: "rights",
      eventType: "ip_asset_registration_requested",
      payload: {
        ipAssetId: data.id,
        network: payload.network ?? "story",
      },
      response: {
        ipAssetId: data.id,
        status: "queued",
      },
    };
  },
});

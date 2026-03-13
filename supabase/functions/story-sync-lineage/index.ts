import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["STORY_API_KEY"],
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const parentIpAssetId = String(payload.parentIpAssetId ?? "").trim();
    const childIpAssetId = String(payload.childIpAssetId ?? "").trim();

    if (!parentIpAssetId || !childIpAssetId) {
      throw new Error("parentIpAssetId and childIpAssetId are required");
    }

    const { data, error } = await adminClient
      .from("ip_lineage_edges")
      .upsert({
        creator_id: user.id,
        parent_ip_asset_id: parentIpAssetId,
        child_ip_asset_id: childIpAssetId,
        relationship_type: payload.relationshipType ?? "derivative",
        metadata: payload.metadata ?? {},
      }, {
        onConflict: "parent_ip_asset_id,child_ip_asset_id,relationship_type",
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to sync lineage: ${error?.message ?? "Unknown error"}`);
    }

    await adminClient.from("rights_audit").insert({
      creator_id: user.id,
      ip_asset_id: childIpAssetId,
      event_type: "lineage_sync_requested",
      subject_type: "ip_lineage_edge",
      subject_id: data.id,
      metadata: payload.metadata ?? {},
    });

    return {
      creatorId: user.id,
      subjectType: "ip_lineage_edge",
      subjectId: data.id as string,
      jobType: "story_sync_lineage",
      jobStatus: "queued",
      eventDomain: "rights",
      eventType: "lineage_sync_requested",
      payload: {
        parentIpAssetId,
        childIpAssetId,
      },
      response: {
        lineageEdgeId: data.id,
      },
    };
  },
});

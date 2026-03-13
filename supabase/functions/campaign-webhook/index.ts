import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  allowUnauthenticated: true,
  handle: async ({ body, adminClient }) => {
    const payload = body as Record<string, unknown>;
    const providerId = String(payload.providerId ?? "").trim();
    const eventType = String(payload.eventType ?? "").trim();

    if (!providerId || !eventType) {
      throw new Error("providerId and eventType are required");
    }

    const creatorId = payload.creatorId ? String(payload.creatorId) : null;
    const { data, error } = await adminClient
      .from("webhook_deliveries")
      .insert({
        creator_id: creatorId,
        provider_id: providerId,
        event_type: eventType,
        status: "processed",
        request_headers: payload.headers ?? {},
        request_body: payload.payload ?? {},
        response_body: {},
        processed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to record webhook delivery: ${error?.message ?? "Unknown error"}`);
    }

    const externalPostId = payload.externalPostId ? String(payload.externalPostId) : null;
    if (creatorId && externalPostId) {
      await adminClient
        .from("published_posts")
        .update({
          metrics: payload.metrics ?? {},
          updated_at: new Date().toISOString(),
        })
        .eq("creator_id", creatorId)
        .eq("external_post_id", externalPostId);
    }

    return {
      creatorId,
      subjectType: "webhook_delivery",
      subjectId: data.id as string,
      eventDomain: "marketing",
      eventType: "campaign_webhook_processed",
      response: {
        webhookDeliveryId: data.id,
      },
    };
  },
});

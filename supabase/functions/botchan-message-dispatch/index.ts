import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["BOTCHAN_API_KEY"],
  handle: async ({ body, adminClient, user, mode }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const messageBody = String(payload.messageBody ?? "").trim();
    if (!messageBody) {
      throw new Error("messageBody is required");
    }

    const providerId = String(payload.providerId ?? "botchan");
    const { data: message, error } = await adminClient
      .from("community_messages")
      .insert({
        creator_id: user.id,
        agent_id: payload.agentId ?? null,
        provider_id: providerId,
        channel_id: payload.channelId ?? null,
        direction: "outbound",
        status: "sent",
        message_body: messageBody,
        metadata: {
          ...(payload.metadata as Record<string, unknown> | undefined),
          mode,
        },
        delivered_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !message) {
      throw new Error(`Failed to dispatch Botchan message: ${error?.message ?? "Unknown error"}`);
    }

    await adminClient.from("agent_inboxes").insert({
      creator_id: user.id,
      agent_id: payload.agentId ?? null,
      source_provider: providerId,
      thread_id: payload.threadId ?? null,
      message_body: messageBody,
      status: "read",
      metadata: payload.metadata ?? {},
    });

    return {
      creatorId: user.id,
      subjectType: "community_message",
      subjectId: message.id as string,
      jobType: "botchan_message_dispatch",
      jobStatus: "succeeded",
      eventDomain: "agents",
      eventType: "botchan_message_dispatched",
      response: {
        communityMessageId: message.id,
      },
    };
  },
});

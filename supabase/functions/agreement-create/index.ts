import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const title = String(payload.title ?? "").trim();
    const agreementType = String(payload.agreementType ?? "").trim();

    if (!title || !agreementType) {
      throw new Error("title and agreementType are required");
    }

    const { data, error } = await adminClient
      .from("ip_agreements")
      .insert({
        creator_id: user.id,
        ip_asset_id: payload.ipAssetId ?? null,
        agreement_type: agreementType,
        title,
        counterparty_name: payload.counterpartyName ?? null,
        counterparty_email: payload.counterpartyEmail ?? null,
        effective_at: payload.effectiveAt ?? null,
        expires_at: payload.expiresAt ?? null,
        status: "pending_signature",
        metadata: payload.metadata ?? {},
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(`Failed to create agreement: ${error?.message ?? "Unknown error"}`);
    }

    return {
      creatorId: user.id,
      subjectType: "ip_agreement",
      subjectId: data.id as string,
      jobType: "agreement_create",
      jobStatus: "succeeded",
      eventDomain: "rights",
      eventType: "agreement_created",
      payload: { agreementType },
      response: { agreementId: data.id },
    };
  },
});

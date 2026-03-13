import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  providerEnvNames: ["STORY_API_KEY"],
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const licenseId = String(payload.licenseId ?? "").trim();
    if (!licenseId) {
      throw new Error("licenseId is required");
    }

    const { error } = await adminClient
      .from("ip_licenses")
      .update({
        status: "revoked",
        revoked_at: new Date().toISOString(),
        metadata: payload.metadata ?? {},
      })
      .eq("id", licenseId)
      .eq("creator_id", user.id);

    if (error) {
      throw new Error(`Failed to revoke license: ${error.message}`);
    }

    await adminClient.from("rights_audit").insert({
      creator_id: user.id,
      event_type: "license_revoked",
      subject_type: "ip_license",
      subject_id: licenseId,
      metadata: payload.metadata ?? {},
    });

    return {
      creatorId: user.id,
      subjectType: "ip_license",
      subjectId: licenseId,
      jobType: "license_revoke",
      jobStatus: "succeeded",
      eventDomain: "rights",
      eventType: "license_revoked",
      response: { licenseId, status: "revoked" },
    };
  },
});

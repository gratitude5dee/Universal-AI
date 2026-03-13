import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const title = String(payload.title ?? "").trim();
    const fileType = String(payload.fileType ?? "").trim();

    if (!title || !fileType) {
      throw new Error("title and fileType are required");
    }

    const contentItemId = payload.contentItemId ? String(payload.contentItemId) : null;

    let resolvedContentItemId = contentItemId;
    if (resolvedContentItemId) {
      const { error } = await adminClient
        .from("content_items")
        .update({
          title,
          description: payload.description ?? null,
          folder_id: payload.folderId ?? null,
          storage_path: payload.storagePath ?? null,
          thumbnail_url: payload.thumbnailUrl ?? null,
          metadata: payload.metadata ?? {},
          tags: Array.isArray(payload.tags) ? payload.tags : [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", resolvedContentItemId)
        .eq("user_id", user.id);

      if (error) {
        throw new Error(`Failed to update content item: ${error.message}`);
      }

      const { data: latestVersion } = await adminClient
        .from("content_versions")
        .select("version_number")
        .eq("content_item_id", resolvedContentItemId)
        .order("version_number", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersion = (latestVersion?.version_number ?? 0) + 1;
      const { error: versionError } = await adminClient.from("content_versions").insert({
        creator_id: user.id,
        content_item_id: resolvedContentItemId,
        version_number: nextVersion,
        storage_path: payload.storagePath ?? null,
        version_metadata: payload.metadata ?? {},
      });

      if (versionError) {
        throw new Error(`Failed to create content version: ${versionError.message}`);
      }
    } else {
      const { data, error } = await adminClient
        .from("content_items")
        .insert({
          user_id: user.id,
          folder_id: payload.folderId ?? null,
          title,
          description: payload.description ?? null,
          file_type: fileType,
          file_size: payload.fileSize ?? null,
          storage_path: payload.storagePath ?? null,
          thumbnail_url: payload.thumbnailUrl ?? null,
          metadata: payload.metadata ?? {},
          tags: Array.isArray(payload.tags) ? payload.tags : [],
          qr_code_data: payload.qrCodeData ?? null,
        })
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(`Failed to create content item: ${error?.message ?? "Unknown error"}`);
      }

      resolvedContentItemId = data.id as string;
    }

    return {
      creatorId: user.id,
      subjectType: "content_item",
      subjectId: resolvedContentItemId,
      jobType: "content_ingest",
      jobStatus: "succeeded",
      eventDomain: "content",
      eventType: "content_ingested",
      payload: {
        contentItemId: resolvedContentItemId,
        fileType,
      },
      response: {
        contentItemId: resolvedContentItemId,
      },
    };
  },
});

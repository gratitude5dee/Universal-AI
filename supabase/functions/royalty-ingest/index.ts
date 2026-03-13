import { serveDomainAction } from "../_shared/domain-workflows.ts";

function parseCsv(text: string) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = headerLine.split(",").map((header) => header.trim());
  return lines.map((line) => {
    const values = line.split(",").map((value) => value.trim());
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
}

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    let uploadId = payload.uploadId ? String(payload.uploadId) : null;

    if (!uploadId) {
      const source = String(payload.source ?? "").trim();
      if (!source) throw new Error("source is required");

      const { data: upload, error: uploadError } = await adminClient
        .from("royalty_statement_uploads")
        .insert({
          creator_id: user.id,
          source,
          artist_name: payload.artistName ?? null,
          period_start: payload.periodStart ?? null,
          period_end: payload.periodEnd ?? null,
          storage_path: payload.storagePath ?? null,
          status: "queued",
          metadata: payload.metadata ?? {},
        })
        .select("id")
        .single();

      if (uploadError || !upload) {
        throw new Error(`Failed to create royalty upload: ${uploadError?.message ?? "Unknown error"}`);
      }

      uploadId = upload.id as string;
    }

    let lines = Array.isArray(payload.lines) ? payload.lines as Record<string, unknown>[] : [];
    if (!lines.length && typeof payload.fileText === "string" && payload.fileText.trim()) {
      lines = parseCsv(payload.fileText).map((line) => ({
        sourceRef: line.source_ref,
        lineType: line.line_type || "royalty",
        units: Number(line.units || 0),
        grossAmount: Number(line.gross_amount || 0),
        netAmount: Number(line.net_amount || 0),
        expectedAmount: line.expected_amount ? Number(line.expected_amount) : null,
      }));
    }

    if (lines.length > 0) {
      const preparedLines = lines.map((line) => ({
        creator_id: user.id,
        upload_id: uploadId,
        content_item_id: line.contentItemId ?? null,
        ip_asset_id: line.ipAssetId ?? null,
        source_ref: line.sourceRef ?? null,
        line_type: line.lineType ?? "royalty",
        units: line.units ?? null,
        gross_amount: line.grossAmount ?? 0,
        net_amount: line.netAmount ?? 0,
        expected_amount: line.expectedAmount ?? null,
        metadata: line.metadata ?? {},
      }));

      const { error: linesError } = await adminClient.from("royalty_statement_lines").insert(preparedLines);
      if (linesError) {
        throw new Error(`Failed to insert royalty lines: ${linesError.message}`);
      }
    }

    await adminClient.rpc("detect_royalty_discrepancies", { p_upload_id: uploadId });

    const { data: discrepancyRows } = await adminClient
      .from("royalty_discrepancies")
      .select("id")
      .eq("creator_id", user.id)
      .eq("upload_id", uploadId);

    const uploadStatus = discrepancyRows?.length ? "discrepancy" : "parsed";
    await adminClient
      .from("royalty_statement_uploads")
      .update({
        status: uploadStatus,
        parsed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", uploadId)
      .eq("creator_id", user.id);

    return {
      creatorId: user.id,
      subjectType: "royalty_statement_upload",
      subjectId: uploadId,
      jobType: "royalty_ingest",
      jobStatus: "succeeded",
      eventDomain: "finance",
      eventType: "royalty_statement_ingested",
      response: {
        uploadId,
        status: uploadStatus,
        lineCount: lines.length,
        discrepancyCount: discrepancyRows?.length ?? 0,
      },
    };
  },
});

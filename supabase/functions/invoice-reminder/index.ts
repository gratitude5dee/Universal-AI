import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const payload = body as Record<string, unknown>;
    const invoiceId = String(payload.invoiceId ?? "").trim();
    const recipient = String(payload.recipient ?? "").trim();

    if (!invoiceId || !recipient) {
      throw new Error("invoiceId and recipient are required");
    }

    const { data: booking } = await adminClient
      .from("venue_bookings")
      .select("id")
      .eq("invoice_id", invoiceId)
      .eq("user_id", user.id)
      .maybeSingle();

    await adminClient.from("invoice_deliveries").insert({
      creator_id: user.id,
      invoice_id: invoiceId,
      delivery_channel: payload.deliveryChannel ?? "email",
      recipient,
      status: "sent",
      delivered_at: new Date().toISOString(),
      metadata: payload.metadata ?? {},
    });

    if (booking?.id) {
      await adminClient.from("booking_communications").insert({
        creator_id: user.id,
        booking_id: booking.id,
        communication_type: "invoice_reminder",
        direction: "outbound",
        subject: payload.subject ?? "Invoice reminder",
        body: payload.messageBody ?? "Reminder: invoice payment is still pending.",
        metadata: payload.metadata ?? {},
        sent_at: new Date().toISOString(),
      });
    }

    return {
      creatorId: user.id,
      subjectType: "invoice",
      subjectId: invoiceId,
      jobType: "invoice_reminder",
      jobStatus: "succeeded",
      eventDomain: "touring",
      eventType: "invoice_reminder_sent",
      response: {
        invoiceId,
        recipient,
      },
    };
  },
});

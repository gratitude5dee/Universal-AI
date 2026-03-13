import { serveDomainAction } from "../_shared/domain-workflows.ts";

serveDomainAction({
  handle: async ({ body, adminClient, user }) => {
    if (!user) throw new Error("Authentication is required");

    const invoiceId = String((body as Record<string, unknown>).invoiceId ?? "").trim();
    if (!invoiceId) {
      throw new Error("invoiceId is required");
    }

    const { data: invoice, error } = await adminClient
      .from("invoices")
      .select(`
        id,
        invoice_number,
        amount,
        subtotal,
        tax_amount,
        balance_due,
        currency,
        due_date,
        status,
        line_items,
        notes,
        gig:gigs(
          id,
          title,
          date,
          venue:venues(name, city, state)
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      throw new Error(`Failed to load invoice: ${error?.message ?? "Unknown error"}`);
    }

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${invoice.invoice_number}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #111827; }
      h1, h2, h3 { margin: 0 0 12px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { border-bottom: 1px solid #e5e7eb; padding: 10px; text-align: left; }
      .muted { color: #6b7280; }
      .totals { margin-top: 24px; text-align: right; }
    </style>
  </head>
  <body>
    <h1>Invoice ${invoice.invoice_number}</h1>
    <p class="muted">Status: ${invoice.status}</p>
    <p class="muted">Due: ${invoice.due_date ?? "N/A"}</p>
    <h2>${invoice.gig?.title ?? "Performance"}</h2>
    <p>${invoice.gig?.venue?.name ?? ""} ${invoice.gig?.venue?.city ? `, ${invoice.gig.venue.city}` : ""}</p>
    <table>
      <thead>
        <tr><th>Description</th><th>Quantity</th><th>Amount</th></tr>
      </thead>
      <tbody>
        ${(invoice.line_items ?? []).map((item: Record<string, unknown>) => `
          <tr>
            <td>${String(item.description ?? "")}</td>
            <td>${String(item.quantity ?? 1)}</td>
            <td>${String(item.amount ?? 0)} ${invoice.currency ?? "USD"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="totals">
      <p>Subtotal: ${invoice.subtotal ?? invoice.amount} ${invoice.currency ?? "USD"}</p>
      <p>Tax: ${invoice.tax_amount ?? 0} ${invoice.currency ?? "USD"}</p>
      <p><strong>Balance Due: ${invoice.balance_due ?? invoice.amount} ${invoice.currency ?? "USD"}</strong></p>
    </div>
  </body>
</html>`;

    return {
      creatorId: user.id,
      subjectType: "invoice",
      subjectId: invoiceId,
      jobType: "invoice_pdf",
      jobStatus: "succeeded",
      eventDomain: "touring",
      eventType: "invoice_pdf_generated",
      response: {
        invoiceId,
        filename: `invoice-${invoice.invoice_number}.html`,
        html,
      },
    };
  },
});

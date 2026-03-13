import { supabase } from "@/integrations/supabase/client";

export interface TouringStatsSnapshot {
  upcomingGigs: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  overdueInvoices: number;
}

export interface InvoicePdfResult {
  invoiceId: string;
  filename: string;
  html: string;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function formatMoney(value: number | null | undefined, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

export async function exportTouringReport() {
  const { data, error } = await supabase.functions.invoke("report-export", {
    body: { reportType: "touring" },
  });

  if (error) {
    throw error;
  }

  const response = (data as { response?: { reportPayload?: Record<string, unknown> } } | null)?.response;
  const payload = response?.reportPayload ?? {};
  downloadBlob(
    `touring-report-${new Date().toISOString().slice(0, 10)}.json`,
    new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
  );
  return payload;
}

export async function fetchInvoicePdf(invoiceId: string) {
  const { data, error } = await supabase.functions.invoke("invoice-pdf", {
    body: { invoiceId },
  });

  if (error) {
    throw error;
  }

  return ((data as { response?: InvoicePdfResult } | null)?.response ?? null) as InvoicePdfResult | null;
}

export async function downloadInvoicePdf(invoiceId: string) {
  const pdfResult = await fetchInvoicePdf(invoiceId);
  if (!pdfResult) {
    throw new Error("Invoice export did not return a document.");
  }

  downloadBlob(pdfResult.filename, new Blob([pdfResult.html], { type: "text/html;charset=utf-8" }));
  return pdfResult;
}

export async function sendInvoiceReminder(input: {
  invoiceId: string;
  recipient: string;
  subject?: string;
  messageBody?: string;
  deliveryChannel?: string;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await supabase.functions.invoke("invoice-reminder", {
    body: {
      invoiceId: input.invoiceId,
      recipient: input.recipient,
      subject: input.subject,
      messageBody: input.messageBody,
      deliveryChannel: input.deliveryChannel ?? "email",
      metadata: input.metadata ?? {},
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function recordInvoicePayment(input: {
  creatorId: string;
  invoiceId: string;
  amount: number;
  paymentMethod?: string;
  transactionReference?: string;
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabase.from("invoice_payments").insert({
    creator_id: input.creatorId,
    invoice_id: input.invoiceId,
    amount: Number(input.amount),
    payment_method: input.paymentMethod ?? "manual",
    transaction_reference: input.transactionReference ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    throw error;
  }
}

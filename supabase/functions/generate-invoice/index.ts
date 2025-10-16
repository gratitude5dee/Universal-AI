import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface LineItem {
  description: string;
  amount: number;
  quantity?: number;
}

interface CreateInvoiceRequest {
  bookingId: string;
  lineItems: LineItem[];
  taxRate?: number;
  currency?: string;
  dueDate?: string;
}

const roundCurrency = (value: number) => Number(value.toFixed(2));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials are not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const accessToken = authHeader.replace('Bearer ', '').trim();
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !user) {
      throw new Error('Invalid authorization token');
    }

    const { bookingId, lineItems, taxRate = 0, currency = 'USD', dueDate }: CreateInvoiceRequest = await req.json();
    console.log('[generate-invoice] Creating invoice for booking:', bookingId);

    if (!bookingId) {
      throw new Error('bookingId is required');
    }
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error('At least one line item is required');
    }

    const normalizedLineItems = lineItems.map((item) => ({
      description: item.description?.trim(),
      amount: roundCurrency(item.amount ?? 0),
      quantity: item.quantity ?? 1
    })).filter((item) => item.description && item.amount >= 0);

    if (normalizedLineItems.length === 0) {
      throw new Error('Line items must include descriptions and non-negative amounts');
    }

    const subtotal = roundCurrency(normalizedLineItems.reduce((sum, item) => sum + item.amount * (item.quantity ?? 1), 0));
    const taxAmount = roundCurrency(subtotal * (taxRate / 100));
    const total = roundCurrency(subtotal + taxAmount);

    const { data: booking, error: bookingError } = await supabase
      .from('venue_bookings')
      .select('id, gig_id, user_id, workflow_stage, payment_status')
      .eq('id', bookingId)
      .maybeSingle();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    if (booking.user_id !== user.id) {
      throw new Error('You do not have access to this booking');
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const computedDueDate = dueDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        gig_id: booking.gig_id!,
        amount: total,
        due_date: computedDueDate,
        status: 'pending',
        notes: null,
        currency,
        line_items: normalizedLineItems,
        tax_amount: taxAmount,
        balance_due: total,
        paid_at: null
      })
      .select()
      .single();

    if (invoiceError || !invoice) {
      throw new Error(invoiceError?.message ?? 'Failed to create invoice');
    }

    const { error: bookingUpdateError } = await supabase
      .from('venue_bookings')
      .update({
        invoice_id: invoice.id,
        workflow_stage: 'invoice',
        payment_status: 'unpaid'
      })
      .eq('id', bookingId);

    if (bookingUpdateError) {
      console.error('[generate-invoice] Failed to update booking:', bookingUpdateError);
      throw new Error('Invoice created but booking status was not updated');
    }

    console.log('[generate-invoice] Invoice created:', invoice.id);

    return new Response(
      JSON.stringify({
        invoiceId: invoice.id,
        invoiceNumber,
        dueDate: computedDueDate,
        currency,
        totals: {
          subtotal,
          tax: taxAmount,
          total,
          balanceDue: total
        },
        lineItems: normalizedLineItems
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[generate-invoice] Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

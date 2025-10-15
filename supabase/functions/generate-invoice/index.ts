import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

type LineItem = {
  description: string;
  amount: number;
  quantity?: number;
};

type CreateInvoiceRequest = {
  bookingId: string;
  lineItems: LineItem[];
  taxRate?: number;
  currency?: string;
  dueDate?: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as CreateInvoiceRequest;
    const { bookingId, lineItems, taxRate = 0, dueDate, currency = 'usd' } = body;

    if (!bookingId || !Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error('bookingId and at least one line item are required');
    }

    const sanitizedItems = lineItems.map((item) => ({
      description: item.description?.trim() ?? 'Line item',
      amount: Number(item.amount ?? 0),
      quantity: item.quantity ? Number(item.quantity) : 1,
    })).filter((item) => item.amount > 0);

    if (sanitizedItems.length === 0) {
      throw new Error('Line items must include a positive amount');
    }

    console.log('[generate-invoice] Creating invoice for booking:', bookingId);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('venue_bookings')
      .select('id, user_id, gig_id, workflow_stage, payment_status')
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;
    if (!booking || booking.user_id !== user.id) {
      throw new Error('Booking not found or access denied');
    }

    // Calculate totals from line items
    const subtotal = sanitizedItems.reduce((sum, item) => {
      const quantity = Number.isFinite(item.quantity) && item.quantity ? item.quantity : 1;
      return sum + item.amount * quantity;
    }, 0);
    const taxAmountRaw = (subtotal * taxRate) / 100;
    const taxAmount = Math.max(0, Math.round(taxAmountRaw * 100) / 100);
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    // Generate invoice number with timestamp
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    
    // Due date is 30 days from now
    const computedDueDate = dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Create invoice in database
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        gig_id: booking.gig_id,
        amount: total,
        due_date: computedDueDate,
        status: 'invoiced',
        notes: JSON.stringify({
          currency,
          lineItems: sanitizedItems,
        }),
        line_items: sanitizedItems,
        tax_amount: taxAmount,
        balance_due: total,
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Update booking with invoice reference
    await supabase
      .from('venue_bookings')
      .update({
        invoice_id: invoice.id,
        workflow_stage: 'invoice',
        status: 'invoiced',
        payment_status: 'unpaid'
      })
      .eq('id', bookingId);

    console.log('[generate-invoice] Invoice created:', invoice.id);

    return new Response(
      JSON.stringify({
        invoiceId: invoice.id,
        invoiceNumber,
        status: 'invoiced',
        totals: {
          subtotal,
          tax: taxAmount,
          total,
          balanceDue: total,
        },
        dueDate: computedDueDate,
        lineItems: sanitizedItems,
        currency,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('[generate-invoice] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

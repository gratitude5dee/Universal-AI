import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, lineItems, taxRate = 0, currency = 'USD', dueDate }: {
      bookingId: string;
      lineItems: Array<{ description: string; amount: number; quantity?: number }>;
      taxRate?: number;
      currency?: string;
      dueDate?: string;
    } = await req.json();

    console.log('[generate-invoice] Creating invoice for booking:', bookingId);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    if (!bookingId) {
      throw new Error('bookingId is required');
    }

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error('At least one line item is required');
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('venue_bookings')
      .select('id, user_id, gig_id, workflow_stage')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) throw bookingError || new Error('Booking not found');

    if (booking.user_id !== user.id) {
      throw new Error('You do not have permission to invoice this booking');
    }

    const normalizedCurrency = currency.trim().toUpperCase() || 'USD';

    const normalizedItems = lineItems.map((item) => ({
      description: item.description?.trim() ?? 'Line Item',
      amount: Number(item.amount ?? 0),
      quantity: item.quantity ? Number(item.quantity) : 1,
    }));

    const rawSubtotal = normalizedItems.reduce(
      (sum, item) => sum + (item.amount || 0) * (item.quantity || 1),
      0,
    );

    const computedTaxRate = Math.max(taxRate, 0);
    const taxAmount = Number((rawSubtotal * computedTaxRate).toFixed(2));
    const subtotal = Number(rawSubtotal.toFixed(2));
    const total = Number((subtotal + taxAmount).toFixed(2));

    const resolvedDueDate = dueDate
      ? new Date(dueDate).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Calculate total from line items
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    // Create invoice in database
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        gig_id: booking.gig_id!,
        amount: total,
        currency: normalizedCurrency,
        due_date: resolvedDueDate,
        status: 'invoiced',
        line_items: normalizedItems,
        subtotal,
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
        payment_status: 'unpaid'
      })
      .eq('id', bookingId);

    console.log('[generate-invoice] Invoice created:', invoice.id);

    return new Response(
      JSON.stringify({
        invoice,
        invoiceData: {
          invoiceNumber,
          lineItems: normalizedItems,
          subtotal,
          tax: taxAmount,
          total,
          currency: normalizedCurrency,
          dueDate: resolvedDueDate,
          balanceDue: total,
        },
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

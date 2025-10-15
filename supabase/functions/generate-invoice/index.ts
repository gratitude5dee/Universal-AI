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

type LineItemInput = {
  description: string;
  amount: number;
  quantity?: number;
};

type GenerateInvoiceRequest = {
  bookingId: string;
  lineItems: LineItemInput[];
  taxRate?: number;
  currency?: string;
  dueDate?: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not configured for generate-invoice');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const supabaseAdmin = supabaseServiceRoleKey
      ? createClient(supabaseUrl, supabaseServiceRoleKey)
      : null;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = supabaseAdmin
      ? await supabaseAdmin.auth.getUser(token)
      : await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body: GenerateInvoiceRequest = await req.json();
    const { bookingId, lineItems, taxRate = 0, currency = 'USD', dueDate } = body;

    if (!bookingId || !Array.isArray(lineItems) || lineItems.length === 0) {
      return new Response(JSON.stringify({ error: 'bookingId and at least one line item are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const normalizedLineItems = lineItems.map((item) => ({
      description: item.description?.trim() ?? 'Line item',
      amount: Number(item.amount ?? 0),
      quantity: item.quantity ? Number(item.quantity) : 1,
    }));

    const subtotal = normalizedLineItems.reduce((sum, item) => sum + item.amount * (item.quantity ?? 1), 0);
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;
    const balanceDue = total;

    const effectiveDueDate = dueDate
      ? new Date(dueDate).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: booking, error: bookingError } = await supabase
      .from('venue_bookings')
      .select('id, user_id, gig_id')
      .eq('id', bookingId)
      .maybeSingle();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    if (booking.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'You are not allowed to invoice this booking' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        gig_id: booking.gig_id!,
        amount: total,
        due_date: effectiveDueDate,
        status: 'pending',
        notes: null,
        line_items: normalizedLineItems,
        tax_amount: taxAmount,
        balance_due: balanceDue,
        currency,
      })
      .select()
      .single();

    if (invoiceError || !invoice) {
      console.error('[generate-invoice] Failed to insert invoice', invoiceError);
      throw new Error('Failed to create invoice');
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
      console.error('[generate-invoice] Failed to update booking', bookingUpdateError);
      throw new Error('Failed to associate invoice with booking');
    }

    const responseBody = {
      invoice,
      invoiceData: {
        invoiceNumber,
        lineItems: normalizedLineItems,
        subtotal,
        tax: taxAmount,
        total,
        balanceDue,
        dueDate: effectiveDueDate,
        currency,
        paymentStatus: 'unpaid' as const,
      }
    };

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[generate-invoice] Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

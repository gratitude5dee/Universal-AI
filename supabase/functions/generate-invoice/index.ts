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
    const { bookingId, lineItems } = await req.json();
    console.log('[generate-invoice] Creating invoice for booking:', bookingId);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('venue_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;

    // Calculate total from line items
    const total = lineItems.reduce((sum: number, item: any) => sum + parseFloat(item.amount), 0);

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    // Create invoice in database
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        gig_id: booking.gig_id,
        amount: total,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        status: 'pending',
        notes: JSON.stringify(lineItems)
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Update booking with invoice reference
    await supabase
      .from('venue_bookings')
      .update({ 
        invoice_id: invoice.id,
        workflow_stage: 'invoice'
      })
      .eq('id', bookingId);

    console.log('[generate-invoice] Invoice created:', invoice.id);

    return new Response(
      JSON.stringify({ 
        invoice,
        invoiceData: {
          invoiceNumber,
          lineItems,
          total,
          dueDate: invoice.due_date
        }
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

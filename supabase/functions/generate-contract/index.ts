import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingDetails } = await req.json();
    console.log('[generate-contract] Generating contract:', bookingDetails);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a legal document assistant specializing in performance contracts.
Generate a professional, legally sound performance agreement contract.

Include these sections:
1. Contract header with parties (Artist and Venue)
2. Performance details (date, time, duration)
3. Compensation and payment terms
4. Technical requirements and rider
5. Cancellation policy
6. Liability and insurance
7. Force majeure clause
8. Signatures section

Use formal legal language but keep it clear and readable.
Format with proper sections and numbering.`;

    const userPrompt = `Generate a performance contract with these details:

ARTIST INFORMATION:
- Name: ${bookingDetails.artistName || 'Artist Name'}
- Contact: ${bookingDetails.artistEmail || 'artist@example.com'}

VENUE INFORMATION:
- Name: ${bookingDetails.venueName}
- Address: ${bookingDetails.venueAddress || 'Venue Address'}
- Contact: ${bookingDetails.venueContactEmail || 'venue@example.com'}

PERFORMANCE DETAILS:
- Date: ${bookingDetails.eventDate}
- Time: ${bookingDetails.eventTime}
- Duration: ${bookingDetails.duration || '2 hours'}

FINANCIAL TERMS:
- Performance Fee: $${bookingDetails.offerAmount}
- Payment Terms: ${bookingDetails.paymentTerms || '50% deposit, 50% day of show'}
- Additional Costs: ${bookingDetails.additionalCosts || 'None specified'}

Format the contract in plain text with clear section headers and numbering.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-contract] AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const contractText = data.choices?.[0]?.message?.content || '';

    console.log('[generate-contract] Contract generated successfully');

    return new Response(
      JSON.stringify({ contractText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[generate-contract] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

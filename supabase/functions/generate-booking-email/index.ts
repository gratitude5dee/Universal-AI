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
    const { 
      emailType, 
      bookingDetails,
      customMessage 
    } = await req.json();

    console.log('[generate-booking-email] Generating email:', { emailType, bookingDetails });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build system prompt based on email type
    const systemPrompts = {
      offer: `You are a professional booking assistant. Generate a compelling offer email to a venue.
Include:
- Friendly, professional greeting
- Artist introduction
- Event details (date, time, expected attendance)
- Offer amount and what it includes
- Why this venue is a great fit
- Call to action
Keep it concise (max 200 words), warm, and professional.`,

      followup: `You are a professional booking assistant. Generate a polite follow-up email.
Include:
- Reference to previous offer
- Gentle reminder
- Express continued interest
- Ask if any questions
- Provide contact info
Keep it brief (max 150 words) and friendly.`,

      contract_reminder: `You are a professional booking assistant. Generate a contract reminder email.
Include:
- Reference to accepted offer
- Link/attachment mention
- Deadline for signing
- Offer to answer questions
- Professional closing
Keep it clear and concise (max 150 words).`,

      invoice: `You are a professional booking assistant. Generate an invoice email.
Include:
- Invoice number and amount
- Due date
- Payment methods accepted
- Thank you note
- Contact for questions
Keep it professional and clear (max 150 words).`,

      thank_you: `You are a professional booking assistant. Generate a thank you email after payment.
Include:
- Gratitude for payment
- Excitement for upcoming show
- Next steps (if any)
- Looking forward message
- Contact info
Keep it warm and brief (max 150 words).`
    };

    const systemPrompt = systemPrompts[emailType as keyof typeof systemPrompts] || systemPrompts.offer;

    // Build user prompt with booking details
    const userPrompt = `Generate an email for:
Artist: ${bookingDetails.artistName || 'Artist'}
Venue: ${bookingDetails.venueName}
Date: ${bookingDetails.eventDate || 'TBD'}
Time: ${bookingDetails.eventTime || 'TBD'}
Offer Amount: $${bookingDetails.offerAmount || '0'}
Contact Email: ${bookingDetails.venueContactEmail || 'venue@example.com'}
${customMessage ? `\nCustom message from artist: ${customMessage}` : ''}

Return JSON in this format:
{
  "subject": "Email subject line",
  "body": "Email body text"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-booking-email] AI API error:', response.status, errorText);
      
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
    const content = data.choices?.[0]?.message?.content || '';

    // Try to parse JSON from response
    let emailData;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      emailData = JSON.parse(cleanContent);
    } catch (e) {
      console.error('[generate-booking-email] Failed to parse AI response:', content);
      // Fallback: use raw content as body
      emailData = {
        subject: `Booking Request - ${bookingDetails.venueName}`,
        body: content
      };
    }

    console.log('[generate-booking-email] Generated email:', emailData);

    return new Response(
      JSON.stringify(emailData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[generate-booking-email] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

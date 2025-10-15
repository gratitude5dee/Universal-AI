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
    const { bookingId, assetType, customPrompt, eventDetails } = await req.json();
    console.log('[generate-event-asset] Generating:', { assetType, bookingId });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build prompt based on asset type
    const prompts = {
      poster: `Create a professional event poster design for a live music performance.

Event: ${eventDetails.artistName} at ${eventDetails.venueName}
Date: ${eventDetails.eventDate}
Time: ${eventDetails.eventTime}
Genre: ${eventDetails.genre || 'Music'}

Style: Bold typography, vibrant colors, eye-catching layout. Include event details prominently.
Aspect ratio: 16:9 vertical poster format.
${customPrompt ? `Additional notes: ${customPrompt}` : ''}`,

      merch_design: `Create a merchandise design (t-shirt graphic) for a music artist.

Artist: ${eventDetails.artistName}
Tour/Event: ${eventDetails.venueName} - ${eventDetails.eventDate}
Genre: ${eventDetails.genre || 'Music'}

Style: Cool, wearable design that fans would love. Bold graphics, artistic interpretation.
Format: Centered design suitable for t-shirt printing.
${customPrompt ? `Additional notes: ${customPrompt}` : ''}`,

      ticket: `Create a professional event ticket design.

Event: ${eventDetails.artistName} at ${eventDetails.venueName}
Date: ${eventDetails.eventDate}
Time: ${eventDetails.eventTime}

Style: Clean, professional ticket layout with space for QR code. Include event details clearly.
Format: Horizontal ticket design.
${customPrompt ? `Additional notes: ${customPrompt}` : ''}`,

      promo_image: `Create a promotional social media image for a live music event.

Event: ${eventDetails.artistName} performing at ${eventDetails.venueName}
Date: ${eventDetails.eventDate}

Style: Eye-catching, shareable social media graphic. Bold and energetic.
Format: Square 1:1 aspect ratio for Instagram/Facebook.
${customPrompt ? `Additional notes: ${customPrompt}` : ''}`
    };

    const prompt = prompts[assetType as keyof typeof prompts] || prompts.poster;

    // Generate image using Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-event-asset] AI API error:', response.status, errorText);
      
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
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: asset, error: assetError } = await supabase
      .from('event_assets')
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        asset_type: assetType,
        file_url: imageUrl,
        generation_prompt: prompt,
        ai_model_used: 'google/gemini-2.5-flash-image-preview'
      })
      .select()
      .single();

    if (assetError) throw assetError;

    console.log('[generate-event-asset] Asset created:', asset.id);

    return new Response(
      JSON.stringify({ 
        asset,
        imageUrl 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[generate-event-asset] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

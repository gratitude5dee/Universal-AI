import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are not configured");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PodcastRequest {
  title: string;
  description: string;
  script: string;
  voiceId: string;
  duration?: number;
  style?: 'conversational' | 'news' | 'storytelling' | 'educational';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    const cerebrasApiKey = Deno.env.get('CEREBRAS_API_KEY');
    
    if (!elevenlabsApiKey || !cerebrasApiKey) {
      throw new Error('API keys not configured');
    }

    const { title, description, script, voiceId, style = 'conversational' }: PodcastRequest = await req.json();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid or missing user session");
    }

    if (!title || !script || !voiceId) {
      throw new Error('Title, script, and voice ID are required');
    }

    console.log(`Generating podcast: ${title} with voice ${voiceId}`);

    // Enhance script with AI if needed
    let enhancedScript = script;
    
    if (script.length < 200) {
      console.log('Enhancing short script with AI...');
      
      const scriptResponse = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cerebrasApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1-70b',
          messages: [
            {
              role: 'system',
              content: `You are a professional podcast script writer. Create engaging, natural-sounding podcast content in a ${style} style. Make it sound conversational and authentic.`
            },
            {
              role: 'user',
              content: `Expand this podcast script about "${title}": ${script}\n\nDescription: ${description}\n\nMake it a comprehensive 3-5 minute podcast episode with natural speech patterns, appropriate pauses, and engaging content.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (scriptResponse.ok) {
        const scriptData = await scriptResponse.json();
        enhancedScript = scriptData.choices[0].message.content;
        console.log('Script enhanced successfully');
      }
    }

    // Generate audio with ElevenLabs
    console.log('Generating audio with ElevenLabs...');
    
    const audioResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenlabsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: enhancedScript,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text();
      throw new Error(`Audio generation failed: ${errorText}`);
    }

    // Convert audio to base64
    const audioBuffer = await audioResponse.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    console.log("Uploading audio to storage...");

    const filePath = `${user.id}/${crypto.randomUUID()}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("podcast-audio")
      .upload(filePath, audioBytes, {
        contentType: "audio/mpeg",
      });

    if (uploadError) {
      throw new Error(`Failed to upload audio: ${uploadError.message}`);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("podcast-audio")
      .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours

    if (signedUrlError) {
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    const durationSeconds = Math.ceil((enhancedScript.length / 150) * 60);

    const { data: insertedPodcast, error: insertError } = await supabase
      .from("podcasts")
      .insert({
        user_id: user.id,
        title,
        description,
        script: enhancedScript,
        audio_url: filePath,
        voice_id: voiceId,
        style,
        duration_seconds: durationSeconds,
        file_size: audioBytes.byteLength,
      })
      .select()
      .single();

    if (insertError || !insertedPodcast) {
      throw new Error(`Failed to save podcast metadata: ${insertError?.message}`);
    }

    console.log("Podcast generated and stored successfully");

    return new Response(
      JSON.stringify({
        success: true,
        podcast: {
          ...insertedPodcast,
          audio_signed_url: signedUrlData?.signedUrl ?? null,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in podcast-generator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
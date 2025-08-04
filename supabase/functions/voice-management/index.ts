import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceClone {
  voice_id: string;
  name: string;
  description?: string;
  category: string;
  labels: Record<string, string>;
  samples: Array<{
    sample_id: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    hash: string;
  }>;
  settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenlabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';

    switch (action) {
      case 'list':
        // Get all available voices
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': elevenlabsApiKey,
          },
        });

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Retrieved voices:', data.voices?.length || 0);

        return new Response(JSON.stringify({
          voices: data.voices || [],
          success: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'clone':
        // Clone a voice from audio samples
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const files = formData.getAll('files') as File[];

        if (!name || files.length === 0) {
          throw new Error('Name and at least one audio file are required');
        }

        const cloneFormData = new FormData();
        cloneFormData.append('name', name);
        if (description) cloneFormData.append('description', description);
        
        files.forEach((file, index) => {
          cloneFormData.append('files', file, `sample_${index}.mp3`);
        });

        const cloneResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
          method: 'POST',
          headers: {
            'xi-api-key': elevenlabsApiKey,
          },
          body: cloneFormData,
        });

        if (!cloneResponse.ok) {
          const errorText = await cloneResponse.text();
          throw new Error(`Voice cloning failed: ${errorText}`);
        }

        const cloneResult = await cloneResponse.json();
        console.log('Voice cloned successfully:', cloneResult.voice_id);

        return new Response(JSON.stringify({
          voice_id: cloneResult.voice_id,
          success: true,
          message: 'Voice cloned successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'delete':
        // Delete a voice
        const { voice_id } = await req.json();
        
        if (!voice_id) {
          throw new Error('Voice ID is required');
        }

        const deleteResponse = await fetch(`https://api.elevenlabs.io/v1/voices/${voice_id}`, {
          method: 'DELETE',
          headers: {
            'xi-api-key': elevenlabsApiKey,
          },
        });

        if (!deleteResponse.ok) {
          throw new Error(`Failed to delete voice: ${deleteResponse.status}`);
        }

        console.log('Voice deleted successfully:', voice_id);

        return new Response(JSON.stringify({
          success: true,
          message: 'Voice deleted successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in voice-management function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
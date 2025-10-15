import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { method } = req
    const body = method !== 'GET' ? await req.json() : null

    switch (method) {
      case 'GET': {
        const { data, error } = await supabaseClient
          .from('user_secrets')
          .select('secret_type, created_at, updated_at, ciphertext, nonce')
          .eq('user_id', user.id)

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        const secrets = await Promise.all(
          (data ?? []).map(async (item) => ({
            secret_type: item.secret_type,
            created_at: item.created_at,
            updated_at: item.updated_at,
            value: await decryptValue(item.ciphertext, item.nonce),
            hasValue: Boolean(item.ciphertext && item.nonce),
          }))
        )

        return new Response(
          JSON.stringify(secrets),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      case 'POST': {
        // Create or update a secret
        const { secret_type, value } = body

        if (!secret_type || typeof value !== 'string' || value.length === 0) {
          return new Response(
            JSON.stringify({ error: 'secret_type and value are required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        const { ciphertext, nonce } = await encryptValue(value)

        const { error } = await supabaseClient
          .from('user_secrets')
          .upsert({
            user_id: user.id,
            secret_type,
            ciphertext,
            nonce
          }, {
            onConflict: 'user_id,secret_type'
          })

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      case 'DELETE': {
        // Delete a secret
        const { secret_type } = body

        if (!secret_type) {
          return new Response(
            JSON.stringify({ error: 'secret_type is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const { error } = await supabaseClient
          .from('user_secrets')
          .delete()
          .eq('user_id', user.id)
          .eq('secret_type', secret_type)

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { 
            status: 405, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
const base64ToBytes = (input: string) => Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
const bytesToBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

const encryptionKeyBase64 = Deno.env.get('USER_SECRETS_ENCRYPTION_KEY');
if (!encryptionKeyBase64) {
  throw new Error('USER_SECRETS_ENCRYPTION_KEY is not configured');
}

const encryptionKeyPromise = crypto.subtle.importKey(
  'raw',
  base64ToBytes(encryptionKeyBase64),
  { name: 'AES-GCM' },
  false,
  ['encrypt', 'decrypt'],
);

const encryptValue = async (plaintext: string) => {
  const key = await encryptionKeyPromise;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return {
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    nonce: bytesToBase64(iv),
  };
};

const decryptValue = async (ciphertext: string | null, nonce: string | null) => {
  if (!ciphertext || !nonce) return null;
  try {
    const key = await encryptionKeyPromise;
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(nonce) },
      key,
      base64ToBytes(ciphertext),
    );
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Failed to decrypt secret', error);
    return null;
  }
};

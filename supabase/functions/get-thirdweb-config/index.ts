import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get("THIRDWEB_CLIENT_ID");
    const contractsJson = Deno.env.get("THIRDWEB_CONTRACTS_JSON") ?? "{}";
    const paymentTokensJson = Deno.env.get("PAYMENT_TOKENS_JSON") ?? "{}";
    
    if (!clientId) {
      return new Response(
        JSON.stringify({ error: "THIRDWEB_CLIENT_ID not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({
        clientId,
        // Maps are configured as JSON env vars so we can update without redeploying the frontend.
        contractsByChainId: JSON.parse(contractsJson),
        paymentTokensByChainId: JSON.parse(paymentTokensJson),
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

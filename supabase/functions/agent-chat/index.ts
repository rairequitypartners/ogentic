import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY is not set.');
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY is not set in environment variables.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, model } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use provided model or fallback to default
    const modelToUse = model || "claude-3-haiku-20240307";
    console.log(`Using model: ${modelToUse}`);

    // This is the part that communicates with Anthropic's API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey, // Correct header for Anthropic
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelToUse,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Anthropic API error:', errorBody);
      return new Response(JSON.stringify({ error: 'Failed to fetch from Anthropic API.', details: errorBody }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 
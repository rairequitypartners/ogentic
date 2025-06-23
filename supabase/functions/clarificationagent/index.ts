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

    const { response } = await req.json();

    if (!response) {
      return new Response(JSON.stringify({ error: 'Response is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prompt for Anthropic: analyze and split clarification questions
    const prompt = `Analyze the following assistant response. If it contains multiple clarification questions, split them into an array of individual questions. Only return the questions, no extra text. If there is only one question, return it as a single-item array. If there are no questions, return an empty array.\n\nAssistant response:\n${response}`;

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }]
      }),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error('Anthropic API error:', errorBody);
      return new Response(JSON.stringify({ error: 'Failed to fetch from Anthropic API.', details: errorBody }), {
        status: apiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await apiResponse.json();

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
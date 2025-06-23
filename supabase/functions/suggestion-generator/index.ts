import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// IMPORTANT: THIS IS FOR TEMPORARY DEBUGGING ONLY.
// THE API KEY IS HARDCODED AND WILL BE VISIBLE.
// WE MUST REMOVE THIS AFTER THE TEST.
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are an expert in AI solutions and product development. Your task is to generate a list of 6 diverse, actionable, and creative suggestions for how businesses or freelancers can use AI. These suggestions will be displayed on the welcome screen of an application that helps users build AI-powered workflows.

**Instructions:**
1.  Generate exactly 6 unique suggestions.
2.  Each suggestion should be a concise, single-sentence description of a potential AI use case (e.g., "Automate personalized outbound emails for my SaaS").
3.  The suggestions should cover a range of business functions (e.g., marketing, sales, operations, engineering).
4.  Frame the suggestions from the user's perspective (e.g., "Help me analyze...", "Build an agent to...").
5.  Output the suggestions as a JSON array of strings, inside a single \`<json_suggestions>\` XML tag.

**Example Output:**
<json_suggestions>
[
  "Automate personalized outbound emails for my SaaS",
  "Speed up our QA process for my engineering team",
  "Auto-generate blog posts from product updates",
  "Summarize customer support tickets for weekly reports",
  "Suggest a full AI stack for a new fintech startup",
  "Find an AI solution to analyze our sales data"
]
</json_suggestions>`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!anthropicApiKey) {
    console.error('ANTHROPIC_API_KEY is not set.');
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not set in environment variables.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: systemPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error("Anthropic API error: " + response.status);
    }

    const data = await response.json();
    const content = data.content[0].text;

    const jsonMatch = content.match(/<json_suggestions>([\s\S]*?)<\/json_suggestions>/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Could not find <json_suggestions> in the response.");
    }

    const suggestions = JSON.parse(jsonMatch[1]);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 
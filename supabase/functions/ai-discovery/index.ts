
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiscoveryRequest {
  query: string;
  userPreferences?: any;
  context?: 'stacks' | 'tools' | 'recommendations';
}

interface ParsedQuery {
  intent: string;
  filters: {
    types: string[];
    sources: string[];
    complexity: string[];
    industries: string[];
  };
  keywords: string[];
  suggestions: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userPreferences, context = 'stacks' }: DiscoveryRequest = await req.json();

    console.log('Processing discovery query:', { query, context, userPreferences });

    const systemPrompt = `You are an AI assistant specialized in analyzing user queries for AI tool discovery. Your job is to parse natural language queries and extract:

1. User intent and goals
2. Relevant filters for AI tools/stacks
3. Keywords for search
4. Suggestions for better results

Available filter categories:
- Types: prompt, tool, model, agent
- Sources: openai, anthropic, google, microsoft, huggingface, custom, community
- Complexity: beginner, intermediate, advanced, expert
- Industries: healthcare, finance, education, ecommerce, marketing, technology, legal, manufacturing

Response format (JSON only):
{
  "intent": "Brief description of what the user wants to achieve",
  "filters": {
    "types": ["relevant types"],
    "sources": ["relevant sources"],
    "complexity": ["appropriate complexity level"],
    "industries": ["relevant industries"]
  },
  "keywords": ["important search terms"],
  "suggestions": ["3-4 suggested refinements or related queries"]
}`;

    const userPrompt = `Query: "${query}"
${userPreferences ? `User preferences: ${JSON.stringify(userPreferences)}` : ''}
Context: Looking for ${context}

Parse this query and provide structured output.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    console.log('Claude response:', content);

    // Parse JSON response from Claude
    let parsedQuery: ParsedQuery;
    try {
      parsedQuery = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse Claude response as JSON:', e);
      // Fallback parsing
      parsedQuery = {
        intent: "Find AI tools and stacks",
        filters: { types: [], sources: [], complexity: [], industries: [] },
        keywords: query.split(' ').filter(word => word.length > 2),
        suggestions: ["Try being more specific about your use case", "Mention your industry or complexity preference"]
      };
    }

    // Apply user preferences if available
    if (userPreferences) {
      if (userPreferences.industry && !parsedQuery.filters.industries.includes(userPreferences.industry.toLowerCase())) {
        parsedQuery.filters.industries.push(userPreferences.industry.toLowerCase());
      }
      if (userPreferences.ux_complexity && !parsedQuery.filters.complexity.includes(userPreferences.ux_complexity.toLowerCase())) {
        parsedQuery.filters.complexity.push(userPreferences.ux_complexity.toLowerCase());
      }
    }

    return new Response(JSON.stringify(parsedQuery), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-discovery function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: {
        intent: "Find AI tools and stacks",
        filters: { types: [], sources: [], complexity: [], industries: [] },
        keywords: [],
        suggestions: ["Try a simpler query", "Be more specific about your needs"]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

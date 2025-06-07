
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiscoveryRequest {
  query: string;
  userPreferences?: any;
  context?: 'stacks' | 'tools' | 'recommendations';
  generateStacks?: boolean;
}

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
  url?: string;
  pricing?: string;
}

interface GeneratedStack {
  title: string;
  description: string;
  components: StackComponent[];
  useCase: string;
  industry: string;
  complexity: string;
  estimatedSetupTime: string;
  benefits: string[];
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
  generatedStacks?: GeneratedStack[];
}

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(query: string, context: string, userPreferences?: any): string {
  return `${query}-${context}-${JSON.stringify(userPreferences || {})}`;
}

function getFromCache(key: string): ParsedQuery | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Cache hit for key:', key);
    return cached.data;
  }
  if (cached) {
    cache.delete(key);
  }
  return null;
}

function setCache(key: string, data: ParsedQuery): void {
  cache.set(key, { data, timestamp: Date.now() });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userPreferences, context = 'stacks', generateStacks = true }: DiscoveryRequest = await req.json();

    console.log('Processing discovery query:', { query, context, userPreferences, generateStacks });

    // Check cache first
    const cacheKey = getCacheKey(query, context, userPreferences);
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      return new Response(JSON.stringify(cachedResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Optimized system prompt for faster processing
    const systemPrompt = `You are an AI assistant specialized in analyzing user queries for AI tool discovery and generating AI stacks. Be concise and focused.

Your tasks:
1. Parse queries and extract structured information
2. Generate ${context === 'tools' ? '6-8' : '2-3'} AI ${context === 'tools' ? 'tools' : 'stacks'} that solve user needs
3. Prioritize popular, well-known tools and platforms

Available categories:
- Types: prompt, tool, model, agent
- Sources: openai, anthropic, google, microsoft, huggingface, custom, community, zapier, make, notion, airtable
- Complexity: beginner, intermediate, advanced
- Industries: healthcare, finance, education, ecommerce, marketing, technology, legal

Response format (JSON only):
{
  "intent": "Brief description",
  "filters": {
    "types": ["relevant types"],
    "sources": ["relevant sources"], 
    "complexity": ["appropriate level"],
    "industries": ["relevant industries"]
  },
  "keywords": ["search terms"],
  "suggestions": ["2-3 refinements"],
  "generatedStacks": [
    {
      "title": "Stack name",
      "description": "What this accomplishes",
      "components": [
        {
          "type": "model|tool|agent|prompt",
          "name": "Component name",
          "description": "What it does",
          "reason": "Why essential",
          "source": "provider",
          "featured": true/false,
          "url": "https://example.com",
          "pricing": "free|paid|freemium"
        }
      ],
      "useCase": "Specific use case",
      "industry": "Primary industry",
      "complexity": "beginner|intermediate|advanced",
      "estimatedSetupTime": "Time estimate",
      "benefits": ["benefit1", "benefit2"]
    }
  ]
}`;

    const userPrompt = `Query: "${query}"
${userPreferences ? `User preferences: Industry=${userPreferences.industry || 'technology'}, Complexity=${userPreferences.ux_complexity || 'intermediate'}` : ''}
Context: ${context}

Generate ${context === 'tools' ? 'individual tools' : 'complete stacks'} for this need. Focus on practical, popular solutions.`;

    // Use Claude 3.5 Haiku for faster, cheaper responses
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: context === 'tools' ? 3000 : 4000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ],
        temperature: 0.3, // Lower temperature for more consistent results
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    console.log('Claude response received');

    // Parse JSON response from Claude
    let parsedQuery: ParsedQuery;
    try {
      parsedQuery = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse Claude response as JSON:', e);
      // Enhanced fallback with better categorization
      parsedQuery = {
        intent: `Find AI ${context} related to: ${query}`,
        filters: { 
          types: context === 'tools' ? ['tool', 'model'] : ['tool', 'model', 'prompt'], 
          sources: ['openai', 'google', 'anthropic'], 
          complexity: [userPreferences?.ux_complexity || 'intermediate'], 
          industries: [userPreferences?.industry || 'technology'] 
        },
        keywords: query.split(' ').filter(word => word.length > 2),
        suggestions: ["Try being more specific about your use case", "Mention your industry preference"],
        generatedStacks: []
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

    // Cache the result
    setCache(cacheKey, parsedQuery);

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
        suggestions: ["Try a simpler query", "Be more specific about your needs"],
        generatedStacks: []
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userPreferences, context = 'stacks', generateStacks = true }: DiscoveryRequest = await req.json();

    console.log('Processing discovery query:', { query, context, userPreferences, generateStacks });

    const systemPrompt = `You are an AI assistant specialized in analyzing user queries for AI tool discovery and generating comprehensive AI stacks. 

Your tasks:
1. Parse natural language queries and extract structured information
2. Generate detailed AI stacks with 6-10 components that solve the user's specific needs
3. Use real-world knowledge of AI tools, platforms, and services

Available filter categories:
- Types: prompt, tool, model, agent
- Sources: openai, anthropic, google, microsoft, huggingface, custom, community, zapier, make, notion, airtable, slack, discord, telegram
- Complexity: beginner, intermediate, advanced, expert
- Industries: healthcare, finance, education, ecommerce, marketing, technology, legal, manufacturing, retail, consulting

For stack generation, create comprehensive solutions with:
- Core AI models (GPT-4, Claude, Gemini, etc.)
- Integration tools (Zapier, Make.com, APIs)
- Data storage solutions (Airtable, Notion, databases)
- Communication tools (Slack, Discord, email)
- Specialized AI tools for the specific use case
- Monitoring and analytics tools

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
  "suggestions": ["3-4 suggested refinements or related queries"],
  "generatedStacks": [
    {
      "title": "Stack name",
      "description": "What this stack accomplishes",
      "components": [
        {
          "type": "model|tool|agent|prompt",
          "name": "Component name",
          "description": "What this component does",
          "reason": "Why this is essential for solving the user's problem",
          "source": "openai|anthropic|etc",
          "featured": true/false,
          "url": "https://example.com (if applicable)",
          "pricing": "free|paid|freemium"
        }
      ],
      "useCase": "Specific use case this stack addresses",
      "industry": "Primary industry",
      "complexity": "beginner|intermediate|advanced|expert",
      "estimatedSetupTime": "Time estimate",
      "benefits": ["benefit1", "benefit2", "benefit3"]
    }
  ]
}`;

    const userPrompt = `Query: "${query}"
${userPreferences ? `User preferences: ${JSON.stringify(userPreferences)}` : ''}
Context: Looking for ${context}

Generate 2-3 comprehensive AI stacks with 6-10 components each that directly solve the user's specific needs. Include real AI tools, models, and platforms. Focus on practical, actionable solutions.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4000,
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
        suggestions: ["Try being more specific about your use case", "Mention your industry or complexity preference"],
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

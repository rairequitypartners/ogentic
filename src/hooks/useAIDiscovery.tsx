
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface UseAIDiscoveryResult {
  parseQuery: (query: string, userPreferences?: any, context?: string) => Promise<ParsedQuery>;
  loading: boolean;
  error: string | null;
}

export const useAIDiscovery = (): UseAIDiscoveryResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseQuery = async (
    query: string, 
    userPreferences?: any, 
    context: string = 'stacks'
  ): Promise<ParsedQuery> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-discovery', {
        body: { 
          query, 
          userPreferences, 
          context,
          generateStacks: true
        }
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(functionError.message || 'Failed to process query');
      }

      if (data.error) {
        console.warn('AI Discovery error, using fallback:', data.error);
        return data.fallback;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse query';
      setError(errorMessage);
      console.error('Error in parseQuery:', err);
      
      // Return a basic fallback
      return {
        intent: `Find AI tools related to: ${query}`,
        filters: { types: [], sources: [], complexity: [], industries: [] },
        keywords: query.split(' ').filter(word => word.length > 2),
        suggestions: ['Try being more specific', 'Mention your industry or use case'],
        generatedStacks: []
      };
    } finally {
      setLoading(false);
    }
  };

  return { parseQuery, loading, error };
};

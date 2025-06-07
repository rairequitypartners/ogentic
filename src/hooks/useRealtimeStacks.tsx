
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
}

interface RealtimeStack extends Tables<'ai_stacks'> {
  components: StackComponent[];
}

export const useRealtimeStacks = (query?: string) => {
  const [stacks, setStacks] = useState<RealtimeStack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of stacks
    const fetchStacks = async () => {
      setLoading(true);
      let queryBuilder = supabase
        .from('ai_stacks')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,query.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error fetching stacks:', error);
      } else {
        setStacks(data as RealtimeStack[] || []);
      }
      setLoading(false);
    };

    fetchStacks();

    // Set up real-time subscription
    const channel = supabase
      .channel('ai_stacks_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_stacks',
          filter: 'is_public=eq.true'
        },
        (payload) => {
          console.log('New stack added:', payload);
          const newStack = payload.new as RealtimeStack;
          if (!query || 
              newStack.title.toLowerCase().includes(query.toLowerCase()) ||
              newStack.description.toLowerCase().includes(query.toLowerCase()) ||
              newStack.query.toLowerCase().includes(query.toLowerCase())) {
            setStacks(prev => [newStack, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_stacks',
          filter: 'is_public=eq.true'
        },
        (payload) => {
          console.log('Stack updated:', payload);
          const updatedStack = payload.new as RealtimeStack;
          setStacks(prev => prev.map(stack => 
            stack.id === updatedStack.id ? updatedStack : stack
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'ai_stacks'
        },
        (payload) => {
          console.log('Stack deleted:', payload);
          const deletedStack = payload.old as RealtimeStack;
          setStacks(prev => prev.filter(stack => stack.id !== deletedStack.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return { stacks, loading };
};

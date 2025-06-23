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

interface RealtimeStack {
  id: string;
  title: string;
  description: string;
  query: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
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
        const transformedStacks = data?.map(stack => ({
          ...stack,
          components: Array.isArray(stack.components) ? stack.components as unknown as StackComponent[] : []
        })) as RealtimeStack[] || [];
        setStacks(transformedStacks);
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
          const newStackData = payload.new as Tables<'ai_stacks'>;
          const newStack: RealtimeStack = {
            ...newStackData,
            components: Array.isArray(newStackData.components) ? newStackData.components as unknown as StackComponent[] : []
          };
          
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
          const updatedStackData = payload.new as Tables<'ai_stacks'>;
          const updatedStack: RealtimeStack = {
            ...updatedStackData,
            components: Array.isArray(updatedStackData.components) ? updatedStackData.components as unknown as StackComponent[] : []
          };
          
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
          const deletedStackData = payload.old as Tables<'ai_stacks'>;
          setStacks(prev => prev.filter(stack => stack.id !== deletedStackData.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return { stacks, loading };
};

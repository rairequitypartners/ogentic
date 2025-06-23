import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Stack } from './useAutonomousAgent';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export interface SavedStack {
  id: string;
  user_id: string;
  created_at: string;
  codename: string;
  title: string;
  description: string;
  stack_data: Stack;
  deployment_status?: string;
  is_public?: boolean;
  deployed_at?: string;
  deployment_url?: string;
}

interface MyStacksState {
  stacks: SavedStack[];
  loading: boolean;
  error: string | null;
  fetchStacks: (userId: string) => Promise<void>;
  addStack: (stack: Stack, userId: string) => Promise<SavedStack | null>;
}

const useMyStacksStore = create<MyStacksState>((set) => ({
  stacks: [],
  loading: false,
  error: null,
  fetchStacks: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('saved_stacks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ stacks: data as unknown as SavedStack[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  addStack: async (stack, userId) => {
    try {
      const { data, error } = await supabase
        .from('saved_stacks')
        .insert({
          user_id: userId,
          codename: stack.codename,
          title: stack.title,
          description: stack.description,
          stack_data: stack as any,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newStack = data as unknown as SavedStack;
      set((state) => ({ stacks: [newStack, ...state.stacks] }));
      return newStack;
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error adding stack:", error);
      return null;
    }
  },
}));

export const useMyStacks = () => {
    const store = useMyStacksStore();
    const { user } = useAuth();

    useEffect(() => {
        if(user) {
            store.fetchStacks(user.id);
        }
    }, [user]);

    return store;
}

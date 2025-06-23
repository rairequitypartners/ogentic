import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { AgentResponse, Stack } from './useAutonomousAgent';
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { User } from '@supabase/supabase-js';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: AgentResponse[];
}

interface ConversationState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  fetchConversations: (userId: string) => Promise<void>;
  createConversation: (title: string, firstMessage: Omit<AgentResponse, 'id' | 'timestamp'>, userId: string) => Promise<Conversation | null>;
  deleteConversation: (conversationId: string) => Promise<void>;
  addMessageToConversation: (conversationId: string, message: Omit<AgentResponse, 'id' | 'timestamp'>, userId: string) => Promise<void>;
  getConversation: (conversationId: string) => Promise<Conversation | null>;
}

const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  loading: false,
  error: null,

  fetchConversations: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          messages (
            id,
            role,
            content,
            stack,
            raw,
            timestamp
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const conversations: Conversation[] = data.map((conv: any) => ({
        ...conv,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          stacks: msg.stack ? JSON.parse(msg.stack) : undefined,
          timestamp: new Date(msg.timestamp),
        })).sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime()),
      }));

      set({ conversations, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createConversation: async (title, firstMessage, userId) => {
    if (!userId) return null;

    try {
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .insert({ title, user_id: userId })
        .select()
        .single();
      
      if (convError) throw convError;

      await get().addMessageToConversation(convData.id, firstMessage, userId);
      
      const newConversation: Conversation = {
        ...convData,
        messages: [{
          ...firstMessage,
          id: '', 
          timestamp: new Date()
        }]
      };

      set(state => ({
        conversations: [newConversation, ...state.conversations],
      }));
      return newConversation;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      set(state => ({
        conversations: state.conversations.filter(c => c.id !== conversationId),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addMessageToConversation: async (conversationId, message, userId) => {
    if (!userId) return;
    
    try {
      const { data: newMessageData, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          role: message.role,
          content: message.content,
          stack: message.stacks ? JSON.stringify(message.stacks) : null,
          raw: message.raw,
        })
        .select()
        .single();

      if (error) throw error;

      const { error: convUpdateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      if (convUpdateError) throw convUpdateError;

      // After adding a message, refetch all conversations to ensure data consistency
      get().fetchConversations(userId);

    } catch (error: any) {
      console.error("Error in addMessageToConversation:", error);
      set({ error: error.message });
    }
  },

  getConversation: async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          messages (
            id,
            role,
            content,
            stack,
            raw,
            timestamp
          )
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      
      const conversation: Conversation = {
        ...data,
        messages: data.messages.map((msg: any) => ({
          ...msg,
          stacks: msg.stack ? JSON.parse(msg.stack) : undefined,
          timestamp: new Date(msg.timestamp),
        })).sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime()),
      };

      return conversation;
    } catch (error: any) {
      console.error("Error fetching conversation:", error.message);
      return null;
    }
  },
}));

export const useConversations = () => {
  const store = useConversationStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      store.fetchConversations(user.id);
    }
  }, [user?.id]);

  return store;
}; 
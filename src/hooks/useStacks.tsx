
import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
}

interface StackData {
  title: string;
  description: string;
  components: StackComponent[];
}

export const useStacks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const saveStack = async (query: string, stackData: StackData): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save stacks.",
        variant: "destructive"
      });
      return null;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('ai_stacks')
        .insert({
          user_id: user.id,
          title: stackData.title,
          description: stackData.description,
          query: query,
          components: stackData.components,
          is_public: false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Stack saved!",
        description: "Your AI stack has been saved to your collection."
      });

      return data.id;
    } catch (error) {
      console.error('Error saving stack:', error);
      toast({
        title: "Error saving stack",
        description: "Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const saveDeployment = async (stackId: string, platforms: string[], results: any[]) => {
    if (!user) return;

    try {
      const deployments = results.map(result => ({
        user_id: user.id,
        stack_id: stackId,
        platform: result.platform,
        status: result.status,
        message: result.message
      }));

      const { error } = await supabase
        .from('deployments')
        .insert(deployments);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving deployments:', error);
    }
  };

  return {
    saveStack,
    saveDeployment,
    saving
  };
};

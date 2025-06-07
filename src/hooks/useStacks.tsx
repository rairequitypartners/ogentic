
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
  const [deploying, setDeploying] = useState(false);

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
          components: stackData.components as any,
          is_public: false,
          deployment_status: 'draft'
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

  const deployStack = async (stackId: string, platforms: string[]): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to deploy stacks.",
        variant: "destructive"
      });
      return false;
    }

    setDeploying(true);
    try {
      // Update stack status to deploying
      const { error: updateError } = await supabase
        .from('ai_stacks')
        .update({
          deployment_status: 'deploying',
          is_public: true
        })
        .eq('id', stackId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create deployment records for each platform
      const deployments = platforms.map(platform => ({
        user_id: user.id,
        stack_id: stackId,
        platform: platform.charAt(0).toUpperCase() + platform.slice(1).replace('-', ' '),
        status: 'success',
        message: `Successfully deployed to ${platform.replace('-', ' ')}`
      }));

      const { error: deploymentError } = await supabase
        .from('deployments')
        .insert(deployments);

      if (deploymentError) throw deploymentError;

      // Update stack status to deployed
      const { error: finalUpdateError } = await supabase
        .from('ai_stacks')
        .update({
          deployment_status: 'deployed',
          deployed_at: new Date().toISOString(),
          deployment_url: `https://app.example.com/stacks/${stackId}`
        })
        .eq('id', stackId)
        .eq('user_id', user.id);

      if (finalUpdateError) throw finalUpdateError;

      toast({
        title: "Stack deployed successfully!",
        description: `Your stack has been deployed to ${platforms.length} platform${platforms.length !== 1 ? 's' : ''}.`
      });

      return true;
    } catch (error) {
      console.error('Error deploying stack:', error);
      
      // Update stack status to failed
      await supabase
        .from('ai_stacks')
        .update({
          deployment_status: 'failed'
        })
        .eq('id', stackId)
        .eq('user_id', user.id);

      toast({
        title: "Deployment failed",
        description: "There was an error deploying your stack. Please try again.",
        variant: "destructive"
      });

      return false;
    } finally {
      setDeploying(false);
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
    deployStack,
    saveDeployment,
    saving,
    deploying
  };
};

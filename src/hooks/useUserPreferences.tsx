import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type UserPreferences = Tables<'user_preferences'>;

interface OnboardingData {
  industry: string;
  outputTone: string;
  preferredModels: string[];
  biasPreference: string;
  datasetPreference: string;
  uxComplexity: string;
  useCases: string[];
  experienceLevel: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      // Reset state when user is not authenticated
      setPreferences(null);
      setLoading(false);
      setError(null);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create default preferences if none exist
        const defaultPreferences = {
          user_id: user.id,
          industry: 'technology',
          output_tone: 'professional',
          preferred_models: ['gpt-4', 'claude-3'],
          bias_preference: 'balanced',
          dataset_preference: 'curated',
          ux_complexity: 'intermediate',
          use_cases: ['general'],
          experience_level: 'intermediate',
          onboarding_completed: false
        };

        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert(defaultPreferences)
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences(newPrefs);
      } else {
        setPreferences(data);
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
      
      // Set default preferences in memory if we can't load from database
      setPreferences({
        user_id: user.id,
        industry: 'technology',
        output_tone: 'professional',
        preferred_models: ['gpt-4', 'claude-3'],
        bias_preference: 'balanced',
        dataset_preference: 'curated',
        ux_complexity: 'intermediate',
        use_cases: ['general'],
        experience_level: 'intermediate',
        onboarding_completed: false
      } as UserPreferences);
    } finally {
      setLoading(false);
    }
  };

  const saveOnboardingData = async (data: OnboardingData): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save preferences.",
        variant: "destructive"
      });
      return false;
    }

    setSaving(true);
    setError(null);

    try {
      // First, check if preferences already exist
      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingPrefs) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({
            industry: data.industry,
            output_tone: data.outputTone,
            preferred_models: data.preferredModels,
            bias_preference: data.biasPreference,
            dataset_preference: data.datasetPreference,
            ux_complexity: data.uxComplexity,
            use_cases: data.useCases,
            experience_level: data.experienceLevel,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            industry: data.industry,
            output_tone: data.outputTone,
            preferred_models: data.preferredModels,
            bias_preference: data.biasPreference,
            dataset_preference: data.datasetPreference,
            ux_complexity: data.uxComplexity,
            use_cases: data.useCases,
            experience_level: data.experienceLevel,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Update profiles table
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      await fetchPreferences();

      toast({
        title: "Preferences saved!",
        description: "Your AI agent preferences have been saved successfully."
      });

      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError(error instanceof Error ? error.message : 'Failed to save preferences');
      
      toast({
        title: "Error saving preferences",
        description: "Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const isOnboardingCompleted = () => {
    return preferences?.onboarding_completed || false;
  };

  return {
    preferences,
    loading,
    saving,
    error,
    saveOnboardingData,
    isOnboardingCompleted,
    fetchPreferences
  };
};

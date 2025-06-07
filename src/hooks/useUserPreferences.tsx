
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

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
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
    saveOnboardingData,
    isOnboardingCompleted,
    fetchPreferences
  };
};

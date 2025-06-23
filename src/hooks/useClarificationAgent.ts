import { supabase } from '@/integrations/supabase/client';

export async function getClarificationQuestions(response: string): Promise<string[]> {
  const { data, error } = await supabase.functions.invoke('clarificationagent', {
    body: { response }
  });
  if (error) throw error;
  try {
    // If the API returns a Claude-style message:
    const text = data?.content?.[0]?.text || '';
    // Try to parse as JSON array
    const questions = JSON.parse(text);
    if (Array.isArray(questions)) return questions;
    return [];
  } catch {
    return [];
  }
} 
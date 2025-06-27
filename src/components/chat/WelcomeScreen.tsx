import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Zap, 
  Mail, 
  ShieldCheck,
  PenSquare,
  MessageSquare,
  Rocket,
  BarChart,
  ArrowUp
} from 'lucide-react';
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface WelcomeScreenProps {
  onQuerySubmit: (query: string) => void;
}

const iconComponents: { [key: string]: React.ElementType } = {
  Mail,
  ShieldCheck,
  PenSquare,
  MessageSquare,
  Rocket,
  BarChart,
};

const defaultQueries = [
    {
      icon: "Mail",
      text: "Automate personalized outbound emails for my SaaS",
    },
    {
      icon: "ShieldCheck",
      text: "Speed up our QA process for my engineering team", 
    },
    {
      icon: "PenSquare",
      text: "Auto-generate blog posts from product updates",
    },
    {
      icon: "MessageSquare",
      text: "Summarize customer support tickets for weekly reports",
    },
    {
      icon: "Rocket",
      text: "Suggest a full AI stack for a new fintech startup",
    },
    {
      icon: "BarChart",
      text: "Find an AI solution to analyze our sales data",
    },
  ];

export const WelcomeScreen = ({ onQuerySubmit }: WelcomeScreenProps) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestedQueries, setSuggestedQueries] = useState(defaultQueries);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const { data, error } = await supabase.functions.invoke('suggestion-generator');
        if (error) throw error;
        
        const queriesWithIcons = data.suggestions.map((text: string, index: number) => ({
            text,
            icon: Object.keys(iconComponents)[index % Object.keys(iconComponents).length]
        }));
        setSuggestedQueries(queriesWithIcons);

      } catch (error) {
        console.error("Error fetching suggestions:", error);
        if (error instanceof Error && 'context' in error) {
            const context = (error as any).context;
            if (context.json) {
                context.json().then((json: any) => {
                    console.error("Function error details:", json.error);
                });
            }
        }
        // Keep default suggestions on error
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onQuerySubmit(inputValue.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">ZingGPT</h1>
            <p className="text-muted-foreground mt-2">Your AI Solutions Agent</p>
        </div>
        
        <form onSubmit={handleSubmit} className="relative mb-8">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your goal, and I'll build a solution..."
            className="w-full h-16 pl-6 pr-16 text-lg rounded-full bg-background border-2 border-transparent focus:border-primary transition-all duration-300"
            autoFocus
          />
          <Button type="submit" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full" disabled={!inputValue.trim()}>
             <ArrowRight className="h-5 w-5" />
          </Button>
        </form>

        <div className="space-y-3 text-left">
          {loadingSuggestions ? (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center p-3">
                    <Skeleton className="h-5 w-5 mr-4 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </>
          ) : (
            suggestedQueries.map((query, i) => {
            const Icon = iconComponents[query.icon];
            return (
              <button
                key={i}
                  onClick={() => {
                    console.log(`Suggestion clicked: "${query.text}"`);
                    onQuerySubmit(query.text);
                  }}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-4 text-muted-foreground" />
                  <span className="text-foreground/70 group-hover:text-foreground transition-colors">{query.text}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
            })
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-8">
        {/* Additional content */}
      </div>
    </div>
  );
};

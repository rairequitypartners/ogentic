
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SuggestedQueries } from "./SuggestedQueries";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const WelcomeScreen = ({ input, onInputChange, onSubmit, isLoading }: WelcomeScreenProps) => {
  const suggestedQueries = [
    "Automate personalized outbound emails for my SaaS",
    "Speed up QA process for my engineering team", 
    "Summarize customer support tickets weekly",
    "Auto-generate blog posts from product updates"
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 border-b border-border/20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-medium">Ogentic</span>
          </div>
        </div>
      </div>

      {/* Main Content - Google-style */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-light text-foreground mb-4">Ogentic</h1>
            <p className="text-xl text-muted-foreground font-light">
              AI Stack Discovery
            </p>
          </motion.div>

          {/* Search Form - Google-style */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-background border border-border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"></div>
              <Textarea
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Describe your automation needs..."
                className="relative w-full min-h-[56px] px-6 py-4 text-base border-0 rounded-full resize-none focus:ring-0 focus:outline-none bg-transparent shadow-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full p-0"
                variant="ghost"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.form>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center space-x-4 mb-8"
          >
            <Button
              variant="outline"
              onClick={() => onInputChange("Find me the best AI tools for customer support")}
              className="rounded-full px-6 py-2 border-border hover:border-primary transition-colors"
            >
              AI Stack Search
            </Button>
            <Button
              variant="outline"
              onClick={() => onInputChange("I'm feeling lucky - surprise me with an AI stack")}
              className="rounded-full px-6 py-2 border-border hover:border-primary transition-colors"
            >
              I'm Feeling Lucky
            </Button>
          </motion.div>

          {/* Suggested Queries - Rotating Carousel */}
          <SuggestedQueries 
            queries={suggestedQueries}
            onSelectQuery={onInputChange}
          />
        </div>
      </div>
    </div>
  );
};

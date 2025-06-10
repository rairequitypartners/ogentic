
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Tool {
  id: string;
  name: string;
  description: string;
  useCase: string;
  source: string;
  type: string;
  url?: string;
  featured?: boolean;
  reason?: string;
  setupTime?: string;
}

interface SavedStack {
  id: string;
  tool: Tool;
  savedAt: Date;
  platform?: string;
}

export const useMyStacks = () => {
  const [savedStacks, setSavedStacks] = useState<SavedStack[]>([]);
  const { toast } = useToast();

  // Load saved stacks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ogentic-my-stacks');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedStacks(parsed.map((stack: any) => ({
          ...stack,
          savedAt: new Date(stack.savedAt)
        })));
      }
    } catch (error) {
      console.error('Error loading saved stacks:', error);
    }
  }, []);

  // Save to localStorage whenever savedStacks changes
  useEffect(() => {
    try {
      localStorage.setItem('ogentic-my-stacks', JSON.stringify(savedStacks));
    } catch (error) {
      console.error('Error saving stacks:', error);
    }
  }, [savedStacks]);

  const saveStack = (tool: Tool) => {
    const existingIndex = savedStacks.findIndex(stack => stack.tool.id === tool.id);
    
    if (existingIndex >= 0) {
      toast({
        title: "Already saved",
        description: `${tool.name} is already in your stacks.`,
      });
      return;
    }

    const newStack: SavedStack = {
      id: `saved-${Date.now()}`,
      tool,
      savedAt: new Date()
    };

    setSavedStacks(prev => [newStack, ...prev]);
    
    toast({
      title: "Stack saved!",
      description: `${tool.name} has been added to your stacks.`,
    });
  };

  const removeStack = (stackId: string) => {
    setSavedStacks(prev => prev.filter(stack => stack.id !== stackId));
    
    toast({
      title: "Stack removed",
      description: "Stack has been removed from your collection.",
    });
  };

  const deployStack = (tool: Tool, platform: string) => {
    // Update existing saved stack with platform info
    setSavedStacks(prev => prev.map(stack => 
      stack.tool.id === tool.id 
        ? { ...stack, platform }
        : stack
    ));

    // Simulate deployment success
    toast({
      title: "Successfully deployed!",
      description: `${tool.name} has been deployed to ${platform}.`,
    });
  };

  return {
    savedStacks,
    saveStack,
    removeStack,
    deployStack
  };
};

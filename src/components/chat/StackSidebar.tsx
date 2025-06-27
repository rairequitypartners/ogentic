import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, X, Save, Check, Eye, Rocket, Loader2
} from 'lucide-react';
import type { Stack } from '@/hooks/useAutonomousAgent';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMyStacks } from '@/hooks/useMyStacks';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import { ComponentListItem } from './ComponentListItem';

interface StackSidebarProps {
  stacks: Stack[] | null;
  isLoading: boolean;
  onClose: () => void;
  onSelectStack: (stack: Stack) => void;
}

export const StackSidebar = ({ stacks, isLoading, onClose, onSelectStack }: StackSidebarProps) => {
  const [savedStates, setSavedStates] = useState<{[key: string]: boolean}>({});
  const { addStack } = useMyStacks();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSaveStack = async (e: React.MouseEvent, stack: Stack) => {
    e.stopPropagation(); // Prevent accordion from toggling
    if (!user) {
      toast({ title: "Please log in", description: "You must be logged in to save a stack.", variant: "destructive" });
      return;
    }
    const newSavedStack = await addStack(stack, user.id);
    if (newSavedStack) {
      setSavedStates(prev => ({...prev, [stack.codename]: true}));
      toast({ title: "Stack Saved!", description: `"${stack.title}" has been added to My Stacks.` });
    } else {
      toast({ title: "Error", description: "Could not save the stack. Please try again.", variant: "destructive" });
    }
  };
  
  const handleDeployStack = (e: React.MouseEvent, stack: Stack) => {
    e.stopPropagation();
    toast({ title: "Coming Soon!", description: `Deploy functionality for "${stack.title}" is not yet available.` });
  };
  
  const handleViewDetails = (e: React.MouseEvent, stack: Stack) => {
    e.stopPropagation();
    onSelectStack(stack);
  };

  if (isLoading && (!stacks || stacks.length === 0)) return <LoadingState onClose={onClose} />;
  if (!stacks || stacks.length === 0) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-background border-l h-full flex flex-col shadow-2xl"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <CardTitle>AI Recommended Stacks</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <Accordion type="single" collapsible className="w-full">
          {stacks.map((stack, index) => {
            const isStrictlyAI = stack.ai_stack.every(
              comp => ['model', 'agent', 'prompt'].includes(comp.type)
            );
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex justify-between items-center w-full">
                    <div className="text-left">
                      <p className="font-semibold flex items-center">
                        {stack.title}
                        {isStrictlyAI && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-white">AI Components Only</span>
                        )}
                      </p>
                      <p className="text-xs italic text-muted-foreground mb-1">{stack.reason}</p>
                      <p className="text-sm text-muted-foreground font-mono">{stack.codename}</p>
                    </div>
                    <div className="flex items-center space-x-1 pr-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleViewDetails(e, stack)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleSaveStack(e, stack)} disabled={savedStates[stack.codename]}>
                        {savedStates[stack.codename] ? <Check className="w-4 h-4 text-green-500" /> : <Save className="w-4 h-4" />}
                      </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleDeployStack(e, stack)}>
                        <Rocket className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground mb-4">{stack.description}</p>
                  <div className="space-y-1">
                    {stack.ai_stack.map((component, compIndex) => (
                      <ComponentListItem key={compIndex} component={component} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </motion.div>
  );
};

const LoadingState = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-background border-l h-full flex flex-col shadow-2xl p-4">
    <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <CardTitle>AI Recommended Stacks</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
        <p className="mt-4 text-muted-foreground">Brewing up some recommendations...</p>
      </div>
    </div>
  </div>
);
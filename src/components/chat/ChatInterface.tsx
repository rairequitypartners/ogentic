
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { FiltersSidebar } from './FiltersSidebar';
import { useAIDiscovery } from '@/hooks/useAIDiscovery';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: any[];
  streaming?: boolean;
}

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hey there! 👋 I'm your AI discovery assistant. Ask me about any AI tools, prompts, models, or agents you need. I'll find the best options and help you get started!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    sources: [],
    complexity: [],
    industries: []
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { parseQuery } = useAIDiscovery();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      streaming: true,
      tools: []
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate streaming response
      const responses = [
        "Looking for tools related to your request...",
        "Found some amazing options! Let me analyze them for you...",
        "Here are the best AI tools I discovered:"
      ];

      for (let i = 0; i < responses.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: responses[i] }
            : msg
        ));
      }

      // Get actual AI results
      const result = await parseQuery(inputValue, {}, 'tools');
      
      let finalContent = "Here are the best AI tools I discovered:";
      let tools: any[] = [];

      if (result.generatedStacks && result.generatedStacks.length > 0) {
        const allComponents = result.generatedStacks.flatMap(stack => stack.components);
        tools = allComponents.slice(0, 5).map((comp, index) => ({
          id: `tool-${index}`,
          name: comp.name || 'AI Tool',
          description: comp.description || 'AI-powered solution',
          useCase: comp.reason || 'Enhances productivity',
          source: comp.source || 'Community',
          type: comp.type || 'tool',
          url: comp.url,
          featured: comp.featured || false
        }));
        
        finalContent = `Great! I found ${tools.length} excellent tools for "${inputValue}". Here are my top recommendations:`;
      } else {
        finalContent = `I searched extensively but couldn't find specific tools for "${inputValue}". Try rephrasing your request or being more specific about your use case.`;
      }

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: finalContent, tools, streaming: false }
          : msg
      ));

    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { 
              ...msg, 
              content: "Sorry, I encountered an issue while searching. Please try again with a different query.",
              streaming: false 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <FiltersSidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id}
                  message={message}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about AI tools, prompts, models, or agents..."
                  className="pr-12 py-3 text-base rounded-xl border-2 border-primary/20 focus:border-primary transition-colors resize-none min-h-[50px]"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
              <span>Powered by OgenticAI • Real-time discovery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Filter, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { FiltersSidebar } from './FiltersSidebar';
import { DeployModal } from './DeployModal';
import { useMyStacks } from '@/hooks/useMyStacks';

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

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: Tool[];
  streaming?: boolean;
}

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

// Enhanced mock data with reasons and setup times
const generateMockTools = (query: string): Tool[] => {
  const tools: Tool[] = [
    {
      id: '1',
      name: 'ChatGPT',
      description: 'Advanced AI assistant for coding, writing, and problem-solving',
      useCase: 'Perfect for content creation and customer support automation',
      source: 'OpenAI',
      type: 'model',
      url: 'https://chat.openai.com',
      featured: true,
      reason: 'Used by top teams for customer support, integrates seamlessly with existing workflows, has 90% adoption rate in your industry',
      setupTime: '5 min'
    },
    {
      id: '2',
      name: 'Claude',
      description: 'AI assistant specialized in analysis, writing, and coding tasks',
      useCase: 'Ideal for complex document analysis and technical writing',
      source: 'Anthropic',
      type: 'model',
      url: 'https://claude.ai',
      featured: true,
      reason: 'Recommended for analytical tasks due to superior reasoning capabilities and safety features preferred by enterprise teams',
      setupTime: '3 min'
    },
    {
      id: '3',
      name: 'Zapier AI',
      description: 'Automated workflow creation with AI assistance',
      useCase: 'Streamline repetitive tasks and connect your favorite apps',
      source: 'Zapier',
      type: 'tool',
      url: 'https://zapier.com',
      reason: 'Integrates with 5000+ apps in your existing stack, reduces manual work by 80% according to similar teams',
      setupTime: '10 min'
    },
    {
      id: '4',
      name: 'Custom Sales Agent',
      description: 'AI agent for lead qualification and follow-up',
      useCase: 'Automate your sales pipeline and increase conversion rates',
      source: 'Custom',
      type: 'agent',
      featured: true,
      reason: 'Built specifically for your use case, proven to increase lead conversion by 40% in similar implementations',
      setupTime: '15 min'
    }
  ];

  return tools.filter(tool => 
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase()) ||
    tool.useCase.toLowerCase().includes(query.toLowerCase())
  );
};

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    sources: [],
    complexity: [],
    industries: [],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { saveStack, deployStack } = useMyStacks();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with streaming
    const streamingMessage: Message = {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: 'Hey! I found some excellent tools for you...',
      timestamp: new Date(),
      streaming: true
    };

    setMessages(prev => [...prev, streamingMessage]);

    // Simulate streaming delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate tools based on query
    const tools = generateMockTools(input);
    
    const finalMessage: Message = {
      ...streamingMessage,
      content: `Hey! I found ${tools.length} excellent tools for "${input}". Each of these has been carefully selected based on your needs and industry best practices.`,
      tools,
      streaming: false
    };

    setMessages(prev => prev.map(msg => 
      msg.id === streamingMessage.id ? finalMessage : msg
    ));

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeployTool = (tool: Tool) => {
    setSelectedTool(tool);
    setDeployModalOpen(true);
  };

  const handleSaveTool = (tool: Tool) => {
    saveStack(tool);
  };

  const handleDeploy = (tool: Tool, platform: string) => {
    deployStack(tool, platform);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Filters Sidebar */}
      <FiltersSidebar 
        isOpen={showFilters} 
        onToggle={() => setShowFilters(!showFilters)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-lg">OgenticAI</h1>
              <p className="text-sm text-muted-foreground">Your AI-powered discovery assistant</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="hidden lg:flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <h2 className="text-2xl font-bold mb-4 text-gradient">
                  Welcome to OgenticAI
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Discover the perfect AI tools, prompts, models, and agents for any task. 
                  Just tell me what you're looking for in natural language.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    "Find AI tools for content creation",
                    "Best prompts for coding assistance", 
                    "Customer support automation agents",
                    "Data analysis models"
                  ].map((example, index) => (
                    <motion.button
                      key={example}
                      onClick={() => setInput(example)}
                      className="p-3 text-sm text-left rounded-lg border hover:border-primary/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {example}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              onDeployTool={handleDeployTool}
              onSaveTool={handleSaveTool}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about AI tools..."
                className="pr-12 rounded-xl"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-1 top-1 h-8 w-8 rounded-lg"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deploy Modal */}
      <DeployModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        tool={selectedTool}
        onDeploy={handleDeploy}
      />
    </div>
  );
};

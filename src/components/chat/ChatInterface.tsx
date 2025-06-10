
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { DeployModal } from "./DeployModal";
import { useSettings } from "@/contexts/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
  stacks?: any[];
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [selectedStack, setSelectedStack] = useState(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { clarifyingQuestionsEnabled } = useSettings();

  const hasMessages = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you build the perfect AI stack for your needs. Let me analyze your requirements and suggest some options...",
        role: 'assistant',
        timestamp: new Date(),
        stacks: [
          {
            id: 1,
            name: "Email Automation Stack",
            description: "Automate personalized outbound emails",
            tools: ["OpenAI GPT-4", "Zapier", "HubSpot"],
            category: "Marketing"
          }
        ]
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleDeploy = (stack: any) => {
    setSelectedStack(stack);
    setDeployModalOpen(true);
  };

  const suggestedQueries = [
    "Automate personalized outbound emails for my SaaS",
    "Speed up QA process for my engineering team",
    "Summarize customer support tickets weekly",
    "Auto-generate blog posts from product updates"
  ];

  if (!hasMessages) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4 bg-background">
        <div className="w-full max-w-2xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Sparkles className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-light text-foreground">Ogentic</h1>
            </div>
            <p className="text-lg text-muted-foreground font-light">
              AI Stack Discovery
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative group">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your automation needs..."
                className="w-full min-h-[56px] px-6 py-4 text-base border-2 border-border rounded-full resize-none focus:border-primary focus:ring-0 shadow-sm hover:shadow-md transition-all duration-200 bg-background"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full p-0 shadow-none"
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
              onClick={() => setInput("Find me the best AI tools for customer support")}
              className="rounded-full px-6 py-2 border-border hover:border-primary transition-colors"
            >
              AI Stack Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setInput("I'm feeling lucky - surprise me with an AI stack")}
              className="rounded-full px-6 py-2 border-border hover:border-primary transition-colors"
            >
              I'm Feeling Lucky
            </Button>
          </motion.div>

          {/* Suggested Queries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground text-center mb-4">
              Popular searches:
            </p>
            <div className="grid gap-2">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => setInput(query)}
                  className="text-sm text-primary hover:underline text-center py-1 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Chat view when messages exist
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with mini logo */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-light">Ogentic</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage 
                  message={message} 
                  onDeploy={handleDeploy}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-muted-foreground"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="text-sm">Ogentic is thinking...</span>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ogentic anything..."
              className="w-full min-h-[52px] px-4 py-3 pr-12 rounded-full border-border focus:border-primary resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full p-0"
              variant="ghost"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <DeployModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        stack={selectedStack}
      />
    </div>
  );
};

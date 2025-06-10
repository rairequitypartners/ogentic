
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { DeployFlow } from "@/components/deploy/DeployFlow";
import { useSettings } from "@/contexts/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
  tools?: any[];
  stack?: {
    title: string;
    description: string;
    components: Array<{
      type: 'prompt' | 'tool' | 'model' | 'agent';
      name: string;
      description: string;
      reason: string;
      source?: string;
      featured?: boolean;
    }>;
  };
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deployFlowOpen, setDeployFlowOpen] = useState(false);
  const [selectedStack, setSelectedStack] = useState(null);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { clarifyingQuestionsEnabled } = useSettings();

  const hasMessages = messages.length > 0;

  const suggestedQueries = [
    "Automate personalized outbound emails for my SaaS",
    "Speed up QA process for my engineering team", 
    "Summarize customer support tickets weekly",
    "Auto-generate blog posts from product updates"
  ];

  // Auto-rotate examples every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % suggestedQueries.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [suggestedQueries.length]);

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

    // Simulate AI response with stack
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you build the perfect AI stack for your needs. Based on your requirements, I've created a comprehensive solution.",
        role: 'assistant',
        timestamp: new Date(),
        stack: {
          title: "Email Automation Stack",
          description: "Complete solution for personalized outbound email campaigns with AI-powered content generation and tracking",
          components: [
            {
              type: "prompt" as const,
              name: "Email Personalization Prompt",
              description: "AI prompt for generating personalized email content based on prospect data",
              reason: "This prompt ensures your emails feel personal and relevant to each recipient, improving response rates by 40%"
            },
            {
              type: "tool" as const,
              name: "Clay.com",
              description: "Data enrichment and prospect research automation",
              reason: "Clay automatically finds and enriches prospect data, saving 3+ hours per day on manual research"
            },
            {
              type: "model" as const,
              name: "GPT-4",
              description: "AI model for content generation and personalization",
              reason: "GPT-4 provides the best balance of creativity and accuracy for email content generation"
            },
            {
              type: "agent" as const,
              name: "Email Sequence Agent",
              description: "Automated follow-up sequences based on recipient behavior",
              reason: "This agent handles follow-ups intelligently, increasing conversion rates without manual work"
            }
          ]
        }
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleDeployStack = (stack: any) => {
    setSelectedStack(stack);
    setDeployFlowOpen(true);
  };

  const handleDeployComplete = (destination: string) => {
    console.log('Stack deployed to:', destination);
  };

  if (!hasMessages) {
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
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-background border border-border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"></div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your automation needs..."
                  className="relative w-full min-h-[56px] px-6 py-4 text-base border-0 rounded-full resize-none focus:ring-0 focus:outline-none bg-transparent shadow-none"
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

            {/* Suggested Queries - Rotating Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-sm text-muted-foreground text-center mb-4">
                Popular searches:
              </p>
              
              <div className="max-w-3xl mx-auto">
                <div className="relative h-20 mb-6 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.button
                      key={currentExampleIndex}
                      onClick={() => setInput(suggestedQueries[currentExampleIndex])}
                      className="absolute w-full p-6 text-left rounded-2xl bg-muted/50 hover:bg-muted transition-all duration-200 border border-border/30 hover:border-border/50 group"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <span className="text-foreground font-medium text-lg block pr-8">
                        {suggestedQueries[currentExampleIndex]}
                      </span>
                      <ChevronRight className="h-5 w-5 absolute right-6 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.button>
                  </AnimatePresence>
                </div>
                
                {/* Progress indicators */}
                <div className="flex justify-center space-x-2">
                  {suggestedQueries.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentExampleIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentExampleIndex 
                          ? 'bg-primary w-8' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
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
                  onDeployStack={handleDeployStack}
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

      <DeployFlow
        isOpen={deployFlowOpen}
        onClose={() => setDeployFlowOpen(false)}
        stack={selectedStack}
        onDeployComplete={handleDeployComplete}
      />
    </div>
  );
};

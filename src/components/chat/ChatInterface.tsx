
import { useState } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { ChatView } from "./ChatView";
import { DeployFlow } from "@/components/deploy/DeployFlow";
import { useSettings } from "@/contexts/SettingsContext";

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
  const { clarifyingQuestionsEnabled } = useSettings();

  const hasMessages = messages.length > 0;

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
      <WelcomeScreen
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    );
  }

  return (
    <>
      <ChatView
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onDeployStack={handleDeployStack}
      />
      
      <DeployFlow
        isOpen={deployFlowOpen}
        onClose={() => setDeployFlowOpen(false)}
        stack={selectedStack}
        onDeployComplete={handleDeployComplete}
      />
    </>
  );
};

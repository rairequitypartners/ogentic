import { useRef, useEffect } from "react";
import { Send, Bot, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./ChatMessage";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from "@/components/ui/textarea";
import { AgentResponse } from '@/hooks/useAutonomousAgent';

interface ChatViewProps {
  messages: AgentResponse[];
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (input: string) => void;
  isLoading: boolean;
  error: string | null;
  onShowStacks: (messageId: string) => void;
}

export const ChatView = ({ messages, inputValue, setInputValue, onSendMessage, isLoading, error, onShowStacks }: ChatViewProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, error]);

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
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
                  isLoading={false} // Individual message loading state can be added if needed
                  onDeployStack={() => {}}
                  onShowStacks={() => onShowStacks(message.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && !messages.some(m => m.role === 'assistant' && m.content === '') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <Bot className="w-6 h-6 text-primary animate-pulse" />
              <p className="text-sm">ZingGPT is thinking...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-destructive bg-destructive/10 rounded-lg p-4"
            >
              <AlertTriangle className="w-6 h-6" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="px-4 py-3 bg-background border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (inputValue.trim()) onSendMessage(inputValue);
          }} 
          className="relative"
        >
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={"Ask me to generate an AI stack..."}
            className="w-full pr-12 resize-none min-h-[44px] max-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim()) onSendMessage(inputValue);
              }
            }}
            rows={1}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2" 
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

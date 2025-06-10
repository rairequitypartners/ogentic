
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bot, 
  User, 
  Rocket, 
  FileText, 
  Wrench, 
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { useState } from "react";

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
}

interface Stack {
  title: string;
  description: string;
  components: StackComponent[];
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
  tools?: any[];
  stack?: Stack;
}

interface ChatMessageProps {
  message: Message;
  onDeployStack?: (stack: Stack) => void;
}

const getComponentIcon = (type: string) => {
  switch (type) {
    case 'prompt': return FileText;
    case 'tool': return Wrench;
    case 'model': return Bot;
    case 'agent': return Zap;
    default: return FileText;
  }
};

const getComponentColor = (type: string) => {
  switch (type) {
    case 'prompt': return 'bg-blue-100 text-blue-800';
    case 'tool': return 'bg-green-100 text-green-800';
    case 'model': return 'bg-purple-100 text-purple-800';
    case 'agent': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const ChatMessage = ({ message, onDeployStack }: ChatMessageProps) => {
  const [expandedComponents, setExpandedComponents] = useState<Set<number>>(new Set());
  const isUser = message.role === 'user';

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedComponents(newExpanded);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`flex space-x-3 max-w-4xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-muted'
        }`}>
          {isUser ? (
            <User className="h-4 w-4 text-primary-foreground" />
          ) : (
            <Bot className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 space-y-4 ${isUser ? 'text-right' : ''}`}>
          {/* Text Content */}
          <div className={`inline-block p-4 rounded-lg max-w-full ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>

          {/* Stack Display */}
          {message.stack && !isUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gradient mb-2">
                        {message.stack.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {message.stack.description}
                      </p>
                    </div>
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>

                  <div className="space-y-3 mb-6">
                    {message.stack.components.map((component, index) => {
                      const Icon = getComponentIcon(component.type);
                      const isExpanded = expandedComponents.has(index);
                      
                      return (
                        <Card key={index} className="border card-hover">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Icon className="h-5 w-5 mt-1 text-primary" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold">{component.name}</h4>
                                  <Badge className={getComponentColor(component.type)}>
                                    {component.type}
                                  </Badge>
                                  {component.featured && (
                                    <Badge variant="secondary">Editor's Pick</Badge>
                                  )}
                                  {component.source && (
                                    <Badge variant="outline">{component.source}</Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground mb-2 text-sm">
                                  {component.description}
                                </p>
                                
                                <button
                                  onClick={() => toggleExpanded(index)}
                                  className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                  <span>Why this was recommended</span>
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                                
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 p-3 bg-muted rounded-lg"
                                  >
                                    <p className="text-sm">{component.reason}</p>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Deploy Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <Button 
                      onClick={() => onDeployStack?.(message.stack!)}
                      className="w-full py-6 text-lg font-semibold button-glow rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      size="lg"
                    >
                      <Rocket className="h-5 w-5 mr-2" />
                      Deploy This Stack
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Turn this into a working solution in your tools
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Legacy Tools Display (for backward compatibility) */}
          {message.tools && !message.stack && !isUser && (
            <div className="space-y-3">
              {message.tools.map((tool, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-primary mb-1">{tool.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                        <Badge variant="secondary" className="mr-2">{tool.useCase}</Badge>
                        <Badge variant="outline">{tool.source}</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="button-glow"
                        onClick={() => console.log('Deploy tool:', tool)}
                      >
                        <Rocket className="h-4 w-4 mr-1" />
                        Deploy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-xs text-muted-foreground ${isUser ? 'text-right' : ''}`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

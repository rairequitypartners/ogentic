
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, ExternalLink, Star, Zap, Settings, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Tool {
  id: string;
  name: string;
  description: string;
  useCase: string;
  source: string;
  type: string;
  url?: string;
  featured?: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: Tool[];
  streaming?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'prompt': return BookOpen;
    case 'tool': return Settings;
    case 'model': return Bot;
    case 'agent': return Zap;
    default: return Settings;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'prompt': return 'bg-blue-100 text-blue-800';
    case 'tool': return 'bg-green-100 text-green-800';
    case 'model': return 'bg-purple-100 text-purple-800';
    case 'agent': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          {isUser ? (
            <User className="h-4 w-4 text-primary-foreground" />
          ) : (
            <Bot className="h-4 w-4 text-secondary-foreground" />
          )}
        </motion.div>

        {/* Message Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl px-4 py-3 ${
              isUser 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted'
            }`}
          >
            <p className="text-sm leading-relaxed">
              {message.content}
              {message.streaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              )}
            </p>
          </motion.div>

          {/* Tools Grid */}
          {message.tools && message.tools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {message.tools.map((tool, index) => {
                const TypeIcon = getTypeIcon(tool.type);
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group"
                  >
                    <Card className="card-hover border-primary/20 bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-sm">{tool.name}</h4>
                            {tool.featured && (
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                          <Badge className={getTypeColor(tool.type)} variant="secondary">
                            {tool.type}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {tool.description}
                        </p>
                        
                        <div className="mb-3">
                          <p className="text-xs text-primary font-medium">
                            💡 {tool.useCase}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {tool.source}
                          </Badge>
                          
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <BookOpen className="h-3 w-3 mr-1" />
                              Setup
                            </Button>
                            
                            <Button 
                              size="sm"
                              className="h-7 px-3 text-xs"
                              onClick={() => tool.url && window.open(tool.url, '_blank')}
                            >
                              {tool.url ? (
                                <>
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Try Now
                                </>
                              ) : (
                                'Learn More'
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

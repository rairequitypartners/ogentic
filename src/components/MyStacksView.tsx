
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, Clock, Rocket } from 'lucide-react';
import { useMyStacks } from '@/hooks/useMyStacks';
import { formatDistanceToNow } from 'date-fns';

export const MyStacksView: React.FC = () => {
  const { savedStacks, removeStack } = useMyStacks();

  if (savedStacks.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">My Stacks</h2>
        <p className="text-muted-foreground mb-6">
          No saved stacks yet. Start chatting to discover and save AI tools!
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Discover Tools
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">My Stacks</h2>
        <p className="text-muted-foreground">
          Your saved AI tools and stacks ({savedStacks.length})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedStacks.map((stack, index) => (
          <motion.div
            key={stack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{stack.tool.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    {stack.platform && (
                      <Badge variant="secondary" className="text-xs">
                        <Rocket className="h-3 w-3 mr-1" />
                        {stack.platform}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStack(stack.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {stack.tool.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {stack.tool.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stack.tool.source}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Saved {formatDistanceToNow(stack.savedAt, { addSuffix: true })}</span>
                  </div>
                  {stack.tool.setupTime && (
                    <span>{stack.tool.setupTime} setup</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 text-xs">
                    Deploy Again
                  </Button>
                  {stack.tool.url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(stack.tool.url, '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

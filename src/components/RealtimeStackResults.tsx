
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Wrench, Zap, Users, Clock } from "lucide-react";
import { useRealtimeStacks } from "@/hooks/useRealtimeStacks";
import { formatDistanceToNow } from "date-fns";

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
}

interface RealtimeStackResultsProps {
  query: string;
  onSelectStack: (stack: any) => void;
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

export const RealtimeStackResults = ({ query, onSelectStack }: RealtimeStackResultsProps) => {
  const { stacks, loading } = useRealtimeStacks(query);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Finding real-time stack recommendations...</span>
        </div>
      </div>
    );
  }

  if (stacks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            No community stacks found for "{query}". Your AI-generated stack will appear above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Community Stacks (Live Updates)</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>
      
      {stacks.map((stack) => {
        const components = Array.isArray(stack.components) ? stack.components as StackComponent[] : [];
        
        return (
          <Card key={stack.id} className="card-hover animate-fade-in">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{stack.title}</CardTitle>
                  <CardDescription className="mt-1">{stack.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(stack.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {components.slice(0, 3).map((component, index) => {
                    const Icon = getComponentIcon(component.type);
                    return (
                      <div key={index} className="flex items-center space-x-1">
                        <Icon className="h-3 w-3" />
                        <Badge className={getComponentColor(component.type)} variant="secondary">
                          {component.name}
                        </Badge>
                      </div>
                    );
                  })}
                  {components.length > 3 && (
                    <Badge variant="outline">
                      +{components.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Community created</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelectStack({
                      title: stack.title,
                      description: stack.description,
                      components: components
                    })}
                  >
                    Use This Stack
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

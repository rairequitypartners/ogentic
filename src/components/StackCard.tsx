
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Wrench, Zap, Edit, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
}

interface StackCardProps {
  title: string;
  description: string;
  components: StackComponent[];
  onDeploy: () => void;
  onEdit?: (component: StackComponent) => void;
  onReplace?: (component: StackComponent) => void;
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

export const StackCard = ({ title, description, components, onDeploy, onEdit, onReplace }: StackCardProps) => {
  const [expandedComponents, setExpandedComponents] = useState<Set<number>>(new Set([0]));

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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {components.map((component, index) => {
              const Icon = getComponentIcon(component.type);
              const isExpanded = expandedComponents.has(index);
              
              return (
                <Card key={index} className="border-l-4 border-l-primary card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
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
                          <p className="text-muted-foreground mb-2">{component.description}</p>
                          
                          <button
                            onClick={() => toggleExpanded(index)}
                            className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <span>Why this was recommended</span>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          
                          {isExpanded && (
                            <div className="mt-3 p-3 bg-muted rounded-lg animate-fade-in">
                              <p className="text-sm">{component.reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onEdit?.(component)}
                          className="hover:bg-accent"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onReplace?.(component)}
                          className="hover:bg-accent"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Sticky Deploy Button */}
      <div className="sticky bottom-6 z-10">
        <Button 
          onClick={onDeploy}
          className="w-full py-6 text-lg font-semibold button-glow rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          Deploy This Stack
        </Button>
      </div>
    </div>
  );
};

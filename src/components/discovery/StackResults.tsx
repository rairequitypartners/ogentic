import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Wrench, Zap, Clock, Star, ExternalLink, Lightbulb, Loader2 } from "lucide-react";
import { useAIDiscovery } from "@/hooks/useAIDiscovery";
import { StackCardSkeleton } from "@/components/ui/skeleton";
import React from "react";

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

interface StackResultsProps {
  searchQuery: string;
  filters: FilterState;
  userPreferences: any;
}

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
  url?: string;
  pricing?: string;
}

interface GeneratedStack {
  title: string;
  description: string;
  components: StackComponent[];
  useCase: string;
  industry: string;
  complexity: string;
  estimatedSetupTime: string;
  benefits: string[];
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

const getPricingIcon = (pricing?: string) => {
  if (pricing === 'free') return '🆓';
  if (pricing === 'paid') return '💰';
  if (pricing === 'freemium') return '⭐';
  return '';
};

// Memoized stack card component
const StackCard = React.memo(({ stack, index }: { stack: GeneratedStack; index: number }) => (
  <Card className="card-hover border-primary/20">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <CardTitle className="text-xl">{stack.title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {stack.complexity}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stack.industry}
            </Badge>
          </div>
          <CardDescription className="mb-3 text-base">{stack.description}</CardDescription>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Setup: {stack.estimatedSetupTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-4 w-4" />
              <span>{stack.useCase}</span>
            </div>
          </div>

          {stack.benefits && stack.benefits.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium mb-2">Key Benefits:</h5>
              <div className="flex flex-wrap gap-1">
                {stack.benefits.slice(0, 3).map((benefit, bIndex) => (
                  <Badge key={bIndex} variant="secondary" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
                {stack.benefits.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{stack.benefits.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <span>Stack Components ({stack.components.length})</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stack.components.slice(0, 6).map((component, cIndex) => {
              const Icon = getComponentIcon(component.type);
              return (
                <div key={cIndex} className="p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start space-x-2">
                    <Icon className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h6 className="font-medium text-sm truncate">{component.name}</h6>
                        <Badge className={getComponentColor(component.type)} variant="secondary">
                          {component.type}
                        </Badge>
                        {component.featured && (
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {component.description}
                      </p>
                      
                      {component.reason && (
                        <p className="text-xs text-primary mb-2 line-clamp-2">
                          💡 {component.reason}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {component.source && (
                            <Badge variant="outline" className="text-xs">
                              {component.source}
                            </Badge>
                          )}
                          {component.pricing && (
                            <span className="text-xs flex items-center space-x-1">
                              <span>{getPricingIcon(component.pricing)}</span>
                              <span>{component.pricing}</span>
                            </span>
                          )}
                        </div>
                        {component.url && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => window.open(component.url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {stack.components.length > 6 && (
              <div className="p-3 border rounded-lg bg-muted/30 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  +{stack.components.length - 6} more components
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4" />
            <span>AI-generated stack • Just now</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button size="sm">
              Use This Stack
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
));

StackCard.displayName = 'StackCard';

export const StackResults = ({ 
  searchQuery = '', 
  filters = { types: [], sources: [], complexity: [], industries: [] }, 
  userPreferences = {} 
}: StackResultsProps) => {
  const [aiStacks, setAiStacks] = useState<GeneratedStack[]>([]);
  const [displayedStacks, setDisplayedStacks] = useState<GeneratedStack[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const { parseQuery } = useAIDiscovery();
  
  const STACKS_PER_PAGE = 2;

  const fetchStacks = useCallback(async () => {
    if (searchQuery.trim().length <= 3) {
      setAiStacks([]);
      setDisplayedStacks([]);
      return;
    }

    setLoading(true);
    setPage(0);
    setDisplayedStacks([]);
    
    try {
      const result = await parseQuery(searchQuery, userPreferences, 'stacks');
      const stacks = result.generatedStacks || [];
      setAiStacks(stacks);
      setDisplayedStacks(stacks.slice(0, STACKS_PER_PAGE));
    } catch (error) {
      console.error('Failed to get AI stacks:', error);
      setAiStacks([]);
      setDisplayedStacks([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, userPreferences, parseQuery]);

  useEffect(() => {
    // Debounce the API call
    const timeoutId = setTimeout(fetchStacks, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchStacks]);

  const loadMoreStacks = useCallback(async () => {
    setLoadingMore(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nextPage = page + 1;
    const startIndex = nextPage * STACKS_PER_PAGE;
    const endIndex = startIndex + STACKS_PER_PAGE;
    
    if (startIndex >= aiStacks.length) {
      try {
        const result = await parseQuery(`${searchQuery} additional variations`, userPreferences, 'stacks');
        const newStacks = result.generatedStacks || [];
        const updatedStacks = [...aiStacks, ...newStacks];
        setAiStacks(updatedStacks);
        setDisplayedStacks([...displayedStacks, ...newStacks.slice(0, STACKS_PER_PAGE)]);
      } catch (error) {
        console.error('Failed to load more stacks:', error);
      }
    } else {
      const newStacks = aiStacks.slice(startIndex, endIndex);
      setDisplayedStacks([...displayedStacks, ...newStacks]);
    }
    
    setPage(nextPage);
    setLoadingMore(false);
  }, [page, aiStacks, displayedStacks, searchQuery, userPreferences, parseQuery]);

  const hasMoreStacks = useMemo(() => 
    displayedStacks.length < aiStacks.length || displayedStacks.length >= STACKS_PER_PAGE
  , [displayedStacks.length, aiStacks.length]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>AI is generating stacks for your needs...</span>
        </div>
        {[...Array(2)].map((_, i) => (
          <StackCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (displayedStacks.length === 0 && searchQuery.trim().length > 3) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No AI-generated stacks found for your query.
          </p>
          <p className="text-sm text-muted-foreground">
            Try refining your search or being more specific about your use case.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (searchQuery.trim().length <= 3) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground mb-2">
            Search for AI stacks using natural language
          </p>
          <p className="text-sm text-muted-foreground">
            Try: "customer support automation for ecommerce" or "content creation workflow"
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {displayedStacks.length} AI-Generated Stack{displayedStacks.length !== 1 ? 's' : ''}
          {aiStacks.length > displayedStacks.length && ` (${aiStacks.length - displayedStacks.length} more available)`}
        </h3>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Zap className="h-3 w-3" />
          <span>AI Generated</span>
        </Badge>
      </div>
      
      {displayedStacks.map((stack, index) => (
        <StackCard key={`${stack.title}-${index}`} stack={stack} index={index} />
      ))}

      {hasMoreStacks && (
        <div className="flex justify-center">
          <Button 
            onClick={loadMoreStacks} 
            variant="outline" 
            disabled={loadingMore}
            className="w-full max-w-sm"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading more stacks...
              </>
            ) : (
              'Load More Stacks'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};


import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Brain, Sparkles } from "lucide-react";
import { useAIDiscovery } from "@/hooks/useAIDiscovery";

interface AIEnhancedSearchProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: any) => void;
  userPreferences?: any;
  context?: 'stacks' | 'tools' | 'recommendations';
  initialQuery?: string;
}

export const AIEnhancedSearch = ({ 
  onSearch, 
  onFiltersChange, 
  userPreferences, 
  context = 'stacks',
  initialQuery = ""
}: AIEnhancedSearchProps) => {
  const [lastQuery, setLastQuery] = useState(initialQuery);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const { parseQuery, loading } = useAIDiscovery();

  // Set initial query when component mounts
  useEffect(() => {
    if (initialQuery && initialQuery !== lastQuery) {
      setLastQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (query: string) => {
    setLastQuery(query);
    onSearch(query);

    if (query.trim().length > 5) {
      try {
        const parsed = await parseQuery(query, userPreferences, context);
        setAiInsights(parsed);
        
        // Auto-apply AI-suggested filters
        if (parsed.filters) {
          onFiltersChange(parsed.filters);
        }
      } catch (error) {
        console.error('Failed to get AI insights:', error);
      }
    }
  };

  const applySuggestion = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const clearInsights = () => {
    setAiInsights(null);
    onFiltersChange({ types: [], sources: [], complexity: [], industries: [] });
  };

  return (
    <div className="space-y-4">
      <SearchBar 
        onSearch={handleSearch}
        placeholder={`Describe what you're looking for... (e.g., "customer support automation for e-commerce")`}
        className="max-w-4xl"
        value={lastQuery}
      />
      
      {loading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-primary">
              <Brain className="h-4 w-4 animate-pulse" />
              <span>AI is analyzing your query...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {aiInsights && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">AI Insights</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearInsights}>
                Clear
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Intent:</strong> {aiInsights.intent}
              </p>
              
              {aiInsights.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-2">Keywords:</span>
                  {aiInsights.keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              {aiInsights.suggestions?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <Lightbulb className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium">Try these queries:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiInsights.suggestions.map((suggestion: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => applySuggestion(suggestion)}
                        className="px-3 py-1 text-xs bg-background border rounded-full hover:bg-accent transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Wrench, Zap, Star, Download, ExternalLink } from "lucide-react";
import { useAIDiscovery } from "@/hooks/useAIDiscovery";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { ToolCardSkeleton } from "@/components/ui/skeleton";
import React from "react";

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

interface ToolsLibraryProps {
  searchQuery: string;
  filters: FilterState;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'prompt' | 'tool' | 'model' | 'agent';
  source: string;
  rating: number;
  downloads: number;
  featured: boolean;
  complexity: string;
  tags: string[];
  pricing: 'free' | 'freemium' | 'paid';
  url?: string;
  reason?: string;
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

// Priority tools to show first while loading
const PRIORITY_TOOLS: Tool[] = [
  {
    id: "priority-1",
    name: "ChatGPT",
    description: "Advanced AI assistant for coding, writing, and problem-solving",
    type: 'model',
    source: 'OpenAI',
    rating: 4.8,
    downloads: 125000,
    featured: true,
    complexity: 'beginner',
    tags: ['ai-assistant', 'coding', 'writing'],
    pricing: 'freemium',
    url: 'https://chat.openai.com'
  },
  {
    id: "priority-2", 
    name: "Claude",
    description: "AI assistant specialized in analysis, writing, and coding tasks",
    type: 'model',
    source: 'Anthropic',
    rating: 4.7,
    downloads: 85000,
    featured: true,
    complexity: 'beginner',
    tags: ['ai-assistant', 'analysis', 'coding'],
    pricing: 'freemium',
    url: 'https://claude.ai'
  }
];

// Memoized tool card component
const ToolCard = React.memo(({ tool }: { tool: Tool }) => {
  const Icon = getComponentIcon(tool.type);
  
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">{tool.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getComponentColor(tool.type)} variant="secondary">
                  {tool.type}
                </Badge>
                {tool.featured && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>
            </div>
          </div>
          <Badge variant={tool.pricing === 'free' ? 'default' : 'outline'}>
            {tool.pricing}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-3">{tool.description}</CardDescription>
        
        {tool.reason && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Why this tool:</strong> {tool.reason}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{tool.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>{tool.downloads.toLocaleString()}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {tool.source}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {tool.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {tool.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tool.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            Add to Stack
          </Button>
          {tool.url && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(tool.url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ToolCard.displayName = 'ToolCard';

// Convert AI discovery components to tools format
const convertAIComponentsToTools = (components: any[]): Tool[] => {
  return components.map((component, index) => ({
    id: `ai-${Date.now()}-${index}`,
    name: component.name || 'AI Tool',
    description: component.description || 'AI-generated tool recommendation',
    type: component.type || 'tool',
    source: component.source || 'AI Generated',
    rating: 4.5 + Math.random() * 0.5,
    downloads: Math.floor(Math.random() * 50000) + 1000,
    featured: component.featured || false,
    complexity: component.complexity || 'intermediate',
    tags: component.tags || [],
    pricing: component.pricing || 'freemium',
    url: component.url,
    reason: component.reason
  }));
};

export const ToolsLibrary = ({ searchQuery, filters }: ToolsLibraryProps) => {
  const { parseQuery, loading: aiLoading } = useAIDiscovery();
  const { preferences } = useUserPreferences();
  const [tools, setTools] = useState<Tool[]>([]);
  const [priorityTools, setPriorityTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'name'>('rating');

  // Memoized filter function
  const applyFilters = useCallback((toolsToFilter: Tool[]) => {
    return toolsToFilter.filter(tool => {
      if (filters.types.length > 0 && !filters.types.includes(tool.type)) {
        return false;
      }
      if (filters.sources.length > 0 && !filters.sources.includes(tool.source.toLowerCase())) {
        return false;
      }
      if (filters.complexity.length > 0 && !filters.complexity.includes(tool.complexity)) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Memoized search function
  const searchTools = useCallback((toolsToSearch: Tool[], query: string) => {
    if (!query.trim()) return toolsToSearch;
    
    const searchTerms = query.toLowerCase().split(/\s+/);
    return toolsToSearch.filter(tool => {
      const searchableText = [
        tool.name.toLowerCase(),
        tool.description.toLowerCase(),
        ...tool.tags.map(tag => tag.toLowerCase()),
        tool.type.toLowerCase(),
        tool.source.toLowerCase()
      ].join(' ');

      return searchTerms.some(term => searchableText.includes(term));
    });
  }, []);

  // Show priority tools immediately while AI loads
  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredPriority = applyFilters(searchTools(PRIORITY_TOOLS, searchQuery));
      setPriorityTools(filteredPriority);
    } else {
      setPriorityTools([]);
    }
  }, [searchQuery, filters, applyFilters, searchTools]);

  // Fetch AI-powered tools
  useEffect(() => {
    const fetchTools = async () => {
      if (!searchQuery.trim()) {
        setTools([]);
        setPriorityTools([]);
        return;
      }

      setLoading(true);
      
      try {
        console.log('Fetching AI-powered tool recommendations for:', searchQuery);
        
        const aiResults = await parseQuery(searchQuery, preferences, 'tools');
        
        if (aiResults.generatedStacks && aiResults.generatedStacks.length > 0) {
          const allComponents = aiResults.generatedStacks.flatMap(stack => stack.components);
          const aiTools = convertAIComponentsToTools(allComponents);
          const filteredAITools = applyFilters(aiTools);
          
          console.log('AI-generated tools:', filteredAITools);
          setTools(filteredAITools);
        } else {
          console.log('No AI results, showing priority tools only');
          setTools([]);
        }
      } catch (error) {
        console.error('Error fetching AI tools:', error);
        setTools([]);
      }
      
      setLoading(false);
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchTools, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, parseQuery, preferences, applyFilters]);

  // Memoized sorted tools
  const sortedTools = useMemo(() => {
    const allTools = [...priorityTools, ...tools];
    const uniqueTools = allTools.filter((tool, index, self) => 
      index === self.findIndex(t => t.name === tool.name)
    );
    
    return uniqueTools.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [priorityTools, tools, sortBy]);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as 'rating' | 'downloads' | 'name');
  }, []);

  if (loading || aiLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Discovering AI tools...</span>
        </div>
        
        {/* Show priority tools immediately */}
        {priorityTools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {priorityTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
        
        {/* Show skeletons for loading tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {sortedTools.length} Tool{sortedTools.length !== 1 ? 's' : ''} Found
          {searchQuery && (
            <span className="text-sm text-muted-foreground font-normal ml-2">
              for "{searchQuery}"
            </span>
          )}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="rating">Rating</option>
            <option value="downloads">Downloads</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {sortedTools.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              No tools found matching your criteria.
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search query or filters to see more results.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

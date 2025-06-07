
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Wrench, Zap, Star, Download, ExternalLink } from "lucide-react";
import { useAIDiscovery } from "@/hooks/useAIDiscovery";
import { useUserPreferences } from "@/hooks/useUserPreferences";

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

// Fallback mock data for when AI discovery is not available
const getFallbackTools = (query: string, filters: FilterState): Tool[] => {
  const baseTools: Tool[] = [
    {
      id: "1",
      name: "Customer Service Email Template",
      description: "Professional, empathetic email responses for customer support scenarios",
      type: 'prompt',
      source: 'OpenAI',
      rating: 4.8,
      downloads: 5200,
      featured: true,
      complexity: 'beginner',
      tags: ['customer-service', 'email', 'support', 'customers'],
      pricing: 'free'
    },
    {
      id: "2",
      name: "GPT-4o",
      description: "Advanced multimodal AI model for text, image, and audio processing",
      type: 'model',
      source: 'OpenAI',
      rating: 4.9,
      downloads: 125000,
      featured: true,
      complexity: 'intermediate',
      tags: ['language-model', 'multimodal', 'reasoning'],
      pricing: 'paid',
      url: 'https://openai.com/gpt-4'
    },
    {
      id: "3",
      name: "Gaming Analytics Dashboard",
      description: "Track player behavior, engagement metrics, and game performance",
      type: 'tool',
      source: 'Unity',
      rating: 4.6,
      downloads: 28000,
      featured: true,
      complexity: 'intermediate',
      tags: ['gaming', 'analytics', 'metrics', 'dashboard'],
      pricing: 'freemium'
    },
    {
      id: "4",
      name: "Game Strategy AI Prompt",
      description: "AI assistant for learning game strategies and tactics",
      type: 'prompt',
      source: 'Community',
      rating: 4.5,
      downloads: 12000,
      featured: false,
      complexity: 'beginner',
      tags: ['gaming', 'strategy', 'learning', 'tactics'],
      pricing: 'free'
    },
    {
      id: "5",
      name: "Player Behavior Analysis Model",
      description: "AI model that analyzes gaming patterns and suggests improvements",
      type: 'model',
      source: 'Custom',
      rating: 4.7,
      downloads: 8500,
      featured: true,
      complexity: 'advanced',
      tags: ['gaming', 'analysis', 'behavior', 'learning'],
      pricing: 'paid'
    }
  ];

  // Filter based on query and filters
  return baseTools.filter(tool => {
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(/\s+/);
      const searchableText = [
        tool.name.toLowerCase(),
        tool.description.toLowerCase(),
        ...tool.tags.map(tag => tag.toLowerCase()),
        tool.type.toLowerCase(),
        tool.source.toLowerCase()
      ].join(' ');

      const matchesSearch = searchTerms.some(term => 
        searchableText.includes(term)
      );

      if (!matchesSearch) return false;
    }

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
};

// Convert AI discovery components to tools format
const convertAIComponentsToTools = (components: any[]): Tool[] => {
  return components.map((component, index) => ({
    id: `ai-${index}`,
    name: component.name || 'AI Tool',
    description: component.description || 'AI-generated tool recommendation',
    type: component.type || 'tool',
    source: component.source || 'AI Generated',
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
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
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'name'>('rating');

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      
      try {
        if (searchQuery.trim()) {
          console.log('Fetching AI-powered tool recommendations for:', searchQuery);
          
          // Use AI discovery to get relevant tools
          const aiResults = await parseQuery(searchQuery, preferences, 'tools');
          
          if (aiResults.generatedStacks && aiResults.generatedStacks.length > 0) {
            // Extract all components from generated stacks
            const allComponents = aiResults.generatedStacks.flatMap(stack => stack.components);
            const aiTools = convertAIComponentsToTools(allComponents);
            
            // Apply filters to AI-generated tools
            const filteredAITools = aiTools.filter(tool => {
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
            
            console.log('AI-generated tools:', filteredAITools);
            setTools(filteredAITools);
          } else {
            console.log('No AI results, using fallback');
            setTools(getFallbackTools(searchQuery, filters));
          }
        } else {
          // Show fallback tools when no search query
          setTools(getFallbackTools(searchQuery, filters));
        }
      } catch (error) {
        console.error('Error fetching AI tools:', error);
        // Fallback to static tools on error
        setTools(getFallbackTools(searchQuery, filters));
      }
      
      setLoading(false);
    };

    fetchTools();
  }, [searchQuery, filters, parseQuery, preferences]);

  // Sort tools
  useEffect(() => {
    const sortedTools = [...tools].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    setTools(sortedTools);
  }, [sortBy]);

  if (loading || aiLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Discovering AI tools...</span>
        </div>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-5 bg-muted rounded w-12"></div>
                  <div className="h-5 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {tools.length} Tool{tools.length !== 1 ? 's' : ''} Found
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
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="rating">Rating</option>
            <option value="downloads">Downloads</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => {
          const Icon = getComponentIcon(tool.type);
          return (
            <Card key={tool.id} className="card-hover">
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
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tools.length === 0 && (
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

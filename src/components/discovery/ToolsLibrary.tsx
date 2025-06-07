
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Wrench, Zap, Star, Download, ExternalLink } from "lucide-react";

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

// Mock data for individual tools
const generateMockTools = (query: string, filters: FilterState): Tool[] => {
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
      tags: ['customer-service', 'email', 'support'],
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
      name: "Zapier Automation",
      description: "Connect and automate workflows between 5,000+ apps",
      type: 'tool',
      source: 'Zapier',
      rating: 4.6,
      downloads: 89000,
      featured: false,
      complexity: 'intermediate',
      tags: ['automation', 'integration', 'workflow'],
      pricing: 'freemium',
      url: 'https://zapier.com'
    },
    {
      id: "4",
      name: "Claude-3 Haiku",
      description: "Fast, creative AI model optimized for content generation",
      type: 'model',
      source: 'Anthropic',
      rating: 4.7,
      downloads: 45000,
      featured: true,
      complexity: 'beginner',
      tags: ['content-generation', 'creative-writing', 'fast'],
      pricing: 'paid',
      url: 'https://claude.ai'
    },
    {
      id: "5",
      name: "Social Media Content Generator",
      description: "AI prompt for creating engaging social media posts across platforms",
      type: 'prompt',
      source: 'Community',
      rating: 4.5,
      downloads: 12000,
      featured: false,
      complexity: 'beginner',
      tags: ['social-media', 'marketing', 'content'],
      pricing: 'free'
    },
    {
      id: "6",
      name: "Priority Ticket Classifier",
      description: "AI agent that automatically categorizes and prioritizes support tickets",
      type: 'agent',
      source: 'Custom',
      rating: 4.8,
      downloads: 3500,
      featured: true,
      complexity: 'advanced',
      tags: ['classification', 'automation', 'support'],
      pricing: 'freemium'
    },
    {
      id: "7",
      name: "Notion Database Sync",
      description: "Automated data synchronization between applications and Notion",
      type: 'tool',
      source: 'Notion',
      rating: 4.4,
      downloads: 28000,
      featured: false,
      complexity: 'intermediate',
      tags: ['database', 'sync', 'productivity'],
      pricing: 'freemium',
      url: 'https://notion.so'
    },
    {
      id: "8",
      name: "Data Insights Analyzer",
      description: "AI prompt for generating business insights from raw data",
      type: 'prompt',
      source: 'Custom',
      rating: 4.6,
      downloads: 8900,
      featured: false,
      complexity: 'advanced',
      tags: ['analytics', 'insights', 'business'],
      pricing: 'free'
    }
  ];

  return baseTools.filter(tool => {
    // Search query filter
    if (query && !tool.name.toLowerCase().includes(query.toLowerCase()) && 
        !tool.description.toLowerCase().includes(query.toLowerCase()) &&
        !tool.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
      return false;
    }

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(tool.type)) {
      return false;
    }

    // Source filter
    if (filters.sources.length > 0 && !filters.sources.includes(tool.source.toLowerCase())) {
      return false;
    }

    // Complexity filter
    if (filters.complexity.length > 0 && !filters.complexity.includes(tool.complexity)) {
      return false;
    }

    return true;
  });
};

export const ToolsLibrary = ({ searchQuery, filters }: ToolsLibraryProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'name'>('rating');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let results = generateMockTools(searchQuery, filters);
      
      // Sort results
      results.sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
      
      setTools(results);
      setLoading(false);
    }, 300);
  }, [searchQuery, filters, sortBy]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Loading tools...</span>
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
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{tool.rating}</span>
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

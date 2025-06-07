
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Wrench, Zap, Users, Clock, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
}

interface Stack {
  id: string;
  title: string;
  description: string;
  components: StackComponent[];
  rating: number;
  usageCount: number;
  created_at: string;
  tags: string[];
  complexity: string;
  industry: string;
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

// Mock data for demonstration
const generateMockStacks = (query: string, filters: FilterState): Stack[] => {
  const baseStacks: Stack[] = [
    {
      id: "1",
      title: "Customer Support Automation Stack",
      description: "Complete AI-powered solution for automating customer support with intelligent routing and responses",
      components: [
        { type: 'prompt', name: 'Support Email Template', description: 'Professional customer support responses', reason: 'Optimized for empathy and problem resolution', source: 'OpenAI', featured: true },
        { type: 'model', name: 'GPT-4o', description: 'Advanced language model for customer communication', reason: 'Excellent at maintaining consistent tone', source: 'OpenAI' },
        { type: 'tool', name: 'Zendesk Integration', description: 'Automated ticket management', reason: 'Seamless workflow integration', source: 'Zendesk' },
        { type: 'agent', name: 'Priority Classifier', description: 'AI agent for urgent ticket detection', reason: 'Reduces response time for critical issues', source: 'Custom' }
      ],
      rating: 4.8,
      usageCount: 1250,
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      tags: ['customer-service', 'automation', 'email'],
      complexity: 'intermediate',
      industry: 'ecommerce'
    },
    {
      id: "2",
      title: "Content Marketing Generator",
      description: "AI-powered content creation and scheduling for social media marketing",
      components: [
        { type: 'prompt', name: 'Social Media Creator', description: 'Platform-specific content generation', reason: 'Tailored for each social platform', source: 'Custom', featured: true },
        { type: 'model', name: 'Claude-3 Haiku', description: 'Creative writing model', reason: 'Excellent at maintaining brand voice', source: 'Anthropic' },
        { type: 'tool', name: 'Buffer Scheduler', description: 'Automated posting', reason: 'Optimal timing for engagement', source: 'Buffer' },
        { type: 'agent', name: 'Performance Optimizer', description: 'Content performance analysis', reason: 'Learns from engagement metrics', source: 'Custom' }
      ],
      rating: 4.6,
      usageCount: 890,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      tags: ['marketing', 'social-media', 'content'],
      complexity: 'beginner',
      industry: 'marketing'
    },
    {
      id: "3",
      title: "Data Analysis & Reporting Suite",
      description: "Comprehensive AI solution for data analysis, visualization, and automated reporting",
      components: [
        { type: 'prompt', name: 'Data Insights Generator', description: 'Generates business insights from data', reason: 'Transforms raw data into actionable insights', source: 'Custom', featured: true },
        { type: 'model', name: 'GPT-4o', description: 'Advanced reasoning for data interpretation', reason: 'Superior analytical capabilities', source: 'OpenAI' },
        { type: 'tool', name: 'Tableau Integration', description: 'Advanced data visualization', reason: 'Professional-grade charts and dashboards', source: 'Tableau' },
        { type: 'agent', name: 'Anomaly Detector', description: 'Identifies unusual patterns in data', reason: 'Proactive issue identification', source: 'Custom' }
      ],
      rating: 4.9,
      usageCount: 2100,
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      tags: ['analytics', 'reporting', 'business-intelligence'],
      complexity: 'advanced',
      industry: 'finance'
    }
  ];

  // Filter stacks based on search query and filters
  return baseStacks.filter(stack => {
    // Search query filter
    if (query && !stack.title.toLowerCase().includes(query.toLowerCase()) && 
        !stack.description.toLowerCase().includes(query.toLowerCase()) &&
        !stack.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
      return false;
    }

    // Type filter
    if (filters.types.length > 0) {
      const hasMatchingType = stack.components.some(component => 
        filters.types.includes(component.type)
      );
      if (!hasMatchingType) return false;
    }

    // Complexity filter
    if (filters.complexity.length > 0 && !filters.complexity.includes(stack.complexity)) {
      return false;
    }

    // Industry filter
    if (filters.industries.length > 0 && !filters.industries.includes(stack.industry)) {
      return false;
    }

    // Source filter
    if (filters.sources.length > 0) {
      const hasMatchingSource = stack.components.some(component => 
        component.source && filters.sources.includes(component.source.toLowerCase())
      );
      if (!hasMatchingSource) return false;
    }

    return true;
  });
};

export const StackResults = ({ searchQuery, filters, userPreferences }: StackResultsProps) => {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const results = generateMockStacks(searchQuery, filters);
      setStacks(results);
      setLoading(false);
    }, 500);
  }, [searchQuery, filters]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Finding AI stacks...</span>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-muted rounded w-16"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (stacks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No stacks found matching your criteria.
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query or filters to see more results.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {stacks.length} Stack{stacks.length !== 1 ? 's' : ''} Found
        </h3>
      </div>
      
      {stacks.map((stack) => (
        <Card key={stack.id} className="card-hover">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <CardTitle className="text-lg">{stack.title}</CardTitle>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{stack.rating}</span>
                  </div>
                </div>
                <CardDescription className="mb-3">{stack.description}</CardDescription>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{stack.usageCount} uses</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(stack.created_at), { addSuffix: true })}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stack.complexity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stack.industry}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {stack.components.slice(0, 4).map((component, index) => {
                  const Icon = getComponentIcon(component.type);
                  return (
                    <div key={index} className="flex items-center space-x-1">
                      <Icon className="h-3 w-3" />
                      <Badge className={getComponentColor(component.type)} variant="secondary">
                        {component.name}
                      </Badge>
                      {component.featured && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                  );
                })}
                {stack.components.length > 4 && (
                  <Badge variant="outline">
                    +{stack.components.length - 4} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {stack.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Use Stack
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

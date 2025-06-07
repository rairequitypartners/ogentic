
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, FileText, Wrench, Zap, Star, TrendingUp, Award } from "lucide-react";

interface RecommendedStacksProps {
  userPreferences: any;
  searchQuery: string;
}

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  source?: string;
  featured?: boolean;
}

interface RecommendedStack {
  id: string;
  title: string;
  description: string;
  components: StackComponent[];
  rating: number;
  matchScore: number;
  reason: string;
  category: 'trending' | 'personalized' | 'editor-choice';
  tags: string[];
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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'trending': return TrendingUp;
    case 'personalized': return Star;
    case 'editor-choice': return Award;
    default: return Star;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'trending': return 'bg-red-100 text-red-800';
    case 'personalized': return 'bg-green-100 text-green-800';
    case 'editor-choice': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Generate personalized recommendations based on user preferences
const generateRecommendations = (preferences: any, query: string): RecommendedStack[] => {
  const baseStacks: RecommendedStack[] = [
    {
      id: "trend-1",
      title: "AI-Powered Sales Assistant",
      description: "Complete sales automation stack with lead qualification and follow-up",
      components: [
        { type: 'prompt', name: 'Sales Qualifier', description: 'Lead qualification prompts', source: 'Custom', featured: true },
        { type: 'model', name: 'GPT-4o', description: 'Conversational AI for sales', source: 'OpenAI' },
        { type: 'tool', name: 'HubSpot CRM', description: 'Lead management integration', source: 'HubSpot' },
        { type: 'agent', name: 'Follow-up Scheduler', description: 'Automated follow-up timing', source: 'Custom' }
      ],
      rating: 4.7,
      matchScore: 85,
      reason: "Trending among sales teams this week",
      category: 'trending',
      tags: ['sales', 'automation', 'crm']
    },
    {
      id: "editor-1",
      title: "Healthcare Documentation Assistant",
      description: "AI stack for medical documentation and patient communication",
      components: [
        { type: 'prompt', name: 'Medical Documentation', description: 'HIPAA-compliant documentation templates', source: 'Custom', featured: true },
        { type: 'model', name: 'Claude-3 Opus', description: 'Healthcare-trained language model', source: 'Anthropic' },
        { type: 'tool', name: 'Epic EHR Integration', description: 'Electronic health records sync', source: 'Epic' },
        { type: 'agent', name: 'Symptom Tracker', description: 'Patient symptom monitoring', source: 'Custom' }
      ],
      rating: 4.9,
      matchScore: 92,
      reason: "Editor's choice for healthcare professionals",
      category: 'editor-choice',
      tags: ['healthcare', 'documentation', 'compliance']
    }
  ];

  // Add personalized recommendations based on user preferences
  if (preferences) {
    if (preferences.industry === 'marketing') {
      baseStacks.push({
        id: "personal-1",
        title: "Advanced Marketing Attribution Stack",
        description: "Multi-touch attribution and campaign optimization for marketing teams",
        components: [
          { type: 'prompt', name: 'Attribution Analyzer', description: 'Campaign performance analysis', source: 'Custom', featured: true },
          { type: 'model', name: 'GPT-4o', description: 'Marketing data interpretation', source: 'OpenAI' },
          { type: 'tool', name: 'Google Analytics 4', description: 'Web analytics integration', source: 'Google' },
          { type: 'agent', name: 'Budget Optimizer', description: 'Campaign budget allocation', source: 'Custom' }
        ],
        rating: 4.6,
        matchScore: 95,
        reason: `Perfect match for your ${preferences.industry} background and ${preferences.ux_complexity} complexity preference`,
        category: 'personalized',
        tags: ['marketing', 'attribution', 'analytics']
      });
    }

    if (preferences.industry === 'ecommerce') {
      baseStacks.push({
        id: "personal-2",
        title: "E-commerce Personalization Engine",
        description: "AI-driven product recommendations and customer journey optimization",
        components: [
          { type: 'prompt', name: 'Product Recommender', description: 'Personalized product suggestions', source: 'Custom', featured: true },
          { type: 'model', name: 'Claude-3 Haiku', description: 'Fast recommendation processing', source: 'Anthropic' },
          { type: 'tool', name: 'Shopify Integration', description: 'E-commerce platform sync', source: 'Shopify' },
          { type: 'agent', name: 'Churn Predictor', description: 'Customer retention analysis', source: 'Custom' }
        ],
        rating: 4.8,
        matchScore: 88,
        reason: `Tailored for ${preferences.industry} with ${preferences.output_tone} communication style`,
        category: 'personalized',
        tags: ['ecommerce', 'personalization', 'retention']
      });
    }
  }

  // Filter by search query if provided
  if (query) {
    return baseStacks.filter(stack => 
      stack.title.toLowerCase().includes(query.toLowerCase()) ||
      stack.description.toLowerCase().includes(query.toLowerCase()) ||
      stack.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  return baseStacks;
};

export const RecommendedStacks = ({ userPreferences, searchQuery }: RecommendedStacksProps) => {
  const [stacks, setStacks] = useState<RecommendedStack[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const recommendations = generateRecommendations(userPreferences, searchQuery);
      setStacks(recommendations);
      setLoading(false);
    }, 400);
  }, [userPreferences, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Generating personalized recommendations...</span>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Group stacks by category
  const groupedStacks = stacks.reduce((acc, stack) => {
    if (!acc[stack.category]) acc[stack.category] = [];
    acc[stack.category].push(stack);
    return acc;
  }, {} as Record<string, RecommendedStack[]>);

  const categoryTitles = {
    personalized: 'Personalized for You',
    trending: 'Trending This Week',
    'editor-choice': "Editor's Choice"
  };

  return (
    <div className="space-y-6">
      {!userPreferences && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Complete your onboarding to get personalized AI stack recommendations!
            </p>
            <Button variant="outline">
              Complete Onboarding
            </Button>
          </CardContent>
        </Card>
      )}

      {Object.entries(groupedStacks).map(([category, categoryStacks]) => {
        const CategoryIcon = getCategoryIcon(category);
        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center space-x-2">
              <CategoryIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{categoryTitles[category as keyof typeof categoryTitles]}</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {categoryStacks.map((stack) => (
                <Card key={stack.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg">{stack.title}</CardTitle>
                          <Badge className={getCategoryColor(stack.category)} variant="secondary">
                            {stack.category === 'editor-choice' ? "Editor's Choice" : stack.category}
                          </Badge>
                          {stack.matchScore > 90 && (
                            <Badge variant="default" className="bg-green-500">
                              {stack.matchScore}% match
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mb-2">{stack.description}</CardDescription>
                        <p className="text-sm text-primary font-medium">{stack.reason}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{stack.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {stack.components.slice(0, 3).map((component, index) => {
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
                        {stack.components.length > 3 && (
                          <Badge variant="outline">
                            +{stack.components.length - 3} more
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
          </div>
        );
      })}

      {stacks.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No recommendations found. Try adjusting your search or completing your onboarding for personalized suggestions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

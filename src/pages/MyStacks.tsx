
import { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StackDeployment } from "@/components/StackDeployment";
import { Header } from "@/components/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { 
  Folder, 
  Play, 
  Trash2, 
  Search, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ArrowRight,
  Layers,
  Star
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

// Lazy load the recommendation components
const RecommendedStacks = lazy(() => import("@/components/discovery/RecommendedStacks").then(m => ({ default: m.RecommendedStacks })));
const StackResults = lazy(() => import("@/components/discovery/StackResults").then(m => ({ default: m.StackResults })));

type AIStack = Tables<'ai_stacks'>;

const StacksLoadingFallback = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2 text-primary">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      <span>Loading stacks...</span>
    </div>
    {[...Array(2)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    ))}
  </div>
);

export default function MyStacks() {
  const { user, loading: authLoading } = useAuth();
  const { isOnboardingCompleted, preferences, loading: preferencesLoading } = useUserPreferences();
  const [stacks, setStacks] = useState<AIStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStack, setExpandedStack] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchStacks();
    }
  }, [user, authLoading, navigate]);

  const fetchStacks = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_stacks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStacks(data || []);
    } catch (error) {
      console.error('Error fetching stacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStack = async (stackId: string) => {
    try {
      const { error } = await supabase
        .from('ai_stacks')
        .delete()
        .eq('id', stackId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setStacks(stacks.filter(stack => stack.id !== stackId));
    } catch (error) {
      console.error('Error deleting stack:', error);
    }
  };

  const getComponentCount = (components: any) => {
    if (!components || !Array.isArray(components)) return 0;
    return components.length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'default';
      case 'deploying':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const toggleExpanded = (stackId: string) => {
    setExpandedStack(expandedStack === stackId ? null : stackId);
  };

  const handleStartFresh = () => {
    navigate("/?fresh=true");
  };

  const getSortedStacks = (stacksToSort: AIStack[]) => {
    switch (sortBy) {
      case 'recent':
        return [...stacksToSort].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return [...stacksToSort].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'alphabetical':
        return [...stacksToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'components':
        return [...stacksToSort].sort((a, b) => getComponentCount(b.components) - getComponentCount(a.components));
      case 'ratings':
        return [...stacksToSort].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return stacksToSort;
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  const sortedStacks = getSortedStacks(stacks);

  return (
    <div className="min-h-screen bg-background">
      <Header onStartFresh={handleStartFresh} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Folder className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">My Stacks</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your saved AI stacks, discover complete solutions, and get personalized recommendations.
          </p>
        </div>

        {!preferencesLoading && !isOnboardingCompleted() && (
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Complete Your Setup</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">
                Get personalized AI agent recommendations by completing your profile setup. 
                This helps us match you with the best agents for your specific needs and industry.
              </p>
              <Button 
                onClick={() => navigate("/onboarding")} 
                className="button-glow"
                size="sm"
              >
                Start Onboarding
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* My Saved Stacks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Folder className="h-6 w-6" />
              My Saved Stacks
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : stacks.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No stacks saved yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by searching for an AI stack and saving it to your collection.
                </p>
                <Button onClick={handleStartFresh} className="button-glow">
                  Discover AI Stacks
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {stacks.length} stack{stacks.length !== 1 ? 's' : ''} total
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="components">Most Components</SelectItem>
                      <SelectItem value="ratings">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {sortedStacks.map((stack) => (
                  <Card key={stack.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{stack.title}</span>
                            <Badge variant={getStatusColor(stack.deployment_status || 'draft')}>
                              {stack.deployment_status || 'draft'}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {stack.description}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(stack.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigate(`/results?stack=${stack.id}`);
                            }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteStack(stack.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Components:</span>
                            <Badge variant="secondary">
                              {getComponentCount(stack.components)} items
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Visibility:</span>
                            <Badge variant={stack.is_public ? "default" : "outline"}>
                              {stack.is_public ? "Public" : "Private"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground border-t pt-3">
                          Created {new Date(stack.created_at).toLocaleDateString()}
                          {stack.deployed_at && (
                            <span className="ml-4">
                              • Deployed {new Date(stack.deployed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {expandedStack === stack.id && (
                          <div className="border-t pt-4 animate-fade-in">
                            <StackDeployment
                              stackId={stack.id}
                              title={stack.title}
                              deploymentStatus={stack.deployment_status || 'draft'}
                              isPublic={stack.is_public}
                              deployedAt={stack.deployed_at || undefined}
                              deploymentUrl={stack.deployment_url || undefined}
                              onStatusChange={fetchStacks}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Complete Stacks Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-6 w-6" />
              Complete Stacks
            </h2>
            <Suspense fallback={<StacksLoadingFallback />}>
              <StackResults 
                searchQuery=""
                filters={{ types: [], sources: [], complexity: [], industries: [] }}
                userPreferences={preferences}
              />
            </Suspense>
          </div>

          {/* AI Recommended Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-6 w-6" />
              AI Recommended
            </h2>
            <Suspense fallback={<StacksLoadingFallback />}>
              <RecommendedStacks 
                userPreferences={preferences}
                searchQuery=""
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

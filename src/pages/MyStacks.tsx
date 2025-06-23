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
  Star,
  Share2,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  FolderOpen
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useMyStacks, SavedStack } from "@/hooks/useMyStacks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Lazy load the recommendation components
const RecommendedStacks = lazy(() => import("@/components/discovery/RecommendedStacks").then(m => ({ default: m.RecommendedStacks })));
const StackResults = lazy(() => import("@/components/discovery/StackResults").then(m => ({ default: m.StackResults })));

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
  const { stacks, loading, fetchStacks } = useMyStacks();
  const [expandedStack, setExpandedStack] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const deleteStack = async (stackId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('saved_stacks')
        .delete()
        .eq('id', stackId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      fetchStacks(user.id);

      toast({
        title: "Stack deleted",
        description: "The stack has been successfully deleted.",
      });

    } catch (error) {
      console.error('Error deleting stack:', error);
      toast({
        title: "Error",
        description: "Failed to delete the stack.",
        variant: "destructive",
      });
    }
  };

  const getComponentCount = (stackData: any) => {
    if (!stackData || !Array.isArray(stackData.components)) return 0;
    return stackData.components.length;
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
    navigate("/chat?new=true");
  };

  const handleDeploy = (stack: SavedStack) => {
    navigate('/connections', { state: { stack } });
  };

  const getSortedStacks = (stacksToSort: SavedStack[]) => {
    switch (sortBy) {
      case 'recent':
        return [...stacksToSort].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return [...stacksToSort].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'alphabetical':
        return [...stacksToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'components':
        return [...stacksToSort].sort((a, b) => getComponentCount(b.stack_data) - getComponentCount(a.stack_data));
      default:
        return stacksToSort;
    }
  };

  const generateShareableUrl = (stack: SavedStack) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/stack/${stack.id}`;
  };

  const generateShareText = (stack: SavedStack) => {
    const componentCount = getComponentCount(stack.stack_data);
    return `🚀 Check out this AI stack I built: "${stack.title}" - ${stack.description} (${componentCount} components)

✨ Build your own AI automation stack in minutes with ZingGPT! No coding required.
👉 Try it free: ${window.location.origin}

#ZingGPT #AIStack #Automation #NoCode #AITools`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      const shareableUrl = generateShareableUrl({ id: 'sample' } as SavedStack);
      const promotionalText = `🚀 Discover powerful AI automation stacks!

✨ Build your own AI stack in minutes with ZingGPT - No coding required!
👉 Try it free: ${window.location.origin}

${text}

#ZingGPT #AIStack #Automation #NoCode`;
      
      await navigator.clipboard.writeText(promotionalText);
      toast({
        title: "Copied to clipboard",
        description: "Share link with ZingGPT promotion has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const shareToSocial = (platform: string, stack: SavedStack) => {
    const url = generateShareableUrl(stack);
    const text = generateShareText(stack);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        const fbText = `🚀 Check out this AI stack: "${stack.title}" - ${stack.description}

Build your own AI automation stack with ZingGPT!`;
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(fbText)}`;
        break;
      case 'linkedin':
        const linkedinText = `🚀 Check out this powerful AI stack: "${stack.title}"

${stack.description}

Built with ZingGPT - the easiest way to create AI automation stacks without coding. Try it free!`;
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(linkedinText)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header onStartFresh={handleStartFresh} />
        <div className="container mx-auto px-4 py-8">
          <StacksLoadingFallback />
        </div>
      </div>
    );
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

        <Tabs defaultValue="my-stacks" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="my-stacks">
                <Folder className="mr-2 h-4 w-4" />
                My Saved Stacks
              </TabsTrigger>
              <TabsTrigger value="complete-stacks">
                <Layers className="mr-2 h-4 w-4" />
                Complete Stacks
              </TabsTrigger>
              <TabsTrigger value="ai-recommended">
                <Star className="mr-2 h-4 w-4" />
                AI Recommended
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="my-stacks" className="mt-6">
            {/* My Saved Stacks Section */}
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
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-background">
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <FolderOpen className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">No Saved Stacks Yet</h2>
                <p className="text-muted-foreground mb-4 max-w-md">
                  It looks like you haven't saved any AI stacks. Start by exploring recommendations or creating a new stack.
                </p>
                <Button onClick={handleStartFresh}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Recommendations
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => copyToClipboard(generateShareableUrl(stack))}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => shareToSocial('twitter', stack)}>
                                <Twitter className="h-4 w-4 mr-2" />
                                Share on Twitter
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareToSocial('linkedin', stack)}>
                                <Linkedin className="h-4 w-4 mr-2" />
                                Share on LinkedIn
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => shareToSocial('facebook', stack)}>
                                <Facebook className="h-4 w-4 mr-2" />
                                Share on Facebook
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => alert("Manage components for " + stack.title)}>
                                <Layers className="mr-2 h-4 w-4" />
                                Manage Components
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => alert("Pause deployment for " + stack.title)}>
                                <Play className="mr-2 h-4 w-4" />
                                {stack.deployment_status === 'deployed' ? 'Pause' : 'Resume'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => deleteStack(stack.id)} className="text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Components:</span>
                            <Badge variant="secondary">
                              {getComponentCount(stack.stack_data)} items
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
                              isPublic={stack.is_public || false}
                              deployedAt={stack.deployed_at || undefined}
                              deploymentUrl={stack.deployment_url || undefined}
                              onStatusChange={() => fetchStacks(user.id)}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="complete-stacks" className="mt-6">
            {/* Complete Stacks Section */}
            <Suspense fallback={<StacksLoadingFallback />}>
              <StackResults 
                searchQuery=""
                filters={{ types: [], sources: [], complexity: [], industries: [] }}
                userPreferences={preferences}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="ai-recommended" className="mt-6">
            {/* AI Recommended Section */}
            <Suspense fallback={<StacksLoadingFallback />}>
              <RecommendedStacks 
                userPreferences={preferences}
                searchQuery=""
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

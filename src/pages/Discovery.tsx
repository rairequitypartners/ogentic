
import { useState, useEffect, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { AIEnhancedSearch } from "@/components/discovery/AIEnhancedSearch";
import { DiscoveryFilters } from "@/components/discovery/DiscoveryFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolCardSkeleton, StackCardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";

// Lazy load heavy components
const StackResults = lazy(() => import("@/components/discovery/StackResults").then(m => ({ default: m.StackResults })));
const ToolsLibrary = lazy(() => import("@/components/discovery/ToolsLibrary").then(m => ({ default: m.ToolsLibrary })));
const RecommendedStacks = lazy(() => import("@/components/discovery/RecommendedStacks").then(m => ({ default: m.RecommendedStacks })));

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

// Loading components for each tab
const ToolsLoadingFallback = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2 text-primary">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      <span>Loading tools...</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const StacksLoadingFallback = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2 text-primary">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      <span>Loading stacks...</span>
    </div>
    {[...Array(2)].map((_, i) => (
      <StackCardSkeleton key={i} />
    ))}
  </div>
);

const Discovery = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    sources: [],
    complexity: [],
    industries: []
  });
  const [activeTab, setActiveTab] = useState("tools");

  // Get initial search query from URL parameters
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL with search query
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gradient">AI Stack Discovery</h1>
            <p className="text-xl text-muted-foreground">
              Discover, filter, and explore the best AI tools, prompts, models, and complete stacks using natural language
            </p>
            
            <AIEnhancedSearch 
              onSearch={handleSearch}
              onFiltersChange={handleFilterChange}
              userPreferences={preferences}
              context={activeTab as any}
              initialQuery={searchQuery}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <DiscoveryFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                userPreferences={preferences}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tools">Individual Tools</TabsTrigger>
                  <TabsTrigger value="stacks">Complete Stacks</TabsTrigger>
                  <TabsTrigger value="recommended">AI Recommended</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tools" className="mt-6">
                  <Suspense fallback={<ToolsLoadingFallback />}>
                    <ToolsLibrary 
                      searchQuery={searchQuery}
                      filters={filters}
                    />
                  </Suspense>
                </TabsContent>
                
                <TabsContent value="stacks" className="mt-6">
                  <Suspense fallback={<StacksLoadingFallback />}>
                    <StackResults 
                      searchQuery={searchQuery}
                      filters={filters}
                      userPreferences={preferences}
                    />
                  </Suspense>
                </TabsContent>
                
                <TabsContent value="recommended" className="mt-6">
                  <Suspense fallback={<StacksLoadingFallback />}>
                    <RecommendedStacks 
                      userPreferences={preferences}
                      searchQuery={searchQuery}
                    />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discovery;

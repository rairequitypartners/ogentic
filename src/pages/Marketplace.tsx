
import { useState, useEffect, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { AIEnhancedSearch } from "@/components/discovery/AIEnhancedSearch";
import { DiscoveryFilters } from "@/components/discovery/DiscoveryFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolCardSkeleton, StackCardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const ToolsLibrary = lazy(() => import("@/components/discovery/ToolsLibrary").then(m => ({ default: m.ToolsLibrary })));

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

const ToolsLoadingFallback = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2 text-primary">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      <span>Loading marketplace...</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

const Marketplace = () => {
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

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
            <h1 className="text-4xl font-bold text-gradient">AI Marketplace</h1>
            <p className="text-xl text-muted-foreground">
              Discover, filter, and explore thousands of AI tools, prompts, models, and agents
            </p>
            
            <AIEnhancedSearch 
              onSearch={handleSearch}
              onFiltersChange={handleFilterChange}
              userPreferences={preferences}
              context="tools"
              initialQuery={searchQuery}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <DiscoveryFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                userPreferences={preferences}
              />
            </div>

            <div className="lg:col-span-3">
              <Suspense fallback={<ToolsLoadingFallback />}>
                <ToolsLibrary 
                  searchQuery={searchQuery}
                  filters={filters}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;

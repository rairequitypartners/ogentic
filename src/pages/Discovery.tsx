
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { DiscoveryFilters } from "@/components/discovery/DiscoveryFilters";
import { StackResults } from "@/components/discovery/StackResults";
import { ToolsLibrary } from "@/components/discovery/ToolsLibrary";
import { RecommendedStacks } from "@/components/discovery/RecommendedStacks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

const Discovery = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    sources: [],
    complexity: [],
    industries: []
  });
  const [activeTab, setActiveTab] = useState("stacks");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
              Discover, filter, and explore the best AI tools, prompts, models, and complete stacks for your needs
            </p>
            
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for AI tools, prompts, models, or describe your use case..."
              className="max-w-4xl"
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
                  <TabsTrigger value="stacks">Complete Stacks</TabsTrigger>
                  <TabsTrigger value="tools">Individual Tools</TabsTrigger>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stacks" className="mt-6">
                  <StackResults 
                    searchQuery={searchQuery}
                    filters={filters}
                    userPreferences={preferences}
                  />
                </TabsContent>
                
                <TabsContent value="tools" className="mt-6">
                  <ToolsLibrary 
                    searchQuery={searchQuery}
                    filters={filters}
                  />
                </TabsContent>
                
                <TabsContent value="recommended" className="mt-6">
                  <RecommendedStacks 
                    userPreferences={preferences}
                    searchQuery={searchQuery}
                  />
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

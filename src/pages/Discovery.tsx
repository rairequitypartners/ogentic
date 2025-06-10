
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { AIEnhancedSearch } from "@/components/discovery/AIEnhancedSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Sparkles, ArrowRight, Search, Layers, Users } from "lucide-react";

const Discovery = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Navigate to marketplace with search query
      navigate(`/marketplace?q=${encodeURIComponent(query)}`);
    }
  };

  const handleFilterChange = () => {
    // Filters are now handled in marketplace
  };

  const quickSearches = [
    "Customer support automation",
    "SEO content generation", 
    "Code review assistant",
    "Email marketing automation",
    "Sales lead qualification",
    "Document analysis"
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center py-20 space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Sparkles className="h-12 w-12 text-primary" />
              <h1 className="text-6xl font-bold text-gradient">Ogentic</h1>
            </div>
            
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover AI tools and build custom stacks with natural language
            </p>
            
            <div className="max-w-2xl mx-auto">
              <AIEnhancedSearch 
                onSearch={handleSearch}
                onFiltersChange={handleFilterChange}
                userPreferences={preferences}
                context="stacks"
                initialQuery={searchQuery}
              />
            </div>

            {/* Quick Searches */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="px-4 py-2 text-sm bg-background border rounded-full hover:bg-accent transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
            <Card className="card-hover cursor-pointer" onClick={() => navigate("/marketplace")}>
              <CardContent className="p-6 text-center space-y-4">
                <Search className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-lg font-semibold">Browse Marketplace</h3>
                <p className="text-sm text-muted-foreground">
                  Explore thousands of AI tools, prompts, and models
                </p>
                <Button variant="ghost" className="w-full">
                  Explore <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover cursor-pointer" onClick={() => navigate("/my-stacks")}>
              <CardContent className="p-6 text-center space-y-4">
                <Layers className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-lg font-semibold">My Stacks</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage your saved AI stacks
                </p>
                <Button variant="ghost" className="w-full">
                  View Stacks <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover cursor-pointer" onClick={() => navigate("/")}>
              <CardContent className="p-6 text-center space-y-4">
                <Users className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-lg font-semibold">Build Custom Stack</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with AI to create personalized solutions
                </p>
                <Button variant="ghost" className="w-full">
                  Start Building <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discovery;

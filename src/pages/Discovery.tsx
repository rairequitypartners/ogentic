import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FiltersSidebar } from "@/components/chat/FiltersSidebar";
import { RealtimeStackResults } from "@/components/RealtimeStackResults";
import { SuccessScreen } from "@/components/SuccessScreen";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const Discovery = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [searchParams] = useSearchParams();
  const [currentQuery, setCurrentQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedStackId, setSavedStackId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    sources: [] as string[],
    complexity: [] as string[],
    industries: [] as string[]
  });

  const handleStartFresh = () => {
    setCurrentQuery("");
    setIsGenerating(false);
    setShowSuccess(false);
    setSavedStackId(null);
    setFilters({
      types: [],
      sources: [],
      complexity: [],
      industries: []
    });
  };

  const handleSaveSuccess = (stackId: string) => {
    setSavedStackId(stackId);
    setShowSuccess(true);
  };

  const handleSelectStack = (stack: any) => {
    console.log('Selected stack:', stack);
    // Handle stack selection logic here
  };

  const handleExploreMore = () => {
    handleStartFresh();
  };

  const handleRefineStack = () => {
    setShowSuccess(false);
    // Keep the current stack data for refinement
  };

  useEffect(() => {
    const fresh = searchParams.get('fresh');
    if (fresh === 'true') {
      handleStartFresh();
    }
  }, [searchParams]);

  if (showSuccess && savedStackId) {
    // Mock deployment results for the success screen
    const mockDeployments = [
      {
        platform: "Deployed to Cloud",
        status: 'success' as const,
        message: "Your AI stack has been successfully deployed and is ready to use."
      }
    ];

    return (
      <>
        <Header onStartFresh={handleStartFresh} />
        <SuccessScreen 
          deployments={mockDeployments}
          onExploreMore={handleExploreMore}
          onRefineStack={handleRefineStack}
        />
      </>
    );
  }

  return (
    <>
      <Header onStartFresh={handleStartFresh} />
      <div className="flex min-h-screen bg-background pt-16">
        <FiltersSidebar 
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <div className="flex-1 flex">
          <div className="flex-1 max-w-4xl mx-auto">
            <ChatInterface />
          </div>
          
          <div className="w-80 border-l border-border bg-muted/30 overflow-hidden">
            <RealtimeStackResults 
              query={currentQuery}
              onSelectStack={handleSelectStack}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Discovery;

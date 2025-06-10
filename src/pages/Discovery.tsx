
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

  useEffect(() => {
    const fresh = searchParams.get('fresh');
    if (fresh === 'true') {
      handleStartFresh();
    }
  }, [searchParams]);

  if (showSuccess && savedStackId) {
    return (
      <>
        <Header onStartFresh={handleStartFresh} />
        <SuccessScreen 
          stackId={savedStackId}
          onStartFresh={handleStartFresh}
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
            <ChatInterface 
              onQueryChange={setCurrentQuery}
              onGeneratingChange={setIsGenerating}
              userPreferences={preferences}
              filters={filters}
              onFiltersToggle={() => setShowFilters(!showFilters)}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
          
          <div className="w-80 border-l border-border bg-muted/30 overflow-hidden">
            <RealtimeStackResults 
              query={currentQuery}
              isGenerating={isGenerating}
              filters={filters}
              userPreferences={preferences}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Discovery;

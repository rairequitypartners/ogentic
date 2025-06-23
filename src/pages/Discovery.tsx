import { useState } from 'react';
import { AIEnhancedSearch } from '@/components/discovery/AIEnhancedSearch';
import { DiscoveryFilters } from '@/components/discovery/DiscoveryFilters';
import { RecommendedStacks } from '@/components/discovery/RecommendedStacks';
import { StackResults } from '@/components/discovery/StackResults';
import { ToolsLibrary } from '@/components/discovery/ToolsLibrary';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { RealtimeStackResults } from '@/components/RealtimeStackResults';
import { DeployPanel } from '@/components/DeployPanel';

// Main component for the Discovery page
const Discovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [] as string[],
    sources: [] as string[],
    complexity: [] as string[],
    industries: [] as string[]
  });
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedStack, setSelectedStack] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const handleStartFresh = () => {
    setSearchQuery('');
    setFilters({
      types: [],
      sources: [],
      complexity: [],
      industries: []
    });
    setSelectedStack(null);
  };

  const handleSelectStack = (stack: any) => {
    setSelectedStack(stack);
  };

  const handleDeploy = (selectedOptions: string[]) => {
    // console.log('Deploying to:', selectedOptions);
    setIsDeploying(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/4 p-4 border-r overflow-y-auto">
          <AIEnhancedSearch onSearch={handleSearch} onFiltersChange={handleFiltersChange} />
          <Button onClick={handleStartFresh} variant="outline" className="w-full mt-4">
            Start Fresh
          </Button>
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Real-time Stack Results</h2>
            <RealtimeStackResults query={searchQuery} onSelectStack={handleSelectStack} />
          </div>
        </div>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">AI Solution Discovery</h1>
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Recommendations
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="recommended">Recommended Stacks</TabsTrigger>
              <TabsTrigger value="tools">Tools Library</TabsTrigger>
            </TabsList>
            <TabsContent value="recommended">
              <RecommendedStacks 
                searchQuery={searchQuery} 
                userPreferences={{}}
                onSelectStack={handleSelectStack} 
              />
            </TabsContent>
            <TabsContent value="tools">
              <ToolsLibrary searchQuery={searchQuery} filters={filters} />
            </TabsContent>
          </Tabs>
          {selectedStack && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Selected Stack Details</h2>
              <StackResults searchQuery={searchQuery} filters={filters} userPreferences={{}} />
            </div>
          )}
        </main>
        {isDeploying && (
          <div className="w-1/3 p-4 border-l overflow-y-auto">
            <DeployPanel onDeploy={handleDeploy} onCancel={() => setIsDeploying(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;

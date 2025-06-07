
import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { StackCard } from "@/components/StackCard";
import { DeployPanel } from "@/components/DeployPanel";
import { SuccessScreen } from "@/components/SuccessScreen";
import { Sparkles, Zap, Target } from "lucide-react";

type AppState = 'search' | 'results' | 'deploy' | 'success';

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStack, setSelectedStack] = useState<any>(null);
  const [deploymentResults, setDeploymentResults] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Mock AI stack generation based on query
    const mockStack = generateMockStack(query);
    setSelectedStack(mockStack);
    setCurrentState('results');
  };

  const generateMockStack = (query: string): any => {
    // This would be replaced with actual AI/API call
    const components: StackComponent[] = [
      {
        type: 'prompt',
        name: 'Customer Support Email Template',
        description: 'Professional, empathetic email responses for common customer issues',
        reason: 'This prompt template is specifically designed for customer support scenarios, incorporating best practices for tone, clarity, and problem resolution. It\'s been tested across 500+ businesses.',
        source: 'OpenAI',
        featured: true
      },
      {
        type: 'model',
        name: 'GPT-4o',
        description: 'Advanced language model optimized for business communication',
        reason: 'GPT-4o excels at understanding context and maintaining consistent tone across email threads. Its enhanced reasoning capabilities make it perfect for complex customer issues.',
        source: 'OpenAI'
      },
      {
        type: 'tool',
        name: 'Zapier Gmail Integration',
        description: 'Automated email processing and response system',
        reason: 'This integration allows seamless connection between your Gmail account and AI responses, with built-in filtering and approval workflows to ensure quality control.',
        source: 'Zapier'
      },
      {
        type: 'agent',
        name: 'Support Ticket Analyzer',
        description: 'AI agent that categorizes and prioritizes incoming support requests',
        reason: 'This agent uses machine learning to understand urgency levels and route tickets to appropriate team members, reducing response time by 60% on average.',
        source: 'Custom'
      }
    ];

    return {
      title: 'Customer Support Automation Stack',
      description: 'Complete AI-powered solution for automating customer support emails with intelligent categorization and personalized responses.',
      components
    };
  };

  const handleDeploy = () => {
    setCurrentState('deploy');
  };

  const handleDeployConfirm = (selectedOptions: string[]) => {
    // Mock deployment results
    const results = selectedOptions.map(option => ({
      platform: option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' '),
      status: 'success' as const,
      message: `Successfully deployed stack components to ${option.replace('-', ' ')}`
    }));
    
    setDeploymentResults(results);
    setCurrentState('success');
  };

  const handleDeployCancel = () => {
    setCurrentState('results');
  };

  const handleExploreMore = () => {
    setCurrentState('search');
    setSearchQuery('');
    setSelectedStack(null);
  };

  const handleRefineStack = () => {
    setCurrentState('results');
  };

  const renderContent = () => {
    switch (currentState) {
      case 'search':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl text-center space-y-8">
              <div className="space-y-4 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gradient mb-4">
                  Find the Best AI Stack for Any Task — Instantly
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  Describe what you want to automate — we'll return the best tools, prompts, agents, and models.
                </p>
              </div>
              
              <SearchBar onSearch={handleSearch} className="animate-fade-in animation-delay-300" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in animation-delay-600">
                <div className="p-6 rounded-xl bg-card border card-hover">
                  <Sparkles className="h-8 w-8 text-primary mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">AI-Powered Discovery</h3>
                  <p className="text-sm text-muted-foreground">
                    Our intelligent system analyzes your needs and recommends the perfect combination of tools and prompts.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border card-hover">
                  <Zap className="h-8 w-8 text-primary mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">One-Click Deployment</h3>
                  <p className="text-sm text-muted-foreground">
                    Deploy your AI stacks directly to Notion, Zapier, Slack, and other tools you already use.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border card-hover">
                  <Target className="h-8 w-8 text-primary mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">Curated & Tested</h3>
                  <p className="text-sm text-muted-foreground">
                    Every recommendation is carefully vetted and tested by our community of AI experts and practitioners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="min-h-screen bg-background p-4 pt-16">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Results for: "{searchQuery}"</h2>
                <p className="text-muted-foreground">Here's the perfect AI stack for your needs</p>
              </div>
              
              {selectedStack && (
                <StackCard
                  title={selectedStack.title}
                  description={selectedStack.description}
                  components={selectedStack.components}
                  onDeploy={handleDeploy}
                  onEdit={(component) => console.log('Edit:', component)}
                  onReplace={(component) => console.log('Replace:', component)}
                />
              )}
            </div>
          </div>
        );

      case 'deploy':
        return (
          <div className="min-h-screen bg-background p-4 pt-16">
            <div className="max-w-6xl mx-auto">
              {selectedStack && (
                <StackCard
                  title={selectedStack.title}
                  description={selectedStack.description}
                  components={selectedStack.components}
                  onDeploy={handleDeploy}
                />
              )}
            </div>
            <DeployPanel 
              onDeploy={handleDeployConfirm}
              onCancel={handleDeployCancel}
            />
          </div>
        );

      case 'success':
        return (
          <SuccessScreen
            deployments={deploymentResults}
            onExploreMore={handleExploreMore}
            onRefineStack={handleRefineStack}
          />
        );

      default:
        return null;
    }
  };

  return renderContent();
};

export default Index;

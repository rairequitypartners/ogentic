import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { StackCard } from "@/components/StackCard";
import { RealtimeStackResults } from "@/components/RealtimeStackResults";
import { DeployPanel } from "@/components/DeployPanel";
import { SuccessScreen } from "@/components/SuccessScreen";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useStacks } from "@/hooks/useStacks";
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
  const [currentStackId, setCurrentStackId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { saveStack, deployStack, saveDeployment, saving, deploying } = useStacks();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    // Mock AI stack generation based on query
    const mockStack = generateMockStack(query);
    setSelectedStack(mockStack);
    setCurrentState('results');

    // Auto-save stack if user is logged in
    if (user && mockStack) {
      const stackId = await saveStack(query, mockStack);
      setCurrentStackId(stackId);
    }
  };

  const generateMockStack = (query: string): any => {
    // Enhanced mock stack generation with more variety based on query
    const isCustomerSupport = query.toLowerCase().includes('customer') || query.toLowerCase().includes('support');
    const isMarketing = query.toLowerCase().includes('marketing') || query.toLowerCase().includes('content');
    const isAnalytics = query.toLowerCase().includes('data') || query.toLowerCase().includes('analytics');

    let components: StackComponent[] = [];
    let title = '';
    let description = '';

    if (isCustomerSupport) {
      title = 'Customer Support Automation Stack';
      description = 'Complete AI-powered solution for automating customer support emails with intelligent categorization and personalized responses.';
      components = [
        {
          type: 'prompt',
          name: 'Customer Support Email Template',
          description: 'Professional, empathetic email responses for common customer issues',
          reason: 'This prompt template is specifically designed for customer support scenarios, incorporating best practices for tone, clarity, and problem resolution.',
          source: 'OpenAI',
          featured: true
        },
        {
          type: 'model',
          name: 'GPT-4o',
          description: 'Advanced language model optimized for business communication',
          reason: 'GPT-4o excels at understanding context and maintaining consistent tone across email threads.',
          source: 'OpenAI'
        },
        {
          type: 'tool',
          name: 'Zapier Gmail Integration',
          description: 'Automated email processing and response system',
          reason: 'This integration allows seamless connection between your Gmail account and AI responses.',
          source: 'Zapier'
        },
        {
          type: 'agent',
          name: 'Support Ticket Analyzer',
          description: 'AI agent that categorizes and prioritizes incoming support requests',
          reason: 'This agent uses machine learning to understand urgency levels and route tickets appropriately.',
          source: 'Custom'
        }
      ];
    } else if (isMarketing) {
      title = 'Content Marketing Automation Stack';
      description = 'Comprehensive AI toolkit for creating, scheduling, and optimizing marketing content across platforms.';
      components = [
        {
          type: 'prompt',
          name: 'Social Media Content Generator',
          description: 'Creates engaging posts tailored to different social platforms',
          reason: 'This prompt understands platform-specific best practices and audience preferences.',
          source: 'Custom',
          featured: true
        },
        {
          type: 'model',
          name: 'Claude-3 Haiku',
          description: 'Fast, creative language model for content generation',
          reason: 'Claude excels at creative writing and maintaining brand voice consistency.',
          source: 'Anthropic'
        },
        {
          type: 'tool',
          name: 'Buffer Social Scheduler',
          description: 'Automated content scheduling and publishing',
          reason: 'Buffer integrates with all major social platforms and provides analytics.',
          source: 'Buffer'
        },
        {
          type: 'agent',
          name: 'Content Performance Optimizer',
          description: 'AI agent that analyzes and optimizes content performance',
          reason: 'This agent learns from your content performance to suggest improvements.',
          source: 'Custom'
        }
      ];
    } else {
      title = 'Business Process Automation Stack';
      description = 'Versatile AI stack for automating various business processes and workflows.';
      components = [
        {
          type: 'prompt',
          name: 'Business Process Analyzer',
          description: 'Analyzes and optimizes business workflows',
          reason: 'This prompt helps identify inefficiencies and suggests automation opportunities.',
          source: 'Custom',
          featured: true
        },
        {
          type: 'model',
          name: 'GPT-4',
          description: 'Versatile language model for general business tasks',
          reason: 'GPT-4 provides excellent reasoning capabilities for complex business scenarios.',
          source: 'OpenAI'
        },
        {
          type: 'tool',
          name: 'Notion Database Integration',
          description: 'Automated data organization and workflow management',
          reason: 'Notion provides flexible database structures perfect for business process tracking.',
          source: 'Notion'
        },
        {
          type: 'agent',
          name: 'Workflow Automation Agent',
          description: 'AI agent that monitors and executes business processes',
          reason: 'This agent can handle routine tasks and escalate complex issues to humans.',
          source: 'Custom'
        }
      ];
    }

    return { title, description, components };
  };

  const handleDeploy = () => {
    setCurrentState('deploy');
  };

  const handleDeployConfirm = async (selectedOptions: string[]) => {
    if (currentStackId) {
      // Use the new deployStack function instead of mock deployment
      const success = await deployStack(currentStackId, selectedOptions);
      
      if (success) {
        // Mock deployment results for the success screen
        const results = selectedOptions.map(option => ({
          platform: option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' '),
          status: 'success' as const,
          message: `Successfully deployed stack components to ${option.replace('-', ' ')}`
        }));
        
        setDeploymentResults(results);
        setCurrentState('success');
      } else {
        // Stay on deploy screen if deployment failed
        setCurrentState('deploy');
      }
    } else {
      // Fallback to old behavior if no stack ID
      const results = selectedOptions.map(option => ({
        platform: option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' '),
        status: 'success' as const,
        message: `Successfully deployed stack components to ${option.replace('-', ' ')}`
      }));
      
      setDeploymentResults(results);

      if (user && currentStackId) {
        await saveDeployment(currentStackId, selectedOptions, results);
      }

      setCurrentState('success');
    }
  };

  const handleDeployCancel = () => {
    setCurrentState('results');
  };

  const handleExploreMore = () => {
    setCurrentState('search');
    setSearchQuery('');
    setSelectedStack(null);
    setCurrentStackId(null);
  };

  const handleRefineStack = () => {
    setCurrentState('results');
  };

  const handleSelectCommunityStack = (stack: any) => {
    setSelectedStack(stack);
    // Don't auto-save community stacks, let user decide
  };

  const renderContent = () => {
    switch (currentState) {
      case 'search':
        return (
          <>
            <Header />
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
                    <h3 className="font-semibold mb-2">Real-Time Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      See live community recommendations and updates as other users create and share new AI stacks.
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
          </>
        );

      case 'results':
        return (
          <>
            <Header />
            <div className="min-h-screen bg-background p-4 pt-16">
              <div className="max-w-6xl mx-auto space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Results for: "{searchQuery}"</h2>
                  <p className="text-muted-foreground">Here's the perfect AI stack for your needs</p>
                  {saving && (
                    <p className="text-sm text-primary mt-2">Saving stack to your collection...</p>
                  )}
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

                <RealtimeStackResults 
                  query={searchQuery}
                  onSelectStack={handleSelectCommunityStack}
                />
              </div>
            </div>
          </>
        );

      case 'deploy':
        return (
          <>
            <Header />
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
          </>
        );

      case 'success':
        return (
          <>
            <Header />
            <SuccessScreen
              deployments={deploymentResults}
              onExploreMore={handleExploreMore}
              onRefineStack={handleRefineStack}
            />
          </>
        );

      default:
        return null;
    }
  };

  return renderContent();
};

export default Index;

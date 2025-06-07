
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, MessageSquare, Database, BookOpen, Folder } from "lucide-react";

interface DeployOption {
  id: string;
  name: string;
  icon: any;
  description: string;
  category: 'documents' | 'automation' | 'communication' | 'storage';
}

interface DeployPanelProps {
  onDeploy: (selectedOptions: string[]) => void;
  onCancel: () => void;
}

const deployOptions: DeployOption[] = [
  {
    id: 'notion',
    name: 'Notion',
    icon: BookOpen,
    description: 'Save prompts and workflows to your Notion workspace',
    category: 'documents'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    icon: FileText,
    description: 'Export prompts and documentation to Google Docs',
    category: 'documents'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    icon: Zap,
    description: 'Create automated workflows with your AI stack',
    category: 'automation'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    description: 'Deploy AI agents to your Slack workspace',
    category: 'communication'
  },
  {
    id: 'airtable',
    name: 'Airtable',
    icon: Database,
    description: 'Store and organize your AI stacks in Airtable',
    category: 'storage'
  },
  {
    id: 'my-stacks',
    name: 'My Stacks',
    icon: Folder,
    description: 'Save to your personal collection for later use',
    category: 'storage'
  }
];

const categoryColors = {
  documents: 'bg-blue-100 text-blue-800',
  automation: 'bg-green-100 text-green-800',
  communication: 'bg-purple-100 text-purple-800',
  storage: 'bg-orange-100 text-orange-800'
};

export const DeployPanel = ({ onDeploy, onCancel }: DeployPanelProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['my-stacks']);
  const [isDeploying, setIsDeploying] = useState(false);

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    onDeploy(selectedOptions);
    setIsDeploying(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient">Deploy Your AI Stack</CardTitle>
          <p className="text-muted-foreground">Choose where to deploy your prompts, tools, and workflows</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deployOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOptions.includes(option.id);
              
              return (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 mt-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{option.name}</h3>
                        <Badge className={categoryColors[option.category]} variant="secondary">
                          {option.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleDeploy}
              disabled={selectedOptions.length === 0 || isDeploying}
              className="flex-1 py-6 text-lg font-semibold button-glow"
            >
              {isDeploying ? 'Deploying...' : `Deploy to ${selectedOptions.length} platform${selectedOptions.length !== 1 ? 's' : ''}`}
            </Button>
            <Button 
              onClick={onCancel}
              variant="outline"
              className="px-8 py-6"
              disabled={isDeploying}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

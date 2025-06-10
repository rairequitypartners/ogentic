
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Zap, 
  Database, 
  Workflow, 
  BookOpen,
  Check,
  Loader2 
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  useCase: string;
  source: string;
  type: string;
  url?: string;
  featured?: boolean;
  reason?: string;
  setupTime?: string;
}

interface DeployOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  available: boolean;
}

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
  onDeploy: (tool: Tool, platform: string) => void;
}

const deployOptions: DeployOption[] = [
  {
    id: 'notion',
    name: 'Notion',
    description: 'Export to Notion workspace',
    icon: FileText,
    color: 'bg-gray-100 text-gray-800',
    available: true
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: 'Create Google Doc template',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800',
    available: true
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Create automation template',
    icon: Zap,
    color: 'bg-orange-100 text-orange-800',
    available: true
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Setup database template',
    icon: Database,
    color: 'bg-green-100 text-green-800',
    available: true
  },
  {
    id: 'my-stacks',
    name: 'My Stacks',
    description: 'Save to personal collection',
    icon: Workflow,
    color: 'bg-purple-100 text-purple-800',
    available: true
  }
];

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  tool,
  onDeploy
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState<string | null>(null);

  const handleDeploy = async (platformId: string) => {
    if (!tool) return;
    
    setDeploying(true);
    setSelectedPlatform(platformId);
    
    // Simulate deploy process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onDeploy(tool, platformId);
    setDeployed(platformId);
    setDeploying(false);
    
    // Auto close after success
    setTimeout(() => {
      onClose();
      setDeployed(null);
      setSelectedPlatform(null);
    }, 1500);
  };

  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Deploy {tool.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-1">{tool.name}</h4>
            <p className="text-xs text-muted-foreground">{tool.description}</p>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Choose deployment platform:</h5>
            
            {deployOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedPlatform === option.id;
              const isDeployed = deployed === option.id;
              const isDeploying = deploying && isSelected;
              
              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !deploying && handleDeploy(option.id)}
                  disabled={!option.available || deploying}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${option.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{option.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isDeploying && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      {isDeployed && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      {!option.available && (
                        <Badge variant="secondary" className="text-xs">
                          Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={deploying}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

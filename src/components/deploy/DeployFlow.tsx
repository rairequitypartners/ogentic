
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Zap, 
  Database, 
  Workflow, 
  BookOpen,
  Check,
  Loader2,
  ArrowRight,
  Sparkles,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  source?: string;
  featured?: boolean;
}

interface Stack {
  title: string;
  description: string;
  components: StackComponent[];
}

interface DeployOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  available: boolean;
  benefit: string;
}

interface DeployFlowProps {
  isOpen: boolean;
  onClose: () => void;
  stack: Stack | null;
  onDeployComplete: (destination: string) => void;
}

const deployOptions: DeployOption[] = [
  {
    id: 'notion',
    name: 'Notion',
    description: 'Ready-to-use templates and prompts',
    icon: FileText,
    color: 'bg-gray-100 text-gray-800',
    available: true,
    benefit: 'Get pre-built Notion templates with embedded prompts'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: 'Document templates with prompts',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800',
    available: true,
    benefit: 'Copy-paste ready document templates'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automation workflow templates',
    icon: Zap,
    color: 'bg-orange-100 text-orange-800',
    available: true,
    benefit: 'Pre-configured Zap templates with API calls'
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Database setup with workflows',
    icon: Database,
    color: 'bg-green-100 text-green-800',
    available: true,
    benefit: 'Ready-to-use base with automation triggers'
  },
  {
    id: 'my-stacks',
    name: 'My Stacks',
    description: 'Save for later optimization',
    icon: Workflow,
    color: 'bg-purple-100 text-purple-800',
    available: true,
    benefit: 'Track and optimize this stack over time'
  }
];

type DeployStep = 'destination' | 'generating' | 'success';

export const DeployFlow: React.FC<DeployFlowProps> = ({
  isOpen,
  onClose,
  stack,
  onDeployComplete
}) => {
  const [currentStep, setCurrentStep] = useState<DeployStep>('destination');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [deployOutput, setDeployOutput] = useState<any>(null);
  const { toast } = useToast();

  const handleDestinationSelect = (destinationId: string) => {
    setSelectedDestination(destinationId);
  };

  const handleDeploy = async () => {
    if (!selectedDestination || !stack) return;
    
    setCurrentStep('generating');
    
    // Simulate deployment generation
    setTimeout(() => {
      const output = generateDeployOutput(stack, selectedDestination);
      setDeployOutput(output);
      setCurrentStep('success');
      onDeployComplete(selectedDestination);
    }, 2500);
  };

  const generateDeployOutput = (stack: Stack, destination: string) => {
    const baseOutput = {
      destination,
      stackTitle: stack.title,
      components: stack.components.length,
      setupSteps: []
    };

    switch (destination) {
      case 'notion':
        return {
          ...baseOutput,
          deliverables: [
            'Notion template with embedded prompts',
            'Database schema for tracking results',
            'Pre-filled prompt library'
          ],
          setupSteps: [
            'Import the Notion template to your workspace',
            'Customize the prompts for your specific use case',
            'Set up automation triggers (optional)',
            'Test the workflow with sample data'
          ],
          readyToUse: true,
          actionUrl: 'https://notion.so/templates/ai-stack-template'
        };
      
      case 'zapier':
        return {
          ...baseOutput,
          deliverables: [
            'Pre-configured Zap template',
            'API call examples and documentation',
            'Trigger and action mappings'
          ],
          setupSteps: [
            'Import the Zap template to your Zapier account',
            'Connect your required app integrations',
            'Test the automation with sample data',
            'Configure scheduling and filters'
          ],
          readyToUse: true,
          actionUrl: 'https://zapier.com/shared/ai-automation-template'
        };
      
      case 'google-docs':
        return {
          ...baseOutput,
          deliverables: [
            'Google Docs template with prompts',
            'Copy-paste prompt library',
            'Usage guidelines and examples'
          ],
          setupSteps: [
            'Copy the template to your Google Drive',
            'Customize prompts for your brand/voice',
            'Share with your team (optional)',
            'Start using the documented workflows'
          ],
          readyToUse: true,
          actionUrl: 'https://docs.google.com/document/ai-stack-template'
        };
      
      default:
        return baseOutput;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard"
    });
  };

  const resetFlow = () => {
    setCurrentStep('destination');
    setSelectedDestination(null);
    setDeployOutput(null);
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  if (!stack) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Deploy "{stack.title}"</span>
          </DialogTitle>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          {currentStep === 'destination' && (
            <motion.div
              key="destination"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">Stack Components:</h4>
                <div className="flex flex-wrap gap-2">
                  {stack.components.map((component, index) => (
                    <Badge key={index} variant="secondary">
                      {component.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Choose your deployment destination:</h3>
                
                {deployOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedDestination === option.id;
                  
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDestinationSelect(option.id)}
                      disabled={!option.available}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded ${option.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-base">{option.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {option.description}
                          </div>
                          <div className="text-sm text-primary font-medium">
                            ✨ {option.benefit}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="flex space-x-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeploy}
                  disabled={!selectedDestination}
                  className="flex-1"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Deploy Stack
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-16 text-center space-y-4"
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Deploying your AI stack...</h3>
              <p className="text-muted-foreground">
                We're generating ready-to-use templates, prompts, and setup guides for{' '}
                {deployOptions.find(opt => opt.id === selectedDestination)?.name}
              </p>
            </motion.div>
          )}

          {currentStep === 'success' && deployOutput && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-success">Stack Deployed Successfully! 🚀</h3>
                <p className="text-muted-foreground">
                  Your AI stack has been deployed to {deployOptions.find(opt => opt.id === selectedDestination)?.name}. 
                  You can start using it now — come back anytime to optimize it.
                </p>
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-semibold">What you're getting:</h4>
                  <ul className="space-y-2">
                    {deployOutput.deliverables?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-semibold">Setup checklist:</h4>
                  <ol className="space-y-2">
                    {deployOutput.setupSteps?.map((step: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-sm font-medium text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                {deployOutput.actionUrl && (
                  <Button asChild className="flex-1">
                    <a href={deployOutput.actionUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in {deployOptions.find(opt => opt.id === selectedDestination)?.name}
                    </a>
                  </Button>
                )}
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Done
                </Button>
              </div>

              <div className="text-center space-y-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">What's next?</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="ghost" size="sm" onClick={() => {
                    // This would navigate to optimize flow
                    toast({ title: "Optimize feature coming soon!" });
                  }}>
                    Optimize This Stack
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClose}>
                    Explore More Stacks
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Bot, Wrench, FileText, Zap, Link2, Eye
} from 'lucide-react';
import {
  SiGooglesheets, SiGmail, SiSlack, SiHubspot, SiSalesforce, SiZapier, SiOpenai, SiAnthropic, SiGooglecloud, SiAmazons3, SiStripe
} from 'react-icons/si';
import type { StackComponent } from '@/hooks/useAutonomousAgent';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const componentIcons: { [key: string]: { icon: React.ElementType, color: string } } = {
  'google sheets': { icon: SiGooglesheets, color: '#34A853' },
  'gmail': { icon: SiGmail, color: '#EA4335' },
  'slack': { icon: SiSlack, color: '#4A154B' },
  'hubspot': { icon: SiHubspot, color: '#FF7A59' },
  'salesforce': { icon: SiSalesforce, color: '#00A1E0' },
  'zapier': { icon: SiZapier, color: '#FF4A00' },
  'openai': { icon: SiOpenai, color: '#412991' },
  'anthropic': { icon: SiAnthropic, color: '#D97706' },
  'claude': { icon: SiAnthropic, color: '#D97706' },
  'aws s3': { icon: SiAmazons3, color: '#569A31' },
  'stripe': { icon: SiStripe, color: '#635BFF' },
  'google cloud': { icon: SiGooglecloud, color: '#4285F4' },
  'model': { icon: Bot, color: '#8B5CF6' },
  'tool': { icon: Wrench, color: '#3B82F6' },
  'prompt': { icon: FileText, color: '#10B981' },
  'agent': { icon: Zap, color: '#F97316' },
};

const componentLinks: { [key: string]: string } = {
  'google sheets': 'https://www.google.com/sheets/about/',
  'gmail': 'https://mail.google.com/',
  'slack': 'https://slack.com/',
  'hubspot': 'https://www.hubspot.com/',
  'salesforce': 'https://www.salesforce.com/',
  'zapier': 'https://zapier.com/',
  'openai': 'https://openai.com/',
  'anthropic': 'https://www.anthropic.com/',
  'claude': 'https://www.anthropic.com/claude',
  'aws s3': 'https://aws.amazon.com/s3/',
  'stripe': 'https://stripe.com/',
  'google cloud': 'https://cloud.google.com/',
  'midjourney': 'https://www.midjourney.com/',
  'tableau': 'https://www.tableau.com/',
  'rasa': 'https://rasa.com/',
  'hugging face': 'https://huggingface.co/',
  'amazon lex': 'https://aws.amazon.com/lex/',
  'dialogflow': 'https://cloud.google.com/dialogflow',
  'gpt-3': 'https://platform.openai.com/docs/models/gpt-3',
  'gpt-4': 'https://platform.openai.com/docs/models/gpt-4',
  'google translate': 'https://cloud.google.com/translate',
};

const getComponentIcon = (name: string, type: string) => {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(componentIcons)) {
    if (lowerName.includes(key)) return componentIcons[key];
  }
  return componentIcons[type] || componentIcons['tool'];
};

const getComponentLink = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(componentLinks)) {
    if (lowerName.includes(key)) return componentLinks[key];
  }
  return undefined;
};

export const ComponentListItem = ({ component }: { component: StackComponent }) => {
  const { icon: Icon, color } = getComponentIcon(component.name, component.type);
  const link = (component as any).link || getComponentLink(component.name);
  // Type pill color mapping
  const typeColors: { [key: string]: string } = {
    model: 'bg-purple-100 text-purple-700',
    tool: 'bg-blue-100 text-blue-700',
    prompt: 'bg-green-100 text-green-700',
    agent: 'bg-orange-100 text-orange-700',
    platform: 'bg-gray-100 text-gray-700',
  };
  const typeLabel = component.type.charAt(0).toUpperCase() + component.type.slice(1);
  const typeClass = typeColors[component.type] || 'bg-gray-100 text-gray-700';
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="p-2 rounded-full" style={{ backgroundColor: `${color}1A`}}>
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeClass}`}>{typeLabel}</span>
          {component.requires_connection && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">Requires connection</span>
          )}
          {link && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <Link2 className="h-4 w-4 ml-1.5 text-muted-foreground hover:text-primary" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open website</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {/* Prompt icon and dialog */}
          {component.type === 'prompt' && component.prompt && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button type="button" className="ml-1.5 p-1 rounded hover:bg-muted" title="View prompt">
                  <Eye className="h-4 w-4 text-blue-700" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <h4 className="font-semibold mb-2">Prompt</h4>
                <pre className="bg-muted p-3 rounded text-sm whitespace-pre-wrap break-words max-h-96 overflow-auto">{component.prompt}</pre>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <h4 className="font-semibold">{component.name}</h4>
        <p className="text-sm text-muted-foreground">{component.description}</p>
        {component.reason && <p className="text-xs text-muted-foreground/80 italic mt-1">Reason: {component.reason}</p>}
      </div>
    </div>
  );
}; 
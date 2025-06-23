import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Bot, Wrench, FileText, Zap, Link2
} from 'lucide-react';
import {
  SiGooglesheets, SiGmail, SiSlack, SiHubspot, SiSalesforce, SiZapier, SiOpenai, SiAnthropic, SiGooglecloud, SiAmazons3, SiStripe
} from 'react-icons/si';
import type { StackComponent } from '@/hooks/useAutonomousAgent';

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

const getComponentIcon = (name: string, type: string) => {
  const lowerName = name.toLowerCase();
  for (const key of Object.keys(componentIcons)) {
    if (lowerName.includes(key)) return componentIcons[key];
  }
  return componentIcons[type] || componentIcons['tool'];
};

export const ComponentListItem = ({ component }: { component: StackComponent }) => {
  const { icon: Icon, color } = getComponentIcon(component.name, component.type);
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="p-2 rounded-full" style={{ backgroundColor: `${color}1A`}}>
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <div>
        <h4 className="font-semibold flex items-center">
          {component.name}
          {component.requires_connection && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild><Link2 className="h-3 w-3 ml-1.5 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent><p>Requires connection</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h4>
        <p className="text-sm text-muted-foreground">{component.description}</p>
        {component.reason && <p className="text-xs text-muted-foreground/80 italic mt-1">Reason: {component.reason}</p>}
      </div>
    </div>
  );
}; 
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  SiGooglesheets, SiGmail, SiSlack, SiHubspot, SiSalesforce, SiZapier, SiOpenai, SiAnthropic, SiGooglecloud, SiAmazons3, SiStripe
} from 'react-icons/si';
import { Sparkles, Bot, FileText, Wrench, ExternalLink } from 'lucide-react';
import { StackComponent } from '@/hooks/useAutonomousAgent';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getComponentIconRobust } from './ComponentListItem';

// Icon mapping
const componentIcons: { [key: string]: React.ElementType } = {
  // Brand Icons
  'Google Sheets': SiGooglesheets,
  'Gmail': SiGmail,
  'Slack': SiSlack,
  'Hubspot': SiHubspot,
  'Salesforce': SiSalesforce,
  'Zapier': SiZapier,
  'OpenAI': SiOpenai,
  'Anthropic': SiAnthropic,
  'Google Cloud': SiGooglecloud,
  'Amazon S3': SiAmazons3,
  'Stripe': SiStripe,
  // Generic Icons
  'default_tool': Wrench,
  'default_model': SiOpenai,
  'default_agent': Bot,
  'default_prompt': FileText,
};

const getIcon = (component: StackComponent) => {
  const Icon = componentIcons[component.name] || componentIcons[`default_${component.type}`] || Sparkles;
  return <Icon className="w-6 h-6" />;
};

const typeColors: { [key: string]: string } = {
  model: 'bg-purple-100 text-purple-700',
  tool: 'bg-blue-100 text-blue-700',
  prompt: 'bg-green-100 text-green-700',
  agent: 'bg-orange-100 text-orange-700',
  platform: 'bg-gray-100 text-gray-700',
};

const CustomNode = ({ data }: { data: any }) => {
  // data: { label, type, name, ... }
  const typeLabel = data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : '';
  const typeClass = typeColors[data.type] || 'bg-gray-100 text-gray-700';

  // Always use getComponentIconRobust for best match
  let iconElem = null;
  if (data.name && data.type) {
    const { icon: Icon, color } = getComponentIconRobust(data.name, data.type);
    iconElem = <Icon className="w-8 h-8" style={{ color }} />;
  } else if (data.label && data.type) {
    const { icon: Icon, color } = getComponentIconRobust(data.label, data.type);
    iconElem = <Icon className="w-8 h-8" style={{ color }} />;
  } else if (data.icon && typeof data.icon === 'string' && data.icon.length <= 3) {
    iconElem = <span className="text-2xl">{data.icon}</span>;
  } else {
    iconElem = <span className="text-2xl">🔗</span>;
  }

  // If link is present, make icon clickable
  const iconWithLink = data.link ? (
    <a href={data.link} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
      {iconElem}
      <ExternalLink className="inline w-3 h-3 ml-1 text-muted-foreground align-text-top" />
    </a>
  ) : (
    iconElem
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="w-16 h-16 rounded-full shadow-lg bg-background border-border hover:shadow-2xl transition-shadow duration-200 cursor-pointer flex items-center justify-center group p-0">
            <CardContent className="p-0 flex items-center justify-center w-full h-full">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
                {iconWithLink}
              </div>
            </CardContent>
            <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-primary" />
            <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-primary" />
          </Card>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="font-semibold mb-1">{data.label}</div>
          <div className="text-xs whitespace-pre-line">{data.description}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomNode; 
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  SiGooglesheets, SiGmail, SiSlack, SiHubspot, SiSalesforce, SiZapier, SiOpenai, SiAnthropic, SiGooglecloud, SiAmazons3, SiStripe
} from 'react-icons/si';
import { Sparkles, Bot, FileText, Wrench } from 'lucide-react';
import { StackComponent } from '@/hooks/useAutonomousAgent';

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


const CustomNode = ({ data }: { data: { component: StackComponent } }) => {
  const { component } = data;

  return (
    <Card className="w-48 rounded-lg shadow-lg bg-background border-border hover:shadow-xl transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-muted rounded-md">
            {getIcon(component)}
          </div>
          <div className="font-semibold truncate">{component.name}</div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-primary" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-primary" />
    </Card>
  );
};

export default CustomNode; 
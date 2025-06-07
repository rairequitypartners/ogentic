
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  Lock, 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink 
} from "lucide-react";
import { useStacks } from "@/hooks/useStacks";

interface StackDeploymentProps {
  stackId: string;
  title: string;
  deploymentStatus: string;
  isPublic: boolean;
  deployedAt?: string;
  deploymentUrl?: string;
  onStatusChange?: () => void;
}

export const StackDeployment = ({
  stackId,
  title,
  deploymentStatus,
  isPublic,
  deployedAt,
  deploymentUrl,
  onStatusChange
}: StackDeploymentProps) => {
  const [makePublic, setMakePublic] = useState(isPublic);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['my-stacks']);
  const { deployStack, deploying } = useStacks();

  const platforms = [
    { id: 'my-stacks', name: 'My Stacks', description: 'Save to personal collection' },
    { id: 'notion', name: 'Notion', description: 'Export to Notion workspace' },
    { id: 'zapier', name: 'Zapier', description: 'Create automation workflows' },
    { id: 'slack', name: 'Slack', description: 'Deploy to Slack workspace' },
    { id: 'google-docs', name: 'Google Docs', description: 'Export documentation' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'deploying':
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Lock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-success/10 text-success';
      case 'deploying':
        return 'bg-warning/10 text-warning';
      case 'failed':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleDeploy = async () => {
    const success = await deployStack(stackId, selectedPlatforms);
    if (success && onStatusChange) {
      onStatusChange();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>Deploy Stack</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getStatusIcon(deploymentStatus)}
            <Badge className={getStatusColor(deploymentStatus)}>
              {deploymentStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Public/Private Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label className="text-base font-medium">Make Public</Label>
            <p className="text-sm text-muted-foreground">
              Allow others to discover and use this stack
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {makePublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <Switch
              checked={makePublic}
              onCheckedChange={setMakePublic}
              disabled={deploying}
            />
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Select Platforms</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                disabled={deploying}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${deploying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-medium">{platform.name}</div>
                <div className="text-sm text-muted-foreground">
                  {platform.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Deployment Info */}
        {deploymentStatus === 'deployed' && deployedAt && (
          <div className="p-4 border rounded-lg bg-success/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-success">Successfully Deployed</div>
                <div className="text-sm text-muted-foreground">
                  Deployed {new Date(deployedAt).toLocaleDateString()}
                </div>
              </div>
              {deploymentUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Deploy Button */}
        <Button
          onClick={handleDeploy}
          disabled={selectedPlatforms.length === 0 || deploying}
          className="w-full"
          size="lg"
        >
          {deploying ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2" />
              Deploy to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

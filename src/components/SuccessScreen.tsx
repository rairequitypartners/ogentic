
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface DeploymentResult {
  platform: string;
  status: 'success' | 'error';
  message: string;
}

interface SuccessScreenProps {
  deployments: DeploymentResult[];
  onExploreMore: () => void;
  onRefineStack: () => void;
}

export const SuccessScreen = ({ deployments, onExploreMore, onRefineStack }: SuccessScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const successCount = deployments.filter(d => d.status === 'success').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/10 via-background to-primary/10 flex items-center justify-center p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce">🎉</div>
          <div className="absolute top-1/3 right-1/4 text-4xl animate-bounce animation-delay-300">✨</div>
          <div className="absolute top-1/2 left-1/3 text-4xl animate-bounce animation-delay-600">🚀</div>
          <div className="absolute top-2/3 right-1/3 text-4xl animate-bounce animation-delay-900">🎊</div>
        </div>
      )}
      
      <Card className="w-full max-w-2xl animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-success/10 rounded-full w-fit">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <CardTitle className="text-3xl text-gradient mb-2">
            Stack Deployed Successfully! 
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Your AI stack has been deployed to {successCount} platform{successCount !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {deployments.map((deployment, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  deployment.status === 'success' 
                    ? 'bg-success/5 border-success/20' 
                    : 'bg-destructive/5 border-destructive/20'
                }`}
              >
                <CheckCircle className={`h-5 w-5 ${
                  deployment.status === 'success' ? 'text-success' : 'text-destructive'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{deployment.platform}</span>
                    <Badge variant={deployment.status === 'success' ? 'default' : 'destructive'}>
                      {deployment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{deployment.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              What's next?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={onExploreMore}
                className="flex items-center justify-center space-x-2 py-6"
                variant="outline"
              >
                <span>Explore More Stacks</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                onClick={onRefineStack}
                className="flex items-center justify-center space-x-2 py-6"
              >
                <span>Refine This Stack</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

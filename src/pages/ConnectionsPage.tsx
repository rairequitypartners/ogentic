import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ConnectionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stack } = location.state || {};

  if (!stack) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-lg">No stack information provided.</p>
          <Button onClick={() => navigate('/stacks')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Stacks
          </Button>
        </div>
      </div>
    );
  }

  // A simple way to identify components that need connections
  const requiredConnections = stack.stack_data.components.filter(component => 
    component.name.toLowerCase().includes('api') || 
    component.name.toLowerCase().includes('zapier') ||
    component.name.toLowerCase().includes('mailchimp')
  );

  const handleConnect = (service: string) => {
    // Placeholder for actual connection logic (e.g., OAuth flow)
    alert(`Connecting to ${service}... (Not yet implemented)`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/stacks')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Stacks
        </Button>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Connect to Services</CardTitle>
            <p className="text-muted-foreground">
              Your stack "{stack.title}" requires the following connections to be set up.
            </p>
          </CardHeader>
          <CardContent>
            {requiredConnections.length > 0 ? (
              <div className="space-y-4">
                {requiredConnections.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{component.name}</h3>
                      <p className="text-sm text-muted-foreground">{component.description}</p>
                    </div>
                    <Button onClick={() => handleConnect(component.name)}>Connect</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No external connections required for this stack.</p>
            )}

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold">Next Steps</h3>
              <p className="text-muted-foreground mt-2">
                Once all services are connected, the agent will proceed to create the final components of your stack.
              </p>
              {/* Placeholder for agent interaction */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-center text-muted-foreground">Agent guidance will appear here.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectionsPage; 
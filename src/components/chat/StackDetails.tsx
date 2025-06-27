import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Package, 
  Code, 
  Settings, 
  ExternalLink,
  Layers,
  Map,
  X
} from 'lucide-react';
import { Stack } from '@/hooks/useAutonomousAgent';
import { ComponentListItem } from './ComponentListItem';
import { MindMap } from './MindMap';

interface StackDetailsProps {
  selectedStack: Stack | null;
  onClose: () => void;
}

export const StackDetails: React.FC<StackDetailsProps> = ({
  selectedStack,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'components' | 'map'>('components');

  if (!selectedStack) {
    return (
      <div className="bg-background border-l border-border flex flex-col h-full">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Stack Details</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a stack to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Stack Details</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Stack Info */}
      <div className="p-4 border-b border-border">
        <h4 className="font-medium text-lg mb-2 flex items-center">
          {selectedStack.title}
          {selectedStack.ai_stack && selectedStack.ai_stack.every(comp => ['model', 'agent', 'prompt'].includes(comp.type)) && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-white">AI Components Only</span>
          )}
        </h4>
        <p className="text-sm text-muted-foreground mb-3">{selectedStack.description}</p>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{selectedStack.use_case}</Badge>
          {selectedStack.industry && (
            <Badge variant="outline">{selectedStack.industry}</Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'components' | 'map')} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="components" className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Components</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="components" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {selectedStack.ai_stack?.map((component, index) => (
                <ComponentListItem key={index} component={component} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="map" className="flex-1 p-4">
          {selectedStack.map?.nodes && selectedStack.map?.edges ? (
            <div className="h-full min-h-[400px] bg-muted/20 rounded-lg border-2 border-muted-foreground/20">
              <MindMap nodes={selectedStack.map.nodes} edges={selectedStack.map.edges} />
            </div>
          ) : (
            <div className="h-full bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Map view coming soon</p>
                <p className="text-sm">ReactFlow integration will be implemented here</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
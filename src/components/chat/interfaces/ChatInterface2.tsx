import { useState } from "react";
import { AutonomousAgent } from "../AutonomousAgent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Settings, 
  Sparkles, 
  Target, 
  Zap, 
  Lightbulb,
  MessageSquare,
  Clock,
  TrendingUp
} from "lucide-react";
import { useAutonomousAgent } from "@/hooks/useAutonomousAgent";

export const ChatInterface2 = () => {
  const { getAgentInsights } = useAutonomousAgent();
  const insights = getAgentInsights();

  return (
    <div className="h-full flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <AutonomousAgent className="h-full" />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-muted/30 border-l p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Agent Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conversations</span>
              <Badge variant="secondary">{insights.totalInteractions}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <Badge variant="outline">
                {insights.totalInteractions > 0 
                  ? Math.round((insights.positiveFeedback / insights.totalInteractions) * 100)
                  : 0}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <Badge variant="outline">{Math.round(insights.avgConfidence * 100)}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Sparkles className="w-4 h-4 mr-2" />
              New Stack
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Recent Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Content Creation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Automation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time Management</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 
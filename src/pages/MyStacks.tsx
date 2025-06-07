
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Folder, Play, Trash2, Search } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type AIStack = Tables<'ai_stacks'>;

export default function MyStacks() {
  const { user, loading: authLoading } = useAuth();
  const [stacks, setStacks] = useState<AIStack[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchStacks();
    }
  }, [user, authLoading, navigate]);

  const fetchStacks = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_stacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStacks(data || []);
    } catch (error) {
      console.error('Error fetching stacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStack = async (stackId: string) => {
    try {
      const { error } = await supabase
        .from('ai_stacks')
        .delete()
        .eq('id', stackId);

      if (error) throw error;
      
      setStacks(stacks.filter(stack => stack.id !== stackId));
    } catch (error) {
      console.error('Error deleting stack:', error);
    }
  };

  const getComponentCount = (components: any) => {
    if (!components || !Array.isArray(components)) return 0;
    return components.length;
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Folder className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">My Stacks</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your saved AI stacks and deploy them to your favorite tools.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stacks.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No stacks saved yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by searching for an AI stack and saving it to your collection.
            </p>
            <Button onClick={() => navigate("/")} className="button-glow">
              Discover AI Stacks
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stacks.map((stack) => (
              <Card key={stack.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{stack.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Navigate to results page with this stack
                          navigate(`/results?stack=${stack.id}`);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteStack(stack.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stack.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Components:</span>
                      <Badge variant="secondary">
                        {getComponentCount(stack.components)} items
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Query:</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[150px]">
                        {stack.query}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created {new Date(stack.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

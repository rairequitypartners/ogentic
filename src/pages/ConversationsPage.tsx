import { useEffect, useState } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, ArrowRight, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const ConversationsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { conversations, loading: conversationsLoading, fetchConversations, deleteConversation } = useConversations();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteConversation(id);
    fetchConversations(user.id);
    setDeleteId(null);
    setConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">My Conversations</h1>
          </div>
          <Button onClick={() => navigate('/welcome')}>
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        </div>

        {(authLoading || conversationsLoading) ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No conversations yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Start a new conversation to see it here.</p>
            <Button onClick={() => navigate('/welcome')} className="mt-6">
              <Plus className="mr-2 h-4 w-4" />
              Start New Conversation
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conversations.map(convo => (
              <Card key={convo.id} className="hover:shadow-lg transition-shadow relative">
                <CardHeader>
                  <CardTitle className="truncate text-lg">{convo.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Last updated: {formatDate(convo.updated_at)}
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/chat/${convo.id}`}>
                      Open Conversation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <button
                    className="absolute bottom-3 right-3 p-2 rounded-full hover:bg-destructive/10"
                    title="Delete conversation"
                    onClick={() => { setDeleteId(convo.id); setConfirmOpen(true); }}
                  >
                    <Trash className="h-5 w-5 text-destructive" />
                  </button>
                  {deleteId === convo.id && (
                    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                      <DialogTrigger asChild><span /></DialogTrigger>
                      <DialogContent>
                        <h4 className="font-semibold mb-2">Delete Conversation</h4>
                        <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2 mt-6">
                          <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={() => handleDelete(convo.id)}>Delete</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage; 
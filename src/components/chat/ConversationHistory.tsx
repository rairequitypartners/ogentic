import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Clock, 
  Trash2,
  History,
  Eye,
  MoreVertical,
  Loader2,
  Plus
} from 'lucide-react';
import { useConversations, Conversation } from '@/hooks/useConversations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConversationHistoryProps {
  onNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  currentConversationId?: string;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  onNewConversation,
  onSelectConversation,
  currentConversationId
}) => {
  const { conversations, loading, deleteConversation } = useConversations();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const formatTimestamp = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (conversationToDelete) {
      await deleteConversation(conversationToDelete);
      if (currentConversationId === conversationToDelete) {
        const currentIndex = conversations.findIndex(c => c.id === conversationToDelete);
        const nextConversation = conversations[currentIndex + 1] || conversations[currentIndex - 1];
        
        if (nextConversation) {
          onSelectConversation(nextConversation.id);
        } else {
          onNewConversation();
        }
      }
    }
    setShowDeleteDialog(false);
    setConversationToDelete(null);
  };

  const handleViewConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <>
      <div className="bg-background border-r border-border flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">History</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onNewConversation} className="w-8 h-8 p-0" title="New Conversation">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    currentConversationId === conversation.id ? 'bg-muted border-primary/20' : ''
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => onSelectConversation(conversation.id)}
                      >
                        <h4 className="font-medium text-sm truncate">{conversation.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {truncateText(conversation.messages[conversation.messages.length -1]?.content || 'No messages yet', 60)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(conversation.updated_at)}</span>
                          </div>
                          {conversation.messages.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {conversation.messages.length} messages
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 flex-shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewConversation(conversation)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteConversation(conversation.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Dialogs */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Conversation</DialogTitle><DialogDescription>Are you sure? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedConversation} onOpenChange={() => setSelectedConversation(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader><DialogTitle>{selectedConversation?.title}</DialogTitle><DialogDescription>Conversation from {selectedConversation && formatTimestamp(selectedConversation.created_at)}</DialogDescription></DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-4">
              {selectedConversation?.messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{message.content}</p>
                    {message.stacks && message.stacks.length > 0 && (
                      <div className="mt-2 p-2 bg-background/50 rounded border">
                        <h5 className="font-medium text-xs mb-1">{message.stacks[0].title}</h5>
                        <p className="text-xs text-muted-foreground">{message.stacks[0].description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}; 
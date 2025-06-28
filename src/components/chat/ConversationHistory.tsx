import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderPlus,
  Settings
} from 'lucide-react';
import { useConversations, Conversation } from '@/hooks/useConversations';
import { useDepartments } from '@/hooks/useDepartments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const { departments, loading: departmentsLoading, createDepartment, fetchDepartments } = useDepartments();
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true); // Collapsed by default
  const [showCreateDepartment, setShowCreateDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // Fetch departments when user is available
  useEffect(() => {
    if (user) {
      fetchDepartments(user.id);
    }
  }, [user]);

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

  const handleCreateDepartment = async () => {
    if (newDepartmentName.trim() && user) {
      const newDept = await createDepartment(user.id, newDepartmentName.trim());
      if (newDept) {
        toast({
          title: "Department Created",
          description: `"${newDepartmentName}" department has been created.`,
        });
        setNewDepartmentName('');
        setShowCreateDepartment(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to create department. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Group conversations by department
  const conversationsByDepartment = conversations.reduce((acc, conversation) => {
    const deptId = conversation.department_id || 'general';
    if (!acc[deptId]) {
      acc[deptId] = [];
    }
    acc[deptId].push(conversation);
    return acc;
  }, {} as Record<string, Conversation[]>);

  // Ensure we have a "General" department for conversations without a department
  const allDepartments = [
    { id: 'general', name: 'General', color: '#3b82f6', description: 'Default department' },
    ...departments
  ];

  return (
    <>
      <div className="bg-background border-r border-border flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 p-0 h-auto font-semibold"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <History className="w-4 h-4 text-primary" />
              <span>Workplace</span>
            </Button>
          </CollapsibleTrigger>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCreateDepartment(true)} 
              className="w-8 h-8 p-0" 
              title="New Department"
            >
              <FolderPlus className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNewConversation} 
              className="w-8 h-8 p-0" 
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Collapsible Content */}
        <Collapsible open={!isCollapsed} className="flex-1">
          <CollapsibleContent className="h-full">
            <ScrollArea className="h-full">
              {loading || departmentsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="p-2 space-y-4">
                  {allDepartments.map((department) => {
                    const deptConversations = conversationsByDepartment[department.id] || [];
                    const isExpanded = selectedDepartment === department.id;
                    
                    return (
                      <div key={department.id} className="space-y-2">
                        {/* Department Header */}
                        <div 
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedDepartment(isExpanded ? null : department.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: department.color || '#3b82f6' }}
                            />
                            <Folder className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{department.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {deptConversations.length}
                            </Badge>
                          </div>
                          {deptConversations.length > 0 && (
                            <ChevronRight 
                              className={`w-4 h-4 text-muted-foreground transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`} 
                            />
                          )}
                        </div>

                        {/* Department Conversations */}
                        {isExpanded && deptConversations.length > 0 && (
                          <div className="ml-4 space-y-2">
                            {deptConversations.map((conversation) => (
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
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Create Department Dialog */}
      <Dialog open={showCreateDepartment} onOpenChange={setShowCreateDepartment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>Create a new department to organize your conversations.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Department Name</label>
              <Input
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="Enter department name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateDepartment();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDepartment(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDepartment} disabled={!newDepartmentName.trim()}>
              Create Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Conversation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Conversation Dialog */}
      <Dialog open={!!selectedConversation} onOpenChange={() => setSelectedConversation(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedConversation?.title}</DialogTitle>
            <DialogDescription>Conversation from {selectedConversation && formatTimestamp(selectedConversation.created_at)}</DialogDescription>
          </DialogHeader>
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
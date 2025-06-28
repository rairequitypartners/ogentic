import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AutonomousAgent } from '@/components/chat/AutonomousAgent';
import { ConversationHistory } from '@/components/chat/ConversationHistory';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { useAutonomousAgent, AgentResponse, Stack } from '@/hooks/useAutonomousAgent';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useAutonomousAgentStore } from '@/hooks/useAutonomousAgent';
import { StackSidebar } from '@/components/chat/StackSidebar';
import { StackDetails } from '@/components/chat/StackDetails';

const AutonomousAgentPage = () => {
  const { conversationId: currentConversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { conversations, fetchConversations, loading: conversationsLoading } = useConversations();
  const { messages, setMessages, sendMessage, setCurrentConversationId, isLoading } = useAutonomousAgent();
  const navigate = useNavigate();
  const location = useLocation();
  const processedNewQuery = useRef(false);
  const loadedConversationId = useRef<string | null>(null);
  const { conversationId: storeConversationId } = useAutonomousAgentStore();
  
  const [activeStacksMessageId, setActiveStacksMessageId] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<Stack | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations(user.id);
    }
  }, [user, fetchConversations]);

  // Effect for loading an existing conversation from the URL
  useEffect(() => {
    if (currentConversationId && !conversationsLoading && conversations.length > 0) {
      // Only load if we haven't already loaded this conversation
      if (loadedConversationId.current !== currentConversationId) {
      const targetConversation = conversations.find(c => c.id === currentConversationId);
      if (targetConversation) {
          console.log('Loading conversation:', currentConversationId);
          loadedConversationId.current = currentConversationId;
        setMessages(targetConversation.messages || []);
        setCurrentConversationId(currentConversationId);
      }
    }
    }
  }, [currentConversationId, conversations, conversationsLoading, setMessages, setCurrentConversationId]);

  const handleShowStacks = (messageId: string) => {
    if (activeStacksMessageId === messageId) {
      // If clicking the same message, hide both panels
      setActiveStacksMessageId(null);
      setShowRecommendations(false);
      setSelectedStack(null); 
    } else {
      // If clicking a different message, show recommendations
      setActiveStacksMessageId(messageId);
      setShowRecommendations(true);
    }
  };

  const handleSelectStack = (stack: Stack) => {
    setSelectedStack(stack);
  };

  const handleCloseStackDetails = () => {
    setSelectedStack(null);
  };

  const prevMessagesLength = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      // Find the latest assistant message with stacks
      const lastAssistantWithStacks = [...messages].reverse().find(
        m => m.role === 'assistant' && m.stacks && m.stacks.length > 0
      );
      if (lastAssistantWithStacks) {
        setActiveStacksMessageId(lastAssistantWithStacks.id);
        setShowRecommendations(true);
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const displayedStacks = useMemo(() => {
    console.log('displayedStacks calculation:');
    console.log('activeStacksMessageId:', activeStacksMessageId);
    console.log('messages:', messages);
    
    if (!activeStacksMessageId) return null;
    const message = messages.find(m => m.id === activeStacksMessageId);
    console.log('found message:', message);
    console.log('message stacks:', message?.stacks);
    
    // The type assertion is needed because of the discrepancy between Stack types
    return message?.stacks as Stack[] || null;
  }, [activeStacksMessageId, messages]);

  useEffect(() => {
    const newQuery = (location.state as { newQuery?: string })?.newQuery;
    if (newQuery && !processedNewQuery.current) {
      processedNewQuery.current = true;
      setCurrentConversationId(null);
      setMessages([]);
      sendMessage(newQuery);
    }
  }, [location.state, sendMessage, setCurrentConversationId, setMessages]);

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    navigate('/welcome');
  };

  // Debug logging
  console.log('Render debug:', {
    currentConversationId,
    showRecommendations,
    displayedStacks: displayedStacks?.length,
    selectedStack: !!selectedStack
  });

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onStartFresh={handleNewChat} />
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          
          {(currentConversationId || messages.length > 0) && (
            <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
            <ConversationHistory
              onNewConversation={handleNewChat}
                onSelectConversation={(id) => navigate(`/chat/${id}`)}
              currentConversationId={currentConversationId}
            />
          </ResizablePanel>
        )}

          {(currentConversationId || messages.length > 0) && <ResizableHandle withHandle />}

          <ResizablePanel defaultSize={35} minSize={25}>
            <main className="flex-1 flex flex-col h-full">
              <AutonomousAgent onShowStacks={handleShowStacks} />
            </main>
          </ResizablePanel>
          
          {showRecommendations && displayedStacks && displayedStacks.length > 0 && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={15} maxSize={30}>
                <StackSidebar 
                  stacks={displayedStacks}
                  isLoading={isLoading} 
                  onClose={() => {
                    setShowRecommendations(false);
                    setActiveStacksMessageId(null);
                    setSelectedStack(null);
                  }}
                  onSelectStack={handleSelectStack}
                />
              </ResizablePanel>
            </>
          )}

          {selectedStack && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={15} maxSize={30}>
                <StackDetails 
                  selectedStack={selectedStack}
                  onClose={handleCloseStackDetails}
                />
        </ResizablePanel>
            </>
          )}

      </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default AutonomousAgentPage;

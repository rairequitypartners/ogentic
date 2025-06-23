import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAutonomousAgent } from '@/hooks/useAutonomousAgent';
import { useConversations } from '@/hooks/useConversations';
import { ChatView } from '@/components/chat/ChatView';
import { WelcomeScreen } from './WelcomeScreen';

export interface AutonomousAgentHandle {
  startNewConversation: () => void;
}

interface AutonomousAgentProps {
  className?: string;
  onShowStacks: (messageId: string) => void;
}

export const AutonomousAgent = forwardRef<AutonomousAgentHandle, AutonomousAgentProps>(({ className, onShowStacks }, ref) => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    currentConversationId,
    pendingClarifications,
    setPendingClarifications,
  } = useAutonomousAgent();
  
  const [inputValue, setInputValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [clarificationMode, setClarificationMode] = useState(false);

  // Show the first pending clarification question if any
  const currentClarification = pendingClarifications.length > 0 ? pendingClarifications[0] : null;

  const handleWelcomeQuery = async (query: string) => {
    if (!query.trim()) return;
    await handleSubmit(query);
  };

  const handleSubmit = async (input: string) => {
    const query = input.trim();
    if (!query) return;
    setInputValue('');
    if (currentClarification) {
      // Answering a clarification question
      await sendMessage(query, currentConversationId || undefined);
      setPendingClarifications(pendingClarifications.slice(1));
    } else {
      sendMessage(query, currentConversationId || undefined);
    }
  };

  const handleNewConversation = useCallback(() => {
    // This method is handled by the parent page now.
  }, []);

  useImperativeHandle(ref, () => ({
    startNewConversation: handleNewConversation,
  }));

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      handleNewConversation();
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, handleNewConversation]);

  // Only show the welcome screen if not in clarification mode
  const showWelcome = messages.length === 0 && !isLoading && !currentClarification;
  if (showWelcome) {
    return <WelcomeScreen onQuerySubmit={handleWelcomeQuery} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatView
        messages={
          currentClarification
            ? [
                ...messages,
                {
                  id: 'clarification',
                  role: 'assistant',
                  content: currentClarification,
                  timestamp: new Date(),
                },
              ]
            : messages
        }
        isLoading={isLoading}
        error={error}
        onSendMessage={handleSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onShowStacks={onShowStacks}
      />
    </div>
  );
}); 
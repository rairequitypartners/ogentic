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
  } = useAutonomousAgent();
  
  const [inputValue, setInputValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleWelcomeQuery = async (query: string) => {
    if (!query.trim()) return;
    await handleSubmit(query);
  };

  const handleSubmit = async (input: string) => {
    const query = input.trim();
    if (!query) return;
    setInputValue('');
    sendMessage(query, currentConversationId || undefined);
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

  const showWelcome = messages.length === 0 && !isLoading;
  if (showWelcome) {
    return <WelcomeScreen onQuerySubmit={handleWelcomeQuery} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatView
        messages={messages}
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
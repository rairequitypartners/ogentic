import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAutonomousAgent } from '@/hooks/useAutonomousAgent';
import { useConversations } from '@/hooks/useConversations';
import { ChatView } from '@/components/chat/ChatView';
import { WelcomeScreen } from './WelcomeScreen';
import { useAutonomousAgentStore } from '@/hooks/useAutonomousAgent';

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
  const [modelSwitchNotification, setModelSwitchNotification] = useState<string | null>(null);

  // Track answered clarifications
  const [answeredClarifications, setAnsweredClarifications] = useState<{ question: string; answer: string }[]>([]);

  // DEBUG: Log when sendMessage is called
  const debugSendMessage = async (input: string, conversationIdParam?: string) => {
    console.log('[DEBUG] Calling sendMessage:', input, conversationIdParam);
    await sendMessage(input, conversationIdParam);
  };

  // Show the first pending clarification question if any
  const currentClarification = pendingClarifications.length > 0 ? pendingClarifications[0] : null;

  // Filter out any message that is just a clarification block
  const filteredMessages = messages.filter(
    m => !/<clarification_block>/i.test(m.content)
  );

  // Extract <preamble>, <clarification_block>, and <postscript> blocks from the latest assistant message
  let preambles: string[] = [];
  let clarificationQuestions: string[] = [];
  let postscripts: string[] = [];
  if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
    const content = messages[messages.length - 1].content;
    // Extract all <preamble>...</preamble> blocks
    preambles = Array.from(content.matchAll(/<preamble>([\s\S]*?)<\/preamble>/gi)).map(m => m[1].trim()).filter(Boolean);
    // Extract all <postscript>...</postscript> blocks
    postscripts = Array.from(content.matchAll(/<postscript>([\s\S]*?)<\/postscript>/gi)).map(m => m[1].trim()).filter(Boolean);
    // Extract the first <clarification_block>...</clarification_block> block
    const clarBlockMatch = content.match(/<clarification_block>([\s\S]*?)<\/clarification_block>/i);
    if (clarBlockMatch && clarBlockMatch[1]) {
      clarificationQuestions = clarBlockMatch[1]
        .split(/\n|^\s*\d+\.\s*|^\s*[-*]\s*/gm)
        .map(q => q.trim())
        .filter(q => q.length > 0);
    }
  }

  // If clarificationQuestions are found, set them as pendingClarifications (if not already set)
  useEffect(() => {
    if (
      clarificationQuestions.length > 0 &&
      pendingClarifications.length === 0 &&
      answeredClarifications.length === 0
    ) {
      setPendingClarifications(clarificationQuestions);
    }
    // eslint-disable-next-line
  }, [clarificationQuestions.join(','), pendingClarifications.length, answeredClarifications.length]);

  // Build the chat history: preambles, answered Q&A, current question, postscripts (if done)
  const chatHistory = [
    ...filteredMessages,
    ...preambles.map((p, i) => ({ id: `clarification-preamble-${i}`, role: 'assistant' as 'assistant', content: p, timestamp: new Date() })),
    ...answeredClarifications.flatMap((qa, idx) => [
      {
        id: `clarification-q-${idx}`,
        role: 'assistant' as 'assistant',
        content: qa.question,
        timestamp: new Date(),
      },
      {
        id: `clarification-a-${idx}`,
        role: 'user' as 'user',
        content: qa.answer,
        timestamp: new Date(),
      },
    ]),
    // Show the current clarification question (if any)
    ...(currentClarification ? [{ id: 'clarification-current', role: 'assistant' as 'assistant', content: currentClarification, timestamp: new Date() }] : []),
    // Show postscripts only after all clarifications are answered
    ...(postscripts.length > 0 && pendingClarifications.length === 0
      ? postscripts.map((p, i) => ({ id: `clarification-postscript-${i}`, role: 'assistant' as 'assistant', content: p, timestamp: new Date() }))
      : []),
  ];

  // Only show recommendations after all clarifications are answered
  const canShowRecommendations = pendingClarifications.length === 0;

  const handleWelcomeQuery = async (query: string) => {
    if (!query.trim()) return;
    await handleSubmit(query);
  };

  const handleSubmit = async (input: string) => {
    const query = input.trim();
    if (!query) return;
    setInputValue('');
    if (currentClarification) {
      setAnsweredClarifications(prev => [
        ...prev,
        { question: currentClarification, answer: query },
      ]);
      setPendingClarifications(pendingClarifications.slice(1));
    } else {
      await debugSendMessage(query, currentConversationId || undefined);
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

  useEffect(() => {
    if (
      pendingClarifications.length === 0 &&
      answeredClarifications.length > 0
    ) {
      const summary = answeredClarifications
        .map(qa => `${qa.question}\n${qa.answer}`)
        .join('\n\n');
      console.log('[DEBUG] Sending summary to agent:', summary);
      debugSendMessage(summary, currentConversationId || undefined);
      setAnsweredClarifications([]);
    }
    // eslint-disable-next-line
  }, [pendingClarifications.length]);

  // Log the agent's raw response for debugging
  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      console.log('[DEBUG] Last agent message:', last);
    }
  }, [messages]);

  // Show model switch notification
  useEffect(() => {
    const currentModel = useAutonomousAgentStore.getState().currentModel;
    const retryCount = useAutonomousAgentStore.getState().retryCount;
    
    if (retryCount === 0 && currentModel !== 'claude-3-haiku-20240307') {
      setModelSwitchNotification(`Switched to ${currentModel} for better compliance`);
      setTimeout(() => setModelSwitchNotification(null), 3000);
    }
  }, [useAutonomousAgentStore.getState().currentModel, useAutonomousAgentStore.getState().retryCount]);

  // Only show the welcome screen if not in clarification mode
  const showWelcome = chatHistory.length === 0 && !isLoading && !currentClarification;
  if (showWelcome) {
    return <WelcomeScreen onQuerySubmit={handleWelcomeQuery} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {modelSwitchNotification && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">{modelSwitchNotification}</p>
            </div>
          </div>
        </div>
      )}
      <ChatView
        messages={chatHistory}
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
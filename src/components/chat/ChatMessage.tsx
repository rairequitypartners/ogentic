import { AgentResponse } from '@/hooks/useAutonomousAgent';
import { Bot, Info, Layers, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: AgentResponse;
  isLoading: boolean;
  onDeployStack: () => void;
  onShowStacks: () => void;
}

export const ChatMessage = ({ message, isLoading, onDeployStack, onShowStacks }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const hasStacks = message.stacks && message.stacks.length > 0;
  const [showRaw, setShowRaw] = useState(false);

  // Clean content for display: remove any XML-like tags
  let cleanContent = message.content.replace(/<\/?[a-z_]+>/gi, '').trim();
  if (!cleanContent || cleanContent.length < 5) {
    cleanContent = 'Here are your recommended stacks. See the sidebar for details.';
  }

  return (
    <div className={`flex flex-col items-start gap-3 ${isUser ? 'items-end' : ''}`}>
      <div className={`flex items-start gap-3 w-full ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-primary" />
          </div>
        )}
        <div
          className={cn(
            'relative max-w-[80%] rounded-lg p-3',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {cleanContent}
            </ReactMarkdown>
          </div>
          
          <div className="absolute bottom-1 right-1 flex items-center">
            {hasStacks && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={onShowStacks}
              >
                <Layers className="h-4 w-4" />
              </Button>
            )}
            {!isUser && message.raw && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => setShowRaw(!showRaw)}
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>
      {showRaw && message.raw && (
        <div className="w-full max-w-2xl ml-11 mt-2">
          <pre className="bg-gray-800 text-white p-4 rounded-lg text-xs overflow-y-auto whitespace-pre-wrap break-words max-h-96">
            <code>{(() => {
              function unescapeString(str: string) {
                // Replace common escape sequences
                return str
                  .replace(/\\n/g, '\n')
                  .replace(/\\r/g, '\r')
                  .replace(/\\t/g, '\t')
                  .replace(/\\"/g, '"')
                  .replace(/\\'/g, "'")
                  .replace(/\\\\/g, '\\');
              }
              try {
                const parsed = JSON.parse(message.raw);
                return unescapeString(JSON.stringify(parsed, null, 2));
              } catch {
                return unescapeString(message.raw);
              }
            })()}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

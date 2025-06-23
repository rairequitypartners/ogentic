import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useAutonomousAgent } from '@/hooks/useAutonomousAgent';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createConversation } = useConversations();
  const { sendMessage, setMessages, setCurrentConversationId } = useAutonomousAgent();
  const { toast } = useToast();

  const handleQuerySubmit = async (query: string) => {
    if (!query.trim()) return;

    // For anonymous users or users, the conversation starts in memory
    setMessages([]); // Clear previous messages
    setCurrentConversationId(null); // Ensure we're starting fresh

    // Navigate to the main chat page, which will handle sending the message
    navigate('/chat', { state: { newQuery: query } });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header showNewStackButton={false} />
      <main className="flex-1 flex flex-col">
        <WelcomeScreen onQuerySubmit={handleQuerySubmit} />
      </main>
    </div>
  );
};

export default WelcomePage; 
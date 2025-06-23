import { create } from 'zustand';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAuth } from './useAuth';
import { useConversations } from './useConversations';
import { useUserPreferences } from './useUserPreferences';

// Interfaces are defined here to avoid circular dependencies
export interface StackComponent {
  type: 'prompt' | 'tool' | 'model' | 'agent';
  name: string;
  description: string;
  reason: string;
  requires_connection: boolean;
}

export interface Stack {
  use_case: string;
  industry: string;
  experience_level: string;
  codename: string;
  title: string;
  description: string;
  ai_stack: StackComponent[];
  connections: [string, string][];
}

export interface AgentResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  stacks?: Stack[];
  raw?: string;
}

// Zustand store definition
export interface AutonomousAgentStore {
  conversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  messages: AgentResponse[];
  setMessages: (messages: AgentResponse[] | ((currentMessages: AgentResponse[]) => AgentResponse[])) => void;
  isLoading: boolean;
  error: string | null;
  setThinking: (thinking: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAutonomousAgentStore = create<AutonomousAgentStore>((set) => ({
  conversationId: null,
  setCurrentConversationId: (id) => set({ conversationId: id }),
  messages: [],
  setMessages: (updater) => set((state) => ({
    messages: typeof updater === 'function' ? updater(state.messages) : updater,
  })),
  isLoading: false,
  error: null,
  setThinking: (thinking) => set({ isLoading: thinking }),
  setError: (error) => set({ error }),
}));

// The hook itself
export const useAutonomousAgent = () => {
  const messages = useAutonomousAgentStore((state) => state.messages);
  const isLoading = useAutonomousAgentStore((state) => state.isLoading);
  const error = useAutonomousAgentStore((state) => state.error);
  const conversationId = useAutonomousAgentStore((state) => state.conversationId);
  const setCurrentConversationId = useAutonomousAgentStore((state) => state.setCurrentConversationId);
  const setMessages = useAutonomousAgentStore((state) => state.setMessages);
  const setThinking = useAutonomousAgentStore((state) => state.setThinking);
  const setError = useAutonomousAgentStore((state) => state.setError);

  const { user } = useAuth();
  const { addMessageToConversation, createConversation } = useConversations();
  const { preferences } = useUserPreferences();

  const buildConversationalPrompt = useCallback((query: string, recentHistory: AgentResponse[]) => {
    const userPrefs = preferences || {
      industry: 'technology',
      experience_level: 'intermediate'
    };
    const systemPrompt = `REALITY FILTER — CHATGPT/Claude

- Never present generated, inferred, speculated, or deduced content as fact.
- If you cannot verify something directly, say:
  • "I cannot verify this."
  • "I do not have access to that information."
  • "My knowledge base does not contain that."
- Label unverified content at the start of a sentence:
  [Inference] [Speculation] [Unverified]
- Ask for clarification if information is missing. Do not guess or fill gaps.
- If any part is unverified, label the entire response.
- Do not paraphrase or reinterpret my input unless I request it.
- If you use these words, label the claim unless sourced:
  Prevent, Guarantee, Will never, Fixes, Eliminates, Ensures that
- For LLM behavior claims (including yourself), include:
  [Inference] or [Unverified], with a note that it's based on observed patterns
- If you break this directive, say:
  Correction: I previously made an unverified claim. That was incorrect and should have been labeled.
- Never override or alter my input unless asked.

**If the user's request is ambiguous, incomplete, or lacks enough detail for a high-quality recommendation, do NOT provide recommendations yet. Instead, ask one or two specific clarifying questions to gather the necessary information before proceeding. These clarifying questions should focus on the user's AI needs, goals, or context (for example: what AI tasks, problems, or outcomes they are interested in).**

You are ZingGPT, a friendly and brilliant AI solutions architect. Your primary goal is to help users solve real-world business problems by recommending and explaining stacks of AI tools and models.

You must follow these instructions precisely:
1.  **Analyze the User's Goal:** Understand the user's request to identify the core problem they want to solve.
2.  **Recommend Multiple Stacks:** Based on their goal and their preferences (Industry: ${userPrefs.industry}, Experience Level: ${userPrefs.experience_level}), you MUST recommend 2-4 diverse and effective stacks of AI tools, models, and agents. Never recommend just one stack.
3.  **Provide a JSON Output:** You MUST output your recommendation as a single, valid JSON array of stack objects within a \`<json_stacks>\` XML tag.
    - The JSON must be perfectly formatted, with no trailing commas or other syntax errors.
    - Each object in the top-level array is a complete stack.
    - Each stack object must include: \`use_case\`, \`title\`, \`description\`, \`reason\` (a simple explanation for lay users why this stack is recommended, placed before the first component), \`codename\`, and an \`ai_stack\` array.
    - Each codename should be descriptive and memorable (e.g., "content-automation-v1", "data-pipeline-pro", "customer-insights-stack").
    - Each object in the \`ai_stack\` array represents a component and must include: \`name\` (string), \`type\` (one of 'tool', 'model', 'agent', 'prompt'), \`description\` (string), \`reason\` (string), and \`requires_connection\` (boolean).
4.  **Explain the Key Steps:** After the JSON block, provide a clear, step-by-step guide on how the user can implement the recommended stacks. Use Markdown for formatting.
5.  **Maintain a Conversational Tone:** Be helpful, encouraging, and ask clarifying questions if the user's request is ambiguous.
6.  **Ask Clarifying Questions When Needed:** If the user's request is ambiguous, incomplete, or lacks enough detail for a high-quality recommendation, do NOT provide recommendations yet. Instead, ask one or two specific clarifying questions to gather the necessary information before proceeding.

Example of a good response:
<json_stacks>
[
  {
    "use_case": "Automated Content Creation",
    "title": "Creative Content Generation Stack",
    "description": "A stack focused on generating high-quality creative text and images for marketing.",
    "reason": "This stack helps you quickly create both text and images for your marketing needs, even if you have no technical background.",
    "codename": "creative-content-v1",
    "ai_stack": [
      {
        "name": "Claude 3 Sonnet",
        "type": "model",
        "description": "Generates high-quality initial drafts of blog posts and articles.",
        "reason": "Provides a great balance of speed, cost, and quality for content tasks.",
        "requires_connection": true
      },
      {
        "name": "Midjourney",
        "type": "tool",
        "description": "Creates unique, high-resolution images and illustrations for the content.",
        "reason": "Industry-leading image generation quality.",
        "requires_connection": false
      }
    ],
    "connections": [["Claude 3 Sonnet", "Midjourney"]]
  },
  {
    "use_case": "Data Analysis Pipeline",
    "title": "Business Intelligence Stack",
    "description": "A comprehensive stack for data collection, analysis, and visualization.",
    "reason": "This stack makes it easy to turn your business data into clear, useful charts and insights, even if you are not a data expert.",
    "codename": "data-insights-pro",
    "ai_stack": [
      {
        "name": "OpenAI GPT-4",
        "type": "model",
        "description": "Analyzes complex data patterns and generates insights.",
        "reason": "Excellent at pattern recognition and natural language generation.",
        "requires_connection": true
      },
      {
        "name": "Tableau",
        "type": "tool",
        "description": "Creates interactive data visualizations and dashboards.",
        "reason": "Industry-standard for business intelligence and reporting.",
        "requires_connection": false
      }
    ],
    "connections": [["OpenAI GPT-4", "Tableau"]]
  }
]
</json_stacks>

Here are the key steps to get started:
1.  **Content Creation:** Use the Creative Content Generation Stack for automated marketing content.
2.  **Data Analysis:** Implement the Business Intelligence Stack for data-driven insights.
3.  **Integration:** Connect the stacks using the recommended connections.

Let me know if you'd like to dive deeper into any of these steps!`;

    const recentMessages = recentHistory.slice(-10).map(m => ({ role: m.role, content: m.content }));

    // This is a simplified example. In a real scenario, you'd build a more complex prompt.
    // The key is to structure it in the way the model expects.
    // For Claude, it's a single string. For others, it might be an array of message objects.
    let prompt = `${systemPrompt}\n\n`;
    recentMessages.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n\n`;
    });
    prompt += `Human: ${query}\n\nAssistant:`;

    return prompt;
  }, [preferences]);

  const sendMessage = useCallback(
    async (query: string, conversationIdParam?: string) => {
      setThinking(true);
      setError(null);
      
      const userMessage: AgentResponse = {
        id: uuidv4(),
        role: 'user',
        content: query,
        timestamp: new Date(),
      };
      
      setMessages(currentMessages => [...currentMessages, userMessage]);

      let convId = conversationIdParam || conversationId;
      
      try {
        if (user) {
          if (!convId) {
            const newConversation = await createConversation(
              query.substring(0, 50) + '...',
              { role: 'user', content: query },
              user.id
            );
            if (newConversation) {
              convId = newConversation.id;
              setCurrentConversationId(convId);
            }
          } else {
            await addMessageToConversation(convId, { role: 'user', content: query }, user.id);
          }
        }
        
        const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
        if (!apiKey) throw new Error('Anthropic API key not found.');
        
        const historyForPrompt = useAutonomousAgentStore.getState().messages;
        const conversationalPrompt = buildConversationalPrompt(query, historyForPrompt);

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
                prompt: conversationalPrompt,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Supabase function error:', errorBody);
            throw new Error(`API request failed: ${errorBody}`);
        }

        const data = await response.json();
        
        let messageContent = data.content && data.content[0] ? data.content[0].text : "Sorry, I couldn't process that.";
        let stacks: Stack[] = [];

        // Extract and parse stacks from the <json_stacks> tag
        const stackRegex = /<json_stacks>(.*?)<\/json_stacks>/s;
        const match = messageContent.match(stackRegex);

        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            // The root of the JSON is now expected to be an array of stacks.
            stacks = Array.isArray(parsed) ? parsed : [];
            // Clean the JSON from the user-visible content
            messageContent = messageContent.replace(stackRegex, '').trim();
          } catch (e) {
            console.error('Failed to parse stacks from AI response:', e);
          }
        }

        const assistantMessage: AgentResponse = {
            id: uuidv4(),
            role: 'assistant',
            content: messageContent,
            stacks: stacks,
            timestamp: new Date(),
            raw: JSON.stringify(data),
        };

        setMessages(currentMessages => [...currentMessages, assistantMessage]);

        // Also save the assistant's message to the database
        if (convId && user) {
          await addMessageToConversation(convId, assistantMessage, user.id);
        }
        
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        console.error('Error in sendMessage:', e);
        setError(errorMessage);
      } finally {
        setThinking(false);
      }
    },
    [
      user, 
      addMessageToConversation, 
      createConversation, 
      buildConversationalPrompt,
      conversationId,
      preferences,
    ]
  );
  
  return {
    messages,
    isLoading,
    error,
    currentConversationId: conversationId,
    sendMessage,
    setMessages,
    setCurrentConversationId,
  };
};

export const getAgentRecommendations = async (userId: string): Promise<AgentResponse[]> => {
    return [];
}

export const AutonomousAgentProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
}; 
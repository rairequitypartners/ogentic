import { create } from 'zustand';
import { useCallback, useState } from 'react';
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
  prompt?: string; // Optional prompt text for prompt components
  link?: string; // Optional link to the component's official website or documentation
}

export interface Stack {
  use_case: string;
  industry: string;
  experience_level: string;
  codename: string;
  title: string;
  description: string;
  reason: string;
  ai_stack: StackComponent[];
  connections: [string, string][];
  map?: {
    nodes: any[];
    edges: any[];
  };
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
  retryCount: number;
  setRetryCount: (count: number) => void;
  currentModel: string;
  setCurrentModel: (model: string) => void;
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
  retryCount: 0,
  setRetryCount: (count) => set({ retryCount: count }),
  currentModel: 'claude-3-haiku-20240307',
  setCurrentModel: (model) => set({ currentModel: model }),
}));

// The hook itself
export const useAutonomousAgent = () => {
  const messages = useAutonomousAgentStore((state) => state.messages);
  const isLoading = useAutonomousAgentStore((state) => state.isLoading);
  const error = useAutonomousAgentStore((state) => state.error);
  const conversationId = useAutonomousAgentStore((state) => state.conversationId);
  const retryCount = useAutonomousAgentStore((state) => state.retryCount);
  const currentModel = useAutonomousAgentStore((state) => state.currentModel);
  const setCurrentConversationId = useAutonomousAgentStore((state) => state.setCurrentConversationId);
  const setMessages = useAutonomousAgentStore((state) => state.setMessages);
  const setThinking = useAutonomousAgentStore((state) => state.setThinking);
  const setError = useAutonomousAgentStore((state) => state.setError);
  const setRetryCount = useAutonomousAgentStore((state) => state.setRetryCount);
  const setCurrentModel = useAutonomousAgentStore((state) => state.setCurrentModel);

  const { user } = useAuth();
  const { addMessageToConversation, createConversation } = useConversations();
  const { preferences } = useUserPreferences();
  
  const [pendingClarifications, setPendingClarifications] = useState<string[]>([]);

  const buildConversationalPrompt = useCallback((query: string, recentHistory: AgentResponse[], isRetry: boolean = false) => {
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

**If the user's request is ambiguous, incomplete, or lacks enough detail for a high-quality recommendation, do NOT provide recommendations yet. Instead, output your clarifying questions inside a <clarification_block>...</clarification_block> tag. The block should contain ONLY the list of questions (one per line, bullet, or number), with NO extra text, explanation, or preamble.**

**IMPORTANT: When you output a <clarification_block>, you MUST wait for the user's response before providing any recommendations, answers, or further information. Never answer your own clarifying questions. Do not proceed until the user has replied.**

**Ask only ONE short, simple clarifying question at a time if possible, but if multiple are needed, list them clearly. Wait for the user's answer(s) before proceeding.**

Example:
User: I want to use AI in my business.
Assistant: <clarification_block>1. What do you want AI to help with in your business?</clarification_block>
User: I want to automate emails.
Assistant: <clarification_block>1. What kind of emails do you want to automate?</clarification_block>
User: I want to automate customer support and marketing emails.
Assistant: <clarification_block>1. What tools do you currently use for customer support?\n2. What tools do you use for marketing emails?</clarification_block>
User: We use Zendesk for support and Mailchimp for marketing.
Assistant: [Now provide recommendations]

You are ZingGPT, a friendly and brilliant AI solutions architect. Your primary goal is to help users solve real-world business problems by recommending and explaining stacks of AI tools and models.

You must follow these instructions precisely:
1.  **Analyze the User's Goal:** Understand the user's request to identify the core problem they want to solve.
2.  **Recommend Stacks:** Based on their goal and their preferences (Industry: ${userPrefs.industry}, Experience Level: ${userPrefs.experience_level}), recommend 1-4 diverse and effective stacks of AI tools, models, and agents. Provide the number of stacks that best fits the user's needs.
3.  **Provide a JSON Output:** You MUST output your recommendation as a single, valid JSON array of stack objects within a \`<json_stacks>\` XML tag.
    - The JSON must be perfectly formatted, with no trailing commas or other syntax errors.
    - Each object in the top-level array is a complete stack.
    - Each stack object must include: \`use_case\`, \`title\`, \`description\`, \`reason\` (a simple explanation for lay users why this stack is recommended), \`codename\`, an \`ai_stack\` array, and a \`map\` field for visualizing the stack.
    - The \`map\` field should be an object with two arrays: \`nodes\` and \`edges\`. Each node should have: \`id\`, \`label\`, \`type\`, \`icon\` (URL or emoji if available), and a short \`description\`. Each edge should have: \`source\`, \`target\`, and optionally a \`label\`.
    - Make the map clear and visually useful for React Flow, but not clumsy or overloaded with information.
    - Each codename should be descriptive and memorable (e.g., "content-automation-v1", "data-pipeline-pro", "customer-insights-stack").
    - Each object in the \`ai_stack\` array represents a component and must include: \`name\` (string), \`type\` (one of 'tool', 'model', 'agent', 'prompt'), \`description\` (string), \`reason\` (string), \`requires_connection\` (boolean), \`prompt\` (string if type is 'prompt'), and **icon** (a URL to the official logo/favicon or a relevant emoji for the component).
    - The \`requires_connection\` property must be set to \`true\` if the component, tool, or model requires an API key, user authentication, or the creation of an account to use it (e.g., OpenAI, Anthropic, Hugging Face, Tableau Cloud, etc.). If the tool can be used without any sign-up, API key, or external connection, set \`requires_connection\` to \`false\`.
    - In the \`map\` field, every node in the \`nodes\` array must also include an **icon** field (URL or emoji) for the component or tool it represents.
    - Example:
      {
        "name": "OpenAI GPT-4",
        "type": "model",
        "icon": "https://platform.openai.com/favicon.ico",
        ...
      }
      {
        "id": "tableau",
        "label": "Tableau",
        "icon": "https://www.tableau.com/sites/default/files/favicon_0.ico",
        ...
      }
      {
        "id": "pandas",
        "label": "Pandas",
        "icon": "🐼",
        ...
      }
4.  **Explain the Key Steps:** After the JSON block, provide a clear, step-by-step guide on how the user can implement the recommended stacks. Use Markdown for formatting.
5.  **Maintain a Conversational Tone:** Be helpful, encouraging, and ask clarifying questions if the user's request is ambiguous.
6.  **Ask Clarifying Questions When Needed:** If the user's request is ambiguous, incomplete, or lacks enough detail for a high-quality recommendation, do NOT provide recommendations yet. Instead, ask one or two specific clarifying questions to gather the necessary information before proceeding.

Example of a good response:
<json_stacks>
[
  {
    "use_case": "Automated Content Creation",
    "title": "Content Generation Stack",
    "description": "A stack for generating high-quality text and images.",
    "reason": "Uses proven, production-ready AI tools for content creation.",
    "codename": "content-gen-v1",
    "ai_stack": [
      {
        "name": "OpenAI GPT-4",
        "type": "model",
        "description": "Generates high-quality text content.",
        "reason": "State-of-the-art language model.",
        "requires_connection": true,
        "link": "https://platform.openai.com/docs/models/gpt-4"
      },
      {
        "name": "Midjourney",
        "type": "tool",
        "description": "Creates unique images from text prompts.",
        "reason": "Popular for AI-generated art.",
        "requires_connection": true,
        "link": "https://www.midjourney.com/"
      }
    ],
    "connections": [["OpenAI GPT-4", "Midjourney"]]
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

Let me know if you'd like to dive deeper into any of these steps!

- If you need to provide context or instructions before the clarifying questions, wrap that text in a <preamble>...</preamble> block.
- If you need to provide follow-up instructions or a summary after the clarifying questions, wrap that text in a <postscript>...</postscript> block.
- Always use <preamble> and <postscript> tags for any such text, and use <clarification_block>...</clarification_block> for the questions themselves.
- Example:
  <preamble>Thank you for your request. To provide the best recommendation, I need a few more details.</preamble>
  <clarification_block>
  1. What type of products do you sell?
  2. Do you have historical sales data?
  </clarification_block>
  <postscript>Once I have your answers, I'll recommend the best AI stack for your needs.</postscript>`;

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

  // Function to get the next model in the fallback chain
  const getNextModel = useCallback(() => {
    const modelChain = [
      'claude-3-5-haiku-20241022',
      'claude-3-haiku-20240307',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-20240620',
      'claude-3-7-sonnet-20250219',
      'claude-sonnet-4-20250514',
      'claude-3-opus-20240229',
      'claude-opus-4-20250514',
      // Add OpenAI models if desired, e.g. 'gpt-4o-mini', 'gpt-4o'
    ];
    const currentIndex = modelChain.indexOf(currentModel);
    const nextIndex = Math.min(currentIndex + 1, modelChain.length - 1);
    return modelChain[nextIndex];
  }, [currentModel]);

  const sendMessage = useCallback(
    async (query: string, conversationIdParam?: string, isRetry: boolean = false) => {
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
        const conversationalPrompt = buildConversationalPrompt(query, historyForPrompt, isRetry);
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            prompt: conversationalPrompt,
            model: currentModel, // Pass the current model to the edge function
          }),
        });
        if (!response.ok) {
          const errorBody = await response.text();
          // Check for Anthropic not_found_error and skip to next model
          try {
            const errorJson = JSON.parse(errorBody);
            if (errorJson.details && errorJson.details.includes('not_found_error')) {
              const nextModel = getNextModel();
              if (nextModel !== currentModel) {
                setCurrentModel(nextModel);
                await sendMessage(query, convId, true);
                return;
              }
            }
          } catch {}
          console.error('Supabase function error:', errorBody);
          throw new Error(`API request failed: ${errorBody}`);
        }
        const data = await response.json();
        console.log('[DEBUG] Raw agent response:', data);
        
        // Always extract the text field if present
        let messageContent = '';
        if (data.content && Array.isArray(data.content) && data.content[0] && data.content[0].text) {
          messageContent = data.content[0].text;
        } else if (typeof data.content === 'string') {
          messageContent = data.content;
        } else {
          messageContent = "Sorry, I couldn't process that.";
        }
        console.log('[DEBUG] Agent message text:', messageContent);
        let stacks: Stack[] = [];

        // Extract and parse stacks from the <json_stacks> tag
        const stackRegex = /<json_stacks>(.*?)<\/json_stacks>/s;
        const match = messageContent.match(stackRegex);

        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            stacks = Array.isArray(parsed) ? parsed : [];
            console.log('[DEBUG] Successfully parsed stacks:', stacks.length);
            messageContent = messageContent.replace(stackRegex, '').trim();
            messageContent = messageContent.replace(/<\/?[a-z_]+>/gi, '').trim();
            messageContent = messageContent.replace(/```[\s\S]*?```/g, '').trim();
            messageContent = messageContent.replace(/^\{[\s\S]*\}$/gm, '').trim();
            if (!messageContent || messageContent.length < 5) {
              messageContent = 'Here are your recommended stacks. See the sidebar for details.';
            }
          } catch (e) {
            console.error('Failed to parse stacks from AI response:', e);
          }
        } else {
          // Try to extract and parse <json_stacks> even if not closed
          let openBlockMatch = messageContent.match(/<json_stacks>([\s\S]*)/i);
          if (openBlockMatch && openBlockMatch[1]) {
            let jsonText = openBlockMatch[1].trim();
            // Try to recover as much as possible
            const lastObj = jsonText.lastIndexOf('}');
            const lastArr = jsonText.lastIndexOf(']');
            let cutoff = Math.max(lastObj, lastArr);
            if (cutoff !== -1) {
              jsonText = jsonText.slice(0, cutoff + 1);
              try {
                const parsed = JSON.parse(jsonText);
                stacks = Array.isArray(parsed) ? parsed : [];
                console.log('[DEBUG] Successfully parsed incomplete stacks:', stacks.length);
                messageContent = messageContent.replace(/<json_stacks>[\s\S]*/i, '').trim();
                if (!messageContent || messageContent.length < 5) {
                  messageContent = 'Here are your recommended stacks. See the sidebar for details.';
                }
              } catch (e) {
                console.error('Failed to parse incomplete stacks:', e);
              }
            }
          }
        }

        console.log('[DEBUG] Final stacks count:', stacks.length);
        console.log('[DEBUG] Final message content:', messageContent);

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

        // Clarification block integration (no edge function needed)
        const clarificationBlockMatch = assistantMessage.content.match(/<clarification_block>([\s\S]*?)<\/clarification_block>/i);
        if (
          assistantMessage.role === 'assistant' &&
          clarificationBlockMatch &&
          clarificationBlockMatch[1].trim().length > 0
        ) {
          const clarificationContent = clarificationBlockMatch[1].trim();
          // Split by line, bullet, or number
          const questions = clarificationContent
            .split(/\n|^\s*\d+\.\s*|^\s*[-*]\s*/gm)
            .map(q => q.trim())
            .filter(q => q.length > 0);
          if (questions.length > 0) {
            setPendingClarifications(questions);
          }
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
      currentModel,
      getNextModel,
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
    pendingClarifications,
    setPendingClarifications,
    retryCount,
    currentModel,
  };
};

export const getAgentRecommendations = async (userId: string): Promise<AgentResponse[]> => {
    return [];
  }

export const AutonomousAgentProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
}; 
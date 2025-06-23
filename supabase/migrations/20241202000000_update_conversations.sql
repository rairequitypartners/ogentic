-- Drop existing trigger and function if they exist to avoid errors
DROP TRIGGER IF EXISTS update_agent_conversations_updated_at ON public.agent_conversations;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create conversations table to group messages
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rename agent_conversations to messages
ALTER TABLE IF EXISTS public.agent_conversations RENAME TO messages;

-- Add conversation_id to messages table
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE;

-- Update indexes for new table name and columns
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);

-- Re-enable RLS on the new table name if it was disabled
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Drop old RLS policies on agent_conversations if they exist
DROP POLICY IF EXISTS "Users can view their own agent conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert their own agent conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own agent conversations" ON public.messages;

-- Create RLS policies for conversations
CREATE POLICY "Users can manage their own conversations" ON public.conversations
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for messages
CREATE POLICY "Users can manage their own messages" ON public.messages
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for updated_at on both tables
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
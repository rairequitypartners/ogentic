-- Create agent_conversations table
CREATE TABLE IF NOT EXISTS public.agent_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    recommendations JSONB DEFAULT '[]'::jsonb,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    reasoning TEXT,
    user_feedback TEXT CHECK (user_feedback IN ('positive', 'negative', 'neutral')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user_id ON public.agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_created_at ON public.agent_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user_feedback ON public.agent_conversations(user_feedback);

-- Enable RLS
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own agent conversations" ON public.agent_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent conversations" ON public.agent_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent conversations" ON public.agent_conversations
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_agent_conversations_updated_at 
    BEFORE UPDATE ON public.agent_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
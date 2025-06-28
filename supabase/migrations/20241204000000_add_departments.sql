-- Create departments table for organizing conversations
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6', -- Default blue color
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add department_id to conversations table
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_departments_user_id ON public.departments(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_department_id ON public.conversations(department_id);

-- Enable RLS on departments table
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for departments
CREATE POLICY "Users can manage their own departments" ON public.departments
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at on departments
CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON public.departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default departments for existing users
INSERT INTO public.departments (user_id, name, description, color)
SELECT DISTINCT 
    user_id,
    'General' as name,
    'Default department for general conversations' as description,
    '#3b82f6' as color
FROM public.conversations
WHERE department_id IS NULL;

-- Update existing conversations to use the default department
UPDATE public.conversations
SET department_id = (
    SELECT id FROM public.departments 
    WHERE user_id = conversations.user_id 
    AND name = 'General'
    LIMIT 1
)
WHERE department_id IS NULL; 
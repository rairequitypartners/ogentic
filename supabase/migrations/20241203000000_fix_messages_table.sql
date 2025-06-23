-- Alter messages table to match the new structure
-- Drop old columns that are no longer needed
ALTER TABLE public.messages
DROP COLUMN IF EXISTS query,
DROP COLUMN IF EXISTS response,
DROP COLUMN IF EXISTS recommendations,
DROP COLUMN IF EXISTS confidence,
DROP COLUMN IF EXISTS reasoning,
DROP COLUMN IF EXISTS user_feedback;

-- Add new columns for the unified message format
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
ADD COLUMN IF NOT EXISTS content TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS stack JSONB;

-- Rename created_at to timestamp for consistency
ALTER TABLE public.messages
RENAME COLUMN created_at TO timestamp;

-- We can also remove the old trigger on messages if it's not needed, 
-- but we will keep updated_at and its trigger for now.
-- The RLS policies should still work as they are based on user_id. 
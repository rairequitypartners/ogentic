ALTER TABLE saved_stacks
ADD COLUMN deployment_status TEXT DEFAULT 'not_deployed',
ADD COLUMN is_public BOOLEAN DEFAULT false,
ADD COLUMN deployed_at TIMESTAMPTZ; 
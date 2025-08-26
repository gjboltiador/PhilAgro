-- Migration: Add logo field to associations table
-- Add logo_url field to store association logos

ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500) NULL 
AFTER website;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_associations_logo ON associations(logo_url);

-- Update existing records to have a default placeholder if needed
UPDATE associations 
SET logo_url = NULL 
WHERE logo_url IS NULL;

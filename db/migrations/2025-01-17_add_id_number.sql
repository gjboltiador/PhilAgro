-- Migration: Add id_number column to user_profiles table
-- Date: 2025-01-17
-- Description: Add ID number field to store user identification numbers

-- Add id_number column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN id_number VARCHAR(100) NULL DEFAULT NULL 
AFTER id_type;

-- Optional: Add comment for clarity
ALTER TABLE user_profiles 
MODIFY COLUMN id_number VARCHAR(100) NULL DEFAULT NULL COMMENT 'User identification number (e.g., Driver License Number, TIN, etc.)';



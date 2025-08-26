-- Migration: Enhance associations table for complete functionality
-- Add missing fields to match frontend requirements

ALTER TABLE associations
  ADD COLUMN IF NOT EXISTS short_name VARCHAR(100) NULL AFTER name,
  ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255) NULL AFTER contact_email,
  ADD COLUMN IF NOT EXISTS website VARCHAR(255) NULL AFTER phone,
  ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100) NULL AFTER address,
  ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100) NULL AFTER registration_number,
  ADD COLUMN IF NOT EXISTS dues_amount DECIMAL(12,2) NULL DEFAULT 0 AFTER tax_id,
  ADD COLUMN IF NOT EXISTS dues_frequency ENUM('monthly','quarterly','annually') NULL DEFAULT 'annually' AFTER dues_amount,
  ADD COLUMN IF NOT EXISTS crop_year VARCHAR(20) NULL DEFAULT '2024-2025' AFTER dues_frequency,
  ADD COLUMN IF NOT EXISTS status ENUM('active','inactive') NOT NULL DEFAULT 'active' AFTER crop_year,
  ADD COLUMN IF NOT EXISTS member_count INT UNSIGNED NULL DEFAULT 0 AFTER status,
  ADD COLUMN IF NOT EXISTS updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Update the assoc_type enum to include more specific types
ALTER TABLE associations 
  MODIFY COLUMN assoc_type ENUM('cooperative','association','union','federation','company','other') NOT NULL DEFAULT 'association';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_associations_status ON associations(status);
CREATE INDEX IF NOT EXISTS idx_associations_crop_year ON associations(crop_year);
CREATE INDEX IF NOT EXISTS idx_associations_short_name ON associations(short_name);

-- Update existing records to have proper status if null
UPDATE associations SET status = 'active' WHERE status IS NULL;

-- Migration: expand planters with personal and address fields
ALTER TABLE planters
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(100) NOT NULL AFTER user_id,
  ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100) NULL AFTER first_name,
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(100) NOT NULL AFTER middle_name,
  ADD COLUMN IF NOT EXISTS contact_number VARCHAR(50) NOT NULL AFTER last_name,
  ADD COLUMN IF NOT EXISTS email_address VARCHAR(255) NULL AFTER contact_number,
  ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(500) NULL AFTER email_address,
  ADD COLUMN IF NOT EXISTS valid_id_type VARCHAR(100) NULL AFTER profile_picture_url,
  ADD COLUMN IF NOT EXISTS valid_id_number VARCHAR(100) NULL AFTER valid_id_type,
  ADD COLUMN IF NOT EXISTS valid_id_image_url VARCHAR(500) NULL AFTER valid_id_number,
  ADD COLUMN IF NOT EXISTS address_line VARCHAR(255) NOT NULL AFTER valid_id_image_url,
  ADD COLUMN IF NOT EXISTS barangay VARCHAR(100) NOT NULL AFTER address_line,
  ADD COLUMN IF NOT EXISTS municipality VARCHAR(100) NOT NULL AFTER barangay,
  ADD COLUMN IF NOT EXISTS province VARCHAR(100) NOT NULL AFTER municipality,
  ADD COLUMN IF NOT EXISTS registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER province,
  ADD COLUMN IF NOT EXISTS status ENUM('active','pending','inactive') NOT NULL DEFAULT 'pending' AFTER registration_date;



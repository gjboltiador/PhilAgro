-- Migration: Add valid_id_types table and update planters table
-- Date: 2025-01-27
-- Description: Create a separate table for valid ID types and link it with planters

-- Create valid_id_types table
CREATE TABLE IF NOT EXISTS valid_id_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert standard valid ID types
INSERT INTO valid_id_types (name, description) VALUES
('Philippine Passport', 'Official passport issued by the Philippine government'),
('Driver\'s License', 'License to operate motor vehicles'),
('SSS ID', 'Social Security System identification card'),
('GSIS ID', 'Government Service Insurance System identification card'),
('PhilHealth ID', 'Philippine Health Insurance Corporation identification card'),
('TIN ID', 'Tax Identification Number card'),
('Postal ID', 'Postal identification card'),
('Voter\'s ID', 'Voter identification card'),
('Senior Citizen ID', 'Senior citizen identification card'),
('UMID', 'Unified Multi-Purpose ID'),
('PRC ID', 'Professional Regulation Commission ID'),
('OWWA ID', 'Overseas Workers Welfare Administration ID'),
('OFW ID', 'Overseas Filipino Worker ID'),
('Seaman\'s Book', 'Seafarer\'s identification and record book'),
('Alien Certificate of Registration', 'ACR for foreign nationals'),
('Certificate of Naturalization', 'Certificate for naturalized citizens'),
('National ID', 'Philippine National ID'),
('Other Government-Issued ID', 'Other valid government-issued identification');

-- Add new column to planters table for foreign key
ALTER TABLE planters 
ADD COLUMN valid_id_type_id INT NULL AFTER id_type,
ADD INDEX idx_planters_valid_id_type (valid_id_type_id);

-- Add foreign key constraint
ALTER TABLE planters 
ADD CONSTRAINT fk_planters_valid_id_type 
FOREIGN KEY (valid_id_type_id) REFERENCES valid_id_types(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrate existing data from id_type string to valid_id_type_id
-- First, let's update records where we can match the existing id_type values
UPDATE planters p 
JOIN valid_id_types v ON (
  (p.id_type = 'Driver\'s License' AND v.name = 'Driver\'s License') OR
  (p.id_type = 'SSS ID' AND v.name = 'SSS ID') OR
  (p.id_type = 'TIN' AND v.name = 'TIN ID') OR
  (p.id_type = 'Passport' AND v.name = 'Philippine Passport') OR
  (p.id_type = 'National ID' AND v.name = 'National ID')
)
SET p.valid_id_type_id = v.id;

-- For any remaining unmatched records, create entries in valid_id_types
INSERT IGNORE INTO valid_id_types (name, description) 
SELECT DISTINCT p.id_type, CONCAT('Legacy ID type: ', p.id_type)
FROM planters p 
WHERE p.id_type IS NOT NULL 
  AND p.id_type != '' 
  AND p.valid_id_type_id IS NULL;

-- Update remaining records with the newly created valid_id_type entries
UPDATE planters p 
JOIN valid_id_types v ON p.id_type = v.name
SET p.valid_id_type_id = v.id
WHERE p.valid_id_type_id IS NULL AND p.id_type IS NOT NULL AND p.id_type != '';

-- Add comment to document the migration
ALTER TABLE planters COMMENT = 'Updated to use valid_id_type_id foreign key instead of id_type string';

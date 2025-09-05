-- Migration: Create Planters Table
CREATE TABLE IF NOT EXISTS planters (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL, -- Can be NULL for planters without user accounts
  planter_code VARCHAR(50) NOT NULL UNIQUE, -- Unique planter identifier
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) NULL,
  last_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) NULL,
  
  -- Profile and ID Information
  profile_picture_url VARCHAR(500) NULL,
  valid_id_type ENUM('Philippine Passport', 'Driver\'s License', 'SSS ID', 'GSIS ID', 
                     'PhilHealth ID', 'TIN ID', 'Postal ID', 'Voter\'s ID', 
                     'Senior Citizen ID', 'UMID (Unified Multi-Purpose ID)', 
                     'PRC ID', 'OWWA ID', 'OFW ID', 'Seaman\'s Book', 
                     'Alien Certificate of Registration (ACR)', 
                     'Certificate of Naturalization', 'Other Government-Issued ID') NULL,
  valid_id_number VARCHAR(100) NULL,
  valid_id_image_url VARCHAR(500) NULL,
  
  -- Address Information
  complete_address TEXT NOT NULL,
  barangay VARCHAR(100) NOT NULL,
  municipality VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  
  -- Business Relationships
  sugar_mill_id BIGINT UNSIGNED NULL,
  association_id BIGINT UNSIGNED NULL,
  crop_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
  
  -- Farm Information
  total_farm_area DECIMAL(10,2) NULL, -- in hectares
  sugarcane_area DECIMAL(10,2) NULL, -- in hectares
  other_crops_area DECIMAL(10,2) NULL, -- in hectares
  
  -- Registration and Status
  registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'pending', 'inactive', 'suspended') NOT NULL DEFAULT 'pending',
  membership_status ENUM('member', 'unaffiliated', 'pending_membership') NOT NULL DEFAULT 'unaffiliated',
  
  -- Additional Information
  emergency_contact_name VARCHAR(255) NULL,
  emergency_contact_number VARCHAR(50) NULL,
  emergency_contact_relationship VARCHAR(100) NULL,
  
  -- System Fields
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_user_id BIGINT UNSIGNED NULL,
  updated_by_user_id BIGINT UNSIGNED NULL,
  
  PRIMARY KEY (id),
  UNIQUE KEY uk_planter_code (planter_code),
  KEY idx_planters_user (user_id),
  KEY idx_planters_sugar_mill (sugar_mill_id),
  KEY idx_planters_association (association_id),
  KEY idx_planters_status (status),
  KEY idx_planters_crop_year (crop_year),
  KEY idx_planters_location (province, municipality),
  KEY idx_planters_name (last_name, first_name),
  KEY idx_planters_email (email_address),
  KEY idx_planters_contact (contact_number),
  KEY idx_planters_valid_id (valid_id_type, valid_id_number),
  KEY idx_planters_registration_date (registration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create sample planter data for testing
INSERT IGNORE INTO planters (
  planter_code, first_name, last_name, contact_number, email_address,
  complete_address, barangay, municipality, province,
  sugar_mill_id, association_id, crop_year,
  total_farm_area, sugarcane_area,
  status, membership_status, registration_date
) VALUES
('P-1001', 'Juan', 'Dela Cruz', '+63 912 345 6789', 'juan.delacruz@example.com',
 'Purok 1, Brgy. Tabuan', 'Tabuan', 'Bayawan City', 'Negros Oriental',
 (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO'),
 (SELECT id FROM associations WHERE short_name = 'NOSPA' LIMIT 1),
 '2024-2025', 25.00, 20.00, 'active', 'member', NOW()),

('P-1002', 'Maria', 'Santos', '+63 923 456 7890', 'maria.santos@example.com',
 'Purok 2, Brgy. Villareal', 'Villareal', 'Bayawan City', 'Negros Oriental',
 (SELECT id FROM sugar_mills WHERE plant_code = 'SONEDCO'),
 (SELECT id FROM associations WHERE short_name = 'BASUCO' LIMIT 1),
 '2024-2025', 18.00, 15.00, 'active', 'member', NOW()),

('P-1003', 'Pedro', 'Reyes', '+63 934 567 8901', 'pedro.reyes@example.com',
 'Sitio Proper, Brgy. Suba', 'Suba', 'Bayawan City', 'Negros Oriental',
 (SELECT id FROM sugar_mills WHERE plant_code = 'TOLONG'),
 (SELECT id FROM associations WHERE short_name = 'TOSPA' LIMIT 1),
 '2024-2025', 32.00, 28.00, 'active', 'member', NOW()),

('P-1004', 'Ana', 'Gonzales', '+63 945 678 9012', 'ana.gonzales@example.com',
 'Brgy. Malabugas', 'Malabugas', 'Bayawan City', 'Negros Oriental',
 (SELECT id FROM sugar_mills WHERE plant_code = 'BUGAY'),
 (SELECT id FROM associations WHERE short_name = 'MASPU' LIMIT 1),
 '2024-2025', 15.00, 12.00, 'pending', 'pending_membership', NOW()),

('P-1005', 'Carlos', 'Mendoza', '+63 956 789 0123', 'carlos.mendoza@example.com',
 'Purok 7, Brgy. Narra', 'Narra', 'Bayawan City', 'Negros Oriental',
 (SELECT id FROM sugar_mills WHERE plant_code = 'CAB'),
 (SELECT id FROM associations WHERE short_name = 'BASUCO' LIMIT 1),
 '2024-2025', 22.00, 18.00, 'inactive', 'unaffiliated', NOW()),

('P-1006', 'Sofia', 'Lim', '+63 967 890 1234', 'sofia.lim@example.com',
 'Brgy. Dawis', 'Dawis', 'Bayawan City', 'Negros Oriental',
 (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO'),
 (SELECT id FROM associations WHERE short_name = 'NOSPA' LIMIT 1),
 '2024-2025', 40.00, 35.00, 'active', 'member', NOW()),

('P-1007', 'Miguel', 'Tan', '+63 978 901 2345', 'miguel.tan@example.com',
 'Brgy. Pagatban', 'Pagatban', 'Bayawan City', 'Negros Oriental',
 (SELECT id FROM sugar_mills WHERE plant_code = 'SONEDCO'),
 (SELECT id FROM associations WHERE short_name = 'BASUCO' LIMIT 1),
 '2024-2025', 28.00, 25.00, 'pending', 'pending_membership', NOW());

SELECT 'Planters table created successfully' as status;

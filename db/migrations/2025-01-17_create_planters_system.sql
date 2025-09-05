-- Migration: Create comprehensive planters system
-- This script creates the complete planters registration system with proper relationships

-- 1. Create Sugar Mills Table
CREATE TABLE IF NOT EXISTS sugar_mills (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  plant_code VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  short_name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  address VARCHAR(255) NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NULL,
  contact_person VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  email VARCHAR(255) NULL,
  website VARCHAR(255) NULL,
  registration_number VARCHAR(100) NULL,
  tax_id VARCHAR(100) NULL,
  capacity DECIMAL(10,2) NULL,
  capacity_unit ENUM('tons', 'metric_tons') DEFAULT 'tons',
  operating_status ENUM('operational', 'maintenance', 'closed', 'seasonal') DEFAULT 'operational',
  crop_year VARCHAR(20) DEFAULT '2024-2025',
  start_date DATE NULL,
  end_date DATE NULL,
  manager_name VARCHAR(255) NULL,
  manager_phone VARCHAR(50) NULL,
  manager_email VARCHAR(255) NULL,
  latitude DECIMAL(10,8) NULL,
  longitude DECIMAL(11,8) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sugar_mills_plant_code (plant_code),
  KEY idx_sugar_mills_status (operating_status),
  KEY idx_sugar_mills_location (city, province)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Insert sample sugar mills data first
INSERT IGNORE INTO sugar_mills (plant_code, full_name, short_name, city, province, operating_status) VALUES
('URSUMCO', 'United Robina Sugar Milling Corporation', 'URSUMCO', 'Dumaguete City', 'Negros Oriental', 'operational'),
('SONEDCO', 'Southern Negros Development Corporation', 'SONEDCO', 'Bayawan City', 'Negros Oriental', 'operational'),
('TOLONG', 'Tolong Sugar Milling Company', 'TOLONG', 'Tolong', 'Negros Oriental', 'operational'),
('BUGAY', 'Bugay Sugar Milling Corporation', 'BUGAY', 'Mabinay', 'Negros Oriental', 'operational'),
('CAB', 'Central Azucarera de Bais', 'CAB', 'Bais City', 'Negros Oriental', 'operational');

-- 3. Update associations table to include sugar_mill_id if not exists
ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS sugar_mill_id BIGINT UNSIGNED NULL AFTER id;

-- 4. Update existing associations with sugar mill relationships
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO') WHERE short_name = 'NOSPA' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'SONEDCO') WHERE short_name = 'BASUCO' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'BUGAY') WHERE short_name = 'MASPU' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'TOLONG') WHERE short_name = 'TOSPA' AND sugar_mill_id IS NULL;

-- 5. Create Planters Table
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

-- 6. Create Planter Memberships Table
CREATE TABLE IF NOT EXISTS planter_memberships (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  planter_id BIGINT UNSIGNED NOT NULL,
  association_id BIGINT UNSIGNED NOT NULL,
  sugar_mill_id BIGINT UNSIGNED NOT NULL,
  crop_year VARCHAR(20) NOT NULL,
  membership_date DATE NOT NULL,
  membership_status ENUM('active', 'inactive', 'suspended', 'terminated') NOT NULL DEFAULT 'active',
  dues_status ENUM('paid', 'pending', 'overdue', 'waived') NOT NULL DEFAULT 'pending',
  last_payment_date DATE NULL,
  dues_amount DECIMAL(12,2) NULL DEFAULT 0,
  has_deliveries BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_count INT UNSIGNED NULL DEFAULT 0,
  total_delivered DECIMAL(12,3) NULL DEFAULT 0, -- in tons
  can_transfer BOOLEAN NOT NULL DEFAULT TRUE,
  transfer_restriction_reason TEXT NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  UNIQUE KEY uk_planter_crop_year (planter_id, crop_year), -- One membership per crop year
  KEY idx_memberships_planter (planter_id),
  KEY idx_memberships_association (association_id),
  KEY idx_memberships_sugar_mill (sugar_mill_id),
  KEY idx_memberships_crop_year (crop_year),
  KEY idx_memberships_status (membership_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Create Planter Farms Table
CREATE TABLE IF NOT EXISTS planter_farms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  planter_id BIGINT UNSIGNED NOT NULL,
  farm_name VARCHAR(255) NULL,
  farm_code VARCHAR(50) NULL,
  location_description TEXT NULL,
  barangay VARCHAR(100) NOT NULL,
  municipality VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  total_area DECIMAL(10,2) NOT NULL, -- in hectares
  sugarcane_area DECIMAL(10,2) NULL, -- in hectares
  other_crops_area DECIMAL(10,2) NULL, -- in hectares
  soil_type VARCHAR(100) NULL,
  irrigation_type ENUM('rainfed', 'irrigated', 'partially_irrigated') NULL,
  farm_status ENUM('active', 'inactive', 'fallow') NOT NULL DEFAULT 'active',
  acquisition_date DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  KEY idx_farms_planter (planter_id),
  KEY idx_farms_location (province, municipality),
  KEY idx_farms_status (farm_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Create sample planter data for testing
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

-- 9. Create sample planter memberships
INSERT IGNORE INTO planter_memberships (
  planter_id, association_id, sugar_mill_id, crop_year, membership_date, membership_status, dues_status
) VALUES
((SELECT id FROM planters WHERE planter_code = 'P-1001'), 
 (SELECT id FROM associations WHERE short_name = 'NOSPA' LIMIT 1),
 (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO'),
 '2024-2025', '2024-01-15', 'active', 'paid'),

((SELECT id FROM planters WHERE planter_code = 'P-1002'), 
 (SELECT id FROM associations WHERE short_name = 'BASUCO' LIMIT 1),
 (SELECT id FROM sugar_mills WHERE plant_code = 'SONEDCO'),
 '2024-2025', '2024-01-20', 'active', 'pending'),

((SELECT id FROM planters WHERE planter_code = 'P-1003'), 
 (SELECT id FROM associations WHERE short_name = 'TOSPA' LIMIT 1),
 (SELECT id FROM sugar_mills WHERE plant_code = 'TOLONG'),
 '2024-2025', '2024-01-25', 'active', 'overdue'),

((SELECT id FROM planters WHERE planter_code = 'P-1006'), 
 (SELECT id FROM associations WHERE short_name = 'NOSPA' LIMIT 1),
 (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO'),
 '2024-2025', '2024-02-01', 'active', 'paid');

-- 10. Create sample farm data
INSERT IGNORE INTO planter_farms (
  planter_id, farm_name, farm_code, barangay, municipality, province,
  total_area, sugarcane_area, soil_type, irrigation_type, farm_status
) VALUES
((SELECT id FROM planters WHERE planter_code = 'P-1001'), 
 'Dela Cruz Farm', 'FC-1001', 'Tabuan', 'Bayawan City', 'Negros Oriental',
 25.00, 20.00, 'Clay Loam', 'irrigated', 'active'),

((SELECT id FROM planters WHERE planter_code = 'P-1002'), 
 'Santos Farm', 'FC-1002', 'Villareal', 'Bayawan City', 'Negros Oriental',
 18.00, 15.00, 'Sandy Loam', 'rainfed', 'active'),

((SELECT id FROM planters WHERE planter_code = 'P-1003'), 
 'Reyes Farm', 'FC-1003', 'Suba', 'Bayawan City', 'Negros Oriental',
 32.00, 28.00, 'Clay Loam', 'partially_irrigated', 'active'),

((SELECT id FROM planters WHERE planter_code = 'P-1006'), 
 'Lim Farm', 'FC-1006', 'Dawis', 'Bayawan City', 'Negros Oriental',
 40.00, 35.00, 'Sandy Loam', 'irrigated', 'active');

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_planters_composite_status ON planters(status, membership_status);
CREATE INDEX IF NOT EXISTS idx_memberships_composite_status ON planter_memberships(membership_status, dues_status);
CREATE INDEX IF NOT EXISTS idx_farms_composite_status ON planter_farms(farm_status, province);
CREATE INDEX IF NOT EXISTS idx_associations_sugar_mill ON associations(sugar_mill_id);

-- Migration completed successfully
SELECT 'Planters system migration completed successfully' as status;

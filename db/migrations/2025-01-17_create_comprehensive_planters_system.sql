-- Migration: Create Comprehensive Planters System
-- This script creates a complete planters registration system with proper relationships
-- Based on analysis of the planters registration page and existing database structure

-- ============================================================================
-- 1. CREATE SUGAR MILLS TABLE (if not exists)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sugar_mills (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  plant_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique plant identifier (e.g., URSUMCO, SONEDCO)',
  full_name VARCHAR(255) NOT NULL COMMENT 'Complete legal name of the sugar mill',
  short_name VARCHAR(100) NOT NULL COMMENT 'Abbreviated name for display purposes',
  description TEXT NULL COMMENT 'Detailed description of the sugar mill facility',
  
  -- Location Information
  address VARCHAR(255) NULL COMMENT 'Street address of the sugar mill',
  city VARCHAR(100) NOT NULL COMMENT 'City where the sugar mill is located',
  province VARCHAR(100) NOT NULL COMMENT 'Province/state where the sugar mill is located',
  postal_code VARCHAR(20) NULL COMMENT 'ZIP/postal code',
  latitude DECIMAL(10,8) NULL COMMENT 'GPS latitude coordinate',
  longitude DECIMAL(11,8) NULL COMMENT 'GPS longitude coordinate',
  
  -- Contact Information
  contact_person VARCHAR(255) NULL COMMENT 'Primary contact person name',
  phone VARCHAR(50) NULL COMMENT 'Primary contact phone number',
  email VARCHAR(255) NULL COMMENT 'Primary contact email address',
  website VARCHAR(255) NULL COMMENT 'Official website URL',
  
  -- Business & Legal Information
  registration_number VARCHAR(100) NULL COMMENT 'Business registration number',
  tax_id VARCHAR(100) NULL COMMENT 'Tax identification number',
  
  -- Operational Capacity
  capacity DECIMAL(10,2) NULL COMMENT 'Milling capacity in specified units',
  capacity_unit ENUM('tons', 'metric_tons') DEFAULT 'tons' COMMENT 'Unit of measurement for capacity',
  
  -- Operational Status & Schedule
  operating_status ENUM('operational', 'maintenance', 'closed', 'seasonal', 'under_construction') 
    DEFAULT 'operational' COMMENT 'Current operational status',
  crop_year VARCHAR(20) DEFAULT '2024-2025' COMMENT 'Current crop year',
  start_date DATE NULL COMMENT 'Milling season start date',
  end_date DATE NULL COMMENT 'Milling season end date',
  
  -- Management Information
  manager_name VARCHAR(255) NULL COMMENT 'Plant manager name',
  manager_phone VARCHAR(50) NULL COMMENT 'Plant manager phone',
  manager_email VARCHAR(255) NULL COMMENT 'Plant manager email',
  
  -- System Fields
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  UNIQUE KEY uk_sugar_mills_plant_code (plant_code),
  KEY idx_sugar_mills_status (operating_status),
  KEY idx_sugar_mills_location (city, province),
  KEY idx_sugar_mills_crop_year (crop_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Sugar mills and processing facilities';

-- ============================================================================
-- 2. INSERT SAMPLE SUGAR MILLS DATA
-- ============================================================================
INSERT IGNORE INTO sugar_mills (plant_code, full_name, short_name, city, province, operating_status) VALUES
('URSUMCO', 'United Robina Sugar Milling Corporation', 'URSUMCO', 'Dumaguete City', 'Negros Oriental', 'operational'),
('SONEDCO', 'Southern Negros Development Corporation', 'SONEDCO', 'Bayawan City', 'Negros Oriental', 'operational'),
('TOLONG', 'Tolong Sugar Milling Company', 'TOLONG', 'Tolong', 'Negros Oriental', 'operational'),
('BUGAY', 'Bugay Sugar Milling Corporation', 'BUGAY', 'Mabinay', 'Negros Oriental', 'operational'),
('CAB', 'Central Azucarera de Bais', 'CAB', 'Bais City', 'Negros Oriental', 'operational');

-- ============================================================================
-- 3. ENHANCE ASSOCIATIONS TABLE
-- ============================================================================
-- Add sugar_mill_id column if not exists
ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS sugar_mill_id BIGINT UNSIGNED NULL AFTER id,
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

-- Add foreign key constraint for sugar_mill_id
ALTER TABLE associations 
ADD CONSTRAINT fk_associations_sugar_mill FOREIGN KEY (sugar_mill_id) REFERENCES sugar_mills(id) ON DELETE SET NULL;

-- ============================================================================
-- 4. CREATE COMPREHENSIVE PLANTERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS planters (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL COMMENT 'Link to users table - can be NULL for planters without user accounts',
  planter_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique planter identifier (e.g., P-1001)',
  
  -- Personal Information (from registration form)
  first_name VARCHAR(100) NOT NULL COMMENT 'Planter first name',
  middle_name VARCHAR(100) NULL COMMENT 'Planter middle name',
  last_name VARCHAR(100) NOT NULL COMMENT 'Planter last name',
  contact_number VARCHAR(50) NOT NULL COMMENT 'Primary contact number',
  email_address VARCHAR(255) NULL COMMENT 'Email address',
  
  -- Profile and ID Information (from registration form)
  profile_picture_url VARCHAR(500) NULL COMMENT 'URL to profile picture',
  valid_id_type ENUM('Philippine Passport', 'Driver\'s License', 'SSS ID', 'GSIS ID', 
                     'PhilHealth ID', 'TIN ID', 'Postal ID', 'Voter\'s ID', 
                     'Senior Citizen ID', 'UMID (Unified Multi-Purpose ID)', 
                     'PRC ID', 'OWWA ID', 'OFW ID', 'Seaman\'s Book', 
                     'Alien Certificate of Registration (ACR)', 
                     'Certificate of Naturalization', 'Other Government-Issued ID') NULL COMMENT 'Type of valid ID',
  valid_id_number VARCHAR(100) NULL COMMENT 'Valid ID number',
  valid_id_image_url VARCHAR(500) NULL COMMENT 'URL to valid ID image',
  
  -- Address Information (from registration form)
  complete_address TEXT NOT NULL COMMENT 'Complete address including house number, street, subdivision',
  barangay VARCHAR(100) NOT NULL COMMENT 'Barangay',
  municipality VARCHAR(100) NOT NULL COMMENT 'Municipality or city',
  province VARCHAR(100) NOT NULL COMMENT 'Province',
  
  -- Business Relationships (from registration form)
  sugar_mill_id BIGINT UNSIGNED NULL COMMENT 'Associated sugar mill',
  association_id BIGINT UNSIGNED NULL COMMENT 'Associated association/cooperative',
  crop_year VARCHAR(20) NOT NULL DEFAULT '2024-2025' COMMENT 'Current crop year',
  
  -- Farm Information
  total_farm_area DECIMAL(10,2) NULL COMMENT 'Total farm area in hectares',
  sugarcane_area DECIMAL(10,2) NULL COMMENT 'Sugarcane area in hectares',
  other_crops_area DECIMAL(10,2) NULL COMMENT 'Other crops area in hectares',
  
  -- Registration and Status
  registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date of registration',
  status ENUM('active', 'pending', 'inactive', 'suspended') NOT NULL DEFAULT 'pending' COMMENT 'Planter status',
  membership_status ENUM('member', 'unaffiliated', 'pending_membership') NOT NULL DEFAULT 'unaffiliated' COMMENT 'Association membership status',
  
  -- Additional Information
  emergency_contact_name VARCHAR(255) NULL COMMENT 'Emergency contact person name',
  emergency_contact_number VARCHAR(50) NULL COMMENT 'Emergency contact number',
  emergency_contact_relationship VARCHAR(100) NULL COMMENT 'Relationship to emergency contact',
  
  -- System Fields
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_user_id BIGINT UNSIGNED NULL COMMENT 'User who created this record',
  updated_by_user_id BIGINT UNSIGNED NULL COMMENT 'User who last updated this record',
  
  PRIMARY KEY (id),
  UNIQUE KEY uk_planter_code (planter_code),
  KEY idx_planters_user (user_id),
  KEY idx_planters_sugar_mill (sugar_mill_id),
  KEY idx_planters_association (association_id),
  KEY idx_planters_status (status),
  KEY idx_planters_membership_status (membership_status),
  KEY idx_planters_crop_year (crop_year),
  KEY idx_planters_location (province, municipality),
  KEY idx_planters_name (last_name, first_name),
  KEY idx_planters_email (email_address),
  KEY idx_planters_contact (contact_number),
  KEY idx_planters_valid_id (valid_id_type, valid_id_number),
  KEY idx_planters_registration_date (registration_date),
  KEY idx_planters_composite_status (status, membership_status),
  
  -- Foreign Key Constraints
  CONSTRAINT fk_planters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_planters_sugar_mill FOREIGN KEY (sugar_mill_id) REFERENCES sugar_mills(id) ON DELETE SET NULL,
  CONSTRAINT fk_planters_association FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE SET NULL,
  CONSTRAINT fk_planters_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_planters_updated_by FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Sugar planters and farmers registration';

-- ============================================================================
-- 5. CREATE PLANTER MEMBERSHIPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS planter_memberships (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  planter_id BIGINT UNSIGNED NOT NULL COMMENT 'Reference to planter',
  association_id BIGINT UNSIGNED NOT NULL COMMENT 'Reference to association',
  sugar_mill_id BIGINT UNSIGNED NOT NULL COMMENT 'Reference to sugar mill',
  crop_year VARCHAR(20) NOT NULL COMMENT 'Crop year for this membership',
  
  -- Membership Details
  membership_date DATE NOT NULL COMMENT 'Date when membership was established',
  membership_status ENUM('active', 'inactive', 'suspended', 'terminated') NOT NULL DEFAULT 'active' COMMENT 'Current membership status',
  
  -- Financial Information
  dues_status ENUM('paid', 'pending', 'overdue', 'waived') NOT NULL DEFAULT 'pending' COMMENT 'Dues payment status',
  last_payment_date DATE NULL COMMENT 'Date of last dues payment',
  dues_amount DECIMAL(12,2) NULL DEFAULT 0 COMMENT 'Annual dues amount',
  
  -- Delivery Tracking
  has_deliveries BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether planter has made deliveries',
  delivery_count INT UNSIGNED NULL DEFAULT 0 COMMENT 'Number of deliveries made',
  total_delivered DECIMAL(12,3) NULL DEFAULT 0 COMMENT 'Total tons delivered',
  
  -- Transfer Restrictions
  can_transfer BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Whether planter can transfer to another association',
  transfer_restriction_reason TEXT NULL COMMENT 'Reason for transfer restriction',
  
  -- Additional Information
  notes TEXT NULL COMMENT 'Additional notes about membership',
  
  -- System Fields
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  UNIQUE KEY uk_planter_crop_year (planter_id, crop_year) COMMENT 'One membership per planter per crop year',
  KEY idx_memberships_planter (planter_id),
  KEY idx_memberships_association (association_id),
  KEY idx_memberships_sugar_mill (sugar_mill_id),
  KEY idx_memberships_crop_year (crop_year),
  KEY idx_memberships_status (membership_status),
  KEY idx_memberships_dues_status (dues_status),
  KEY idx_memberships_composite_status (membership_status, dues_status),
  
  -- Foreign Key Constraints
  CONSTRAINT fk_memberships_planter FOREIGN KEY (planter_id) REFERENCES planters(id) ON DELETE CASCADE,
  CONSTRAINT fk_memberships_association FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE RESTRICT,
  CONSTRAINT fk_memberships_sugar_mill FOREIGN KEY (sugar_mill_id) REFERENCES sugar_mills(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Planter association memberships per crop year';

-- ============================================================================
-- 6. CREATE PLANTER FARMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS planter_farms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  planter_id BIGINT UNSIGNED NOT NULL COMMENT 'Reference to planter',
  
  -- Farm Identification
  farm_name VARCHAR(255) NULL COMMENT 'Name of the farm',
  farm_code VARCHAR(50) NULL COMMENT 'Unique farm code',
  location_description TEXT NULL COMMENT 'Detailed location description',
  
  -- Location Information
  barangay VARCHAR(100) NOT NULL COMMENT 'Barangay where farm is located',
  municipality VARCHAR(100) NOT NULL COMMENT 'Municipality where farm is located',
  province VARCHAR(100) NOT NULL COMMENT 'Province where farm is located',
  
  -- Farm Details
  total_area DECIMAL(10,2) NOT NULL COMMENT 'Total farm area in hectares',
  sugarcane_area DECIMAL(10,2) NULL COMMENT 'Sugarcane area in hectares',
  other_crops_area DECIMAL(10,2) NULL COMMENT 'Other crops area in hectares',
  
  -- Agricultural Information
  soil_type VARCHAR(100) NULL COMMENT 'Type of soil',
  irrigation_type ENUM('rainfed', 'irrigated', 'partially_irrigated') NULL COMMENT 'Irrigation type',
  farm_status ENUM('active', 'inactive', 'fallow') NOT NULL DEFAULT 'active' COMMENT 'Current farm status',
  
  -- Ownership Information
  acquisition_date DATE NULL COMMENT 'Date when farm was acquired',
  
  -- System Fields
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  KEY idx_farms_planter (planter_id),
  KEY idx_farms_location (province, municipality),
  KEY idx_farms_status (farm_status),
  KEY idx_farms_composite_status (farm_status, province),
  
  -- Foreign Key Constraints
  CONSTRAINT fk_farms_planter FOREIGN KEY (planter_id) REFERENCES planters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Individual farm properties owned by planters';

-- ============================================================================
-- 7. UPDATE EXISTING ASSOCIATIONS WITH SUGAR MILL RELATIONSHIPS
-- ============================================================================
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO') WHERE short_name = 'NOSPA' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'SONEDCO') WHERE short_name = 'BASUCO' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'BUGAY') WHERE short_name = 'MASPU' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'TOLONG') WHERE short_name = 'TOSPA' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'CAB') WHERE short_name = 'BASUCO' AND sugar_mill_id IS NULL;

-- ============================================================================
-- 8. INSERT SAMPLE PLANTER DATA
-- ============================================================================
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

-- ============================================================================
-- 9. INSERT SAMPLE PLANTER MEMBERSHIPS
-- ============================================================================
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

-- ============================================================================
-- 10. INSERT SAMPLE FARM DATA
-- ============================================================================
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

-- ============================================================================
-- 11. CREATE ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_associations_status ON associations(status);
CREATE INDEX IF NOT EXISTS idx_associations_crop_year ON associations(crop_year);
CREATE INDEX IF NOT EXISTS idx_associations_short_name ON associations(short_name);
CREATE INDEX IF NOT EXISTS idx_associations_sugar_mill ON associations(sugar_mill_id);

-- ============================================================================
-- 12. VERIFY SYSTEM INTEGRITY
-- ============================================================================
SELECT 
  'Planters System Summary' as summary,
  (SELECT COUNT(*) FROM sugar_mills) as sugar_mills_count,
  (SELECT COUNT(*) FROM associations WHERE sugar_mill_id IS NOT NULL) as associations_with_mills,
  (SELECT COUNT(*) FROM planters) as planters_count,
  (SELECT COUNT(*) FROM planter_memberships) as memberships_count,
  (SELECT COUNT(*) FROM planter_farms) as farms_count;

-- ============================================================================
-- MIGRATION COMPLETED SUCCESSFULLY
-- ============================================================================
SELECT 'Comprehensive Planters System migration completed successfully' as status;

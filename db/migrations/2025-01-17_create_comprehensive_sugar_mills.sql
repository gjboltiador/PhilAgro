-- Migration: Create Comprehensive Sugar Mills System
-- This script creates a complete sugar mills management system with proper relationships

-- 1. Create Sugar Mills Table with all required fields
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
    DEFAULT 'operational' COMMENT 'Current operational status of the sugar mill',
  crop_year VARCHAR(20) DEFAULT '2024-2025' COMMENT 'Current crop year',
  start_date DATE NULL COMMENT 'Milling season start date',
  end_date DATE NULL COMMENT 'Milling season end date',
  
  -- Management Information
  manager_name VARCHAR(255) NULL COMMENT 'Plant manager name',
  manager_phone VARCHAR(50) NULL COMMENT 'Plant manager phone number',
  manager_email VARCHAR(255) NULL COMMENT 'Plant manager email address',
  
  -- Additional Operational Details
  daily_capacity DECIMAL(10,2) NULL COMMENT 'Daily milling capacity in tons',
  annual_capacity DECIMAL(10,2) NULL COMMENT 'Annual milling capacity in tons',
  operating_hours VARCHAR(100) NULL COMMENT 'Operating hours (e.g., 24/7, 8AM-6PM)',
  fuel_type ENUM('coal', 'biomass', 'natural_gas', 'diesel', 'electric', 'hybrid') NULL COMMENT 'Primary fuel type used',
  
  -- Financial Information
  investment_amount DECIMAL(15,2) NULL COMMENT 'Total investment amount in PHP',
  employment_count INT UNSIGNED NULL COMMENT 'Number of employees',
  
  -- Environmental & Compliance
  environmental_clearance VARCHAR(100) NULL COMMENT 'Environmental clearance certificate number',
  compliance_status ENUM('compliant', 'pending', 'non_compliant', 'under_review') DEFAULT 'compliant' COMMENT 'Environmental compliance status',
  
  -- System Fields
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_user_id BIGINT UNSIGNED NULL COMMENT 'User who created this record',
  updated_by_user_id BIGINT UNSIGNED NULL COMMENT 'User who last updated this record',
  
  PRIMARY KEY (id),
  UNIQUE KEY uk_plant_code (plant_code),
  KEY idx_sugar_mills_plant_code (plant_code),
  KEY idx_sugar_mills_status (operating_status),
  KEY idx_sugar_mills_location (city, province),
  KEY idx_sugar_mills_crop_year (crop_year),
  KEY idx_sugar_mills_capacity (capacity),
  KEY idx_sugar_mills_compliance (compliance_status),
  KEY idx_sugar_mills_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Sugar milling facilities and their operational details';

-- 2. Insert comprehensive sample sugar mills data
INSERT IGNORE INTO sugar_mills (
  plant_code, full_name, short_name, description,
  address, city, province, postal_code, latitude, longitude,
  contact_person, phone, email, website,
  registration_number, tax_id,
  capacity, capacity_unit, operating_status, crop_year,
  start_date, end_date,
  manager_name, manager_phone, manager_email,
  daily_capacity, annual_capacity, operating_hours, fuel_type,
  investment_amount, employment_count,
  environmental_clearance, compliance_status
) VALUES
-- URSUMCO - United Robina Sugar Milling Corporation
('URSUMCO', 'United Robina Sugar Milling Corporation', 'URSUMCO', 
 'One of the largest sugar milling facilities in Negros Oriental, operated by Robina Sugar Milling Corporation. Modern facility with advanced milling technology.',
 'Barangay Tabuan', 'Dumaguete City', 'Negros Oriental', '6200',
 9.3057, 123.3054,
 'Engr. Roberto Santos', '+63 35 225 1234', 'info@ursumco.com.ph', 'https://www.ursumco.com.ph',
 'SEC-123456789', 'TIN-123-456-789-000',
 8000.00, 'tons', 'operational', '2024-2025',
 '2024-11-01', '2025-05-31',
 'Mr. Juan Dela Cruz', '+63 35 225 5678', 'manager@ursumco.com.ph',
 500.00, 8000.00, '24/7 during milling season', 'biomass',
 2500000000.00, 450,
 'ECC-URSUMCO-2024-001', 'compliant'),

-- SONEDCO - Southern Negros Development Corporation
('SONEDCO', 'Southern Negros Development Corporation', 'SONEDCO',
 'Major sugar milling facility serving the southern region of Negros Oriental. Known for sustainable farming practices and community development.',
 'Barangay Villareal', 'Bayawan City', 'Negros Oriental', '6221',
 9.3647, 122.8033,
 'Ms. Maria Garcia', '+63 35 225 2345', 'info@sonedco.com.ph', 'https://www.sonedco.com.ph',
 'SEC-987654321', 'TIN-987-654-321-000',
 6000.00, 'tons', 'operational', '2024-2025',
 '2024-11-15', '2025-05-15',
 'Mr. Pedro Reyes', '+63 35 225 6789', 'manager@sonedco.com.ph',
 400.00, 6000.00, '24/7 during milling season', 'coal',
 1800000000.00, 380,
 'ECC-SONEDCO-2024-002', 'compliant'),

-- TOLONG - Tolong Sugar Milling Company
('TOLONG', 'Tolong Sugar Milling Company', 'TOLONG',
 'Established sugar mill serving the central region of Negros Oriental. Focuses on quality sugar production and farmer support.',
 'Barangay Suba', 'Tolong', 'Negros Oriental', '6215',
 9.4567, 123.1234,
 'Engr. Ana Lim', '+63 35 225 3456', 'info@tolong.com.ph', 'https://www.tolong.com.ph',
 'SEC-456789123', 'TIN-456-789-123-000',
 4500.00, 'tons', 'operational', '2024-2025',
 '2024-11-10', '2025-05-20',
 'Mr. Carlos Mendoza', '+63 35 225 7890', 'manager@tolong.com.ph',
 300.00, 4500.00, '24/7 during milling season', 'biomass',
 1200000000.00, 280,
 'ECC-TOLONG-2024-003', 'compliant'),

-- BUGAY - Bugay Sugar Milling Corporation
('BUGAY', 'Bugay Sugar Milling Corporation', 'BUGAY',
 'Modern sugar milling facility in Mabinay, Negros Oriental. Known for innovative technology and environmental sustainability.',
 'Barangay Malabugas', 'Mabinay', 'Negros Oriental', '6207',
 9.5678, 122.9876,
 'Mr. Miguel Tan', '+63 35 225 4567', 'info@bugay.com.ph', 'https://www.bugay.com.ph',
 'SEC-789123456', 'TIN-789-123-456-000',
 3500.00, 'tons', 'operational', '2024-2025',
 '2024-11-20', '2025-05-10',
 'Ms. Sofia Chen', '+63 35 225 8901', 'manager@bugay.com.ph',
 250.00, 3500.00, '24/7 during milling season', 'natural_gas',
 900000000.00, 220,
 'ECC-BUGAY-2024-004', 'compliant'),

-- CAB - Central Azucarera de Bais
('CAB', 'Central Azucarera de Bais', 'CAB',
 'Historic sugar mill in Bais City with modern upgrades. Serves the northern region of Negros Oriental with traditional and modern milling methods.',
 'Barangay Narra', 'Bais City', 'Negros Oriental', '6206',
 9.6789, 123.8765,
 'Engr. Roberto Gonzales', '+63 35 225 5678', 'info@cab.com.ph', 'https://www.cab.com.ph',
 'SEC-321654987', 'TIN-321-654-987-000',
 5000.00, 'tons', 'operational', '2024-2025',
 '2024-11-05', '2025-05-25',
 'Mr. Antonio Santos', '+63 35 225 9012', 'manager@cab.com.ph',
 350.00, 5000.00, '24/7 during milling season', 'coal',
 1500000000.00, 320,
 'ECC-CAB-2024-005', 'compliant'),

-- Additional Sugar Mills for comprehensive coverage
('HINIGARAN', 'Hinigaran Sugar Mill', 'HINIGARAN',
 'Sugar mill serving the Hinigaran area in Negros Occidental. Modern facility with sustainable practices.',
 'Barangay Proper', 'Hinigaran', 'Negros Occidental', '6106',
 10.2700, 122.8500,
 'Ms. Carmen Rodriguez', '+63 34 225 6789', 'info@hinigaran.com.ph', 'https://www.hinigaran.com.ph',
 'SEC-147258369', 'TIN-147-258-369-000',
 4000.00, 'tons', 'operational', '2024-2025',
 '2024-11-12', '2025-05-18',
 'Mr. Fernando Lopez', '+63 34 225 0123', 'manager@hinigaran.com.ph',
 280.00, 4000.00, '24/7 during milling season', 'biomass',
 1100000000.00, 260,
 'ECC-HINIGARAN-2024-006', 'compliant'),

('LA CARLOTA', 'La Carlota Sugar Mill', 'LA CARLOTA',
 'Established sugar mill in La Carlota City. Known for quality sugar production and farmer partnerships.',
 'Barangay Central', 'La Carlota City', 'Negros Occidental', '6130',
 10.4200, 122.9200,
 'Engr. Ricardo Martinez', '+63 34 225 7890', 'info@lacarlota.com.ph', 'https://www.lacarlota.com.ph',
 'SEC-258369147', 'TIN-258-369-147-000',
 5500.00, 'tons', 'operational', '2024-2025',
 '2024-11-08', '2025-05-22',
 'Mr. Eduardo Torres', '+63 34 225 1234', 'manager@lacarlota.com.ph',
 380.00, 5500.00, '24/7 during milling season', 'coal',
 1600000000.00, 340,
 'ECC-LACARLOTA-2024-007', 'compliant');

-- 3. Update associations table to include sugar_mill_id if not exists
ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS sugar_mill_id BIGINT UNSIGNED NULL AFTER id;

-- 4. Update existing associations with sugar mill relationships
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO') WHERE short_name = 'NOSPA' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'SONEDCO') WHERE short_name = 'BASUCO' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'BUGAY') WHERE short_name = 'MASPU' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'TOLONG') WHERE short_name = 'TOSPA' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'CAB') WHERE short_name = 'BASUCO' AND id != (SELECT id FROM associations WHERE short_name = 'BASUCO' AND sugar_mill_id IS NOT NULL LIMIT 1);

-- 5. Update existing planters with sugar mill relationships (if planters table exists and has sugar_mill_id column)
-- This ensures planters are properly linked to their respective sugar mills
UPDATE planters SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO') 
WHERE planter_code IN ('P-1001', 'P-1006') AND sugar_mill_id IS NULL;

UPDATE planters SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'SONEDCO') 
WHERE planter_code IN ('P-1002', 'P-1007') AND sugar_mill_id IS NULL;

UPDATE planters SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'TOLONG') 
WHERE planter_code = 'P-1003' AND sugar_mill_id IS NULL;

UPDATE planters SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'BUGAY') 
WHERE planter_code = 'P-1004' AND sugar_mill_id IS NULL;

UPDATE planters SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'CAB') 
WHERE planter_code = 'P-1005' AND sugar_mill_id IS NULL;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sugar_mills_composite_status ON sugar_mills(operating_status, compliance_status);
CREATE INDEX IF NOT EXISTS idx_sugar_mills_capacity_range ON sugar_mills(capacity, annual_capacity);
CREATE INDEX IF NOT EXISTS idx_sugar_mills_location_coords ON sugar_mills(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_associations_sugar_mill ON associations(sugar_mill_id);

-- 7. Create a view for sugar mill summary statistics
CREATE OR REPLACE VIEW sugar_mill_summary AS
SELECT 
  sm.id,
  sm.plant_code,
  sm.short_name,
  sm.city,
  sm.province,
  sm.operating_status,
  sm.crop_year,
  sm.capacity,
  sm.capacity_unit,
  sm.annual_capacity,
  sm.employment_count,
  sm.compliance_status,
  COUNT(DISTINCT p.id) as total_planters,
  COUNT(DISTINCT a.id) as total_associations,
  COUNT(DISTINCT pm.id) as total_memberships,
  SUM(pm.total_delivered) as total_sugar_delivered
FROM sugar_mills sm
LEFT JOIN planters p ON sm.id = p.sugar_mill_id
LEFT JOIN associations a ON sm.id = a.sugar_mill_id
LEFT JOIN planter_memberships pm ON sm.id = pm.sugar_mill_id
GROUP BY sm.id, sm.plant_code, sm.short_name, sm.city, sm.province, 
         sm.operating_status, sm.crop_year, sm.capacity, sm.capacity_unit, 
         sm.annual_capacity, sm.employment_count, sm.compliance_status;

-- 8. Verify the system is working
SELECT 
  'Sugar Mills System Summary' as summary,
  (SELECT COUNT(*) FROM sugar_mills) as sugar_mills_count,
  (SELECT COUNT(*) FROM sugar_mills WHERE operating_status = 'operational') as operational_mills,
  (SELECT COUNT(*) FROM sugar_mills WHERE compliance_status = 'compliant') as compliant_mills,
  (SELECT COUNT(*) FROM associations WHERE sugar_mill_id IS NOT NULL) as associations_with_mills,
  (SELECT COUNT(*) FROM planters WHERE sugar_mill_id IS NOT NULL) as planters_with_mills,
  (SELECT SUM(capacity) FROM sugar_mills WHERE operating_status = 'operational') as total_capacity_tons;

-- 9. Display sample sugar mill data for verification
SELECT 
  plant_code,
  short_name,
  city,
  province,
  operating_status,
  capacity,
  capacity_unit,
  annual_capacity,
  employment_count,
  compliance_status
FROM sugar_mills 
ORDER BY capacity DESC;

SELECT 'Comprehensive Sugar Mills system created successfully' as status;

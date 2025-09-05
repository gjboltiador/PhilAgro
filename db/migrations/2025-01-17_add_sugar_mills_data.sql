-- Migration: Add Sugar Mills Sample Data
-- This script adds missing columns and inserts sample data for sugar mills

-- 1. Add missing columns to the existing sugar_mills table
ALTER TABLE sugar_mills 
ADD COLUMN IF NOT EXISTS daily_capacity DECIMAL(10,2) NULL COMMENT 'Daily milling capacity in tons' AFTER manager_email,
ADD COLUMN IF NOT EXISTS annual_capacity DECIMAL(10,2) NULL COMMENT 'Annual milling capacity in tons' AFTER daily_capacity,
ADD COLUMN IF NOT EXISTS operating_hours VARCHAR(100) NULL COMMENT 'Operating hours (e.g., 24/7, 8AM-6PM)' AFTER annual_capacity,
ADD COLUMN IF NOT EXISTS fuel_type ENUM('coal', 'biomass', 'natural_gas', 'diesel', 'electric', 'hybrid') NULL COMMENT 'Primary fuel type used' AFTER operating_hours,
ADD COLUMN IF NOT EXISTS investment_amount DECIMAL(15,2) NULL COMMENT 'Total investment amount in PHP' AFTER fuel_type,
ADD COLUMN IF NOT EXISTS employment_count INT UNSIGNED NULL COMMENT 'Number of employees' AFTER investment_amount,
ADD COLUMN IF NOT EXISTS environmental_clearance VARCHAR(100) NULL COMMENT 'Environmental clearance certificate number' AFTER employment_count,
ADD COLUMN IF NOT EXISTS compliance_status ENUM('compliant', 'pending', 'non_compliant', 'under_review') DEFAULT 'compliant' COMMENT 'Environmental compliance status' AFTER environmental_clearance;

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
 'A leading sugar milling company in Negros Oriental, specializing in high-quality sugar production with state-of-the-art processing facilities.',
 'Barangay Tabuan', 'Dumaguete City', 'Negros Oriental', '6200',
 9.3057, 123.3054,
 'Engr. Roberto Santos', '+63 35 123 4567', 'info@ursumco.com.ph', 'https://www.ursumco.com.ph',
 'SEC-123456789', 'TIN-123-456-789-000',
 8000.00, 'tons', 'operational', '2024-2025',
 '2024-11-01', '2025-05-31',
 'Mr. Juan Dela Cruz', '+63 35 225 5678', 'manager@ursumco.com.ph',
 500.00, 8000.00, '24/7 during milling season', 'biomass',
 2500000000.00, 450,
 'ECC-URSUMCO-2024-001', 'compliant'),

-- SONEDCO - Southern Negros Development Corporation
('SONEDCO', 'Southern Negros Development Corporation', 'SONEDCO',
 'Premier sugar milling facility serving the southern region of Negros Oriental with advanced processing technology.',
 'Barangay Villareal', 'Bayawan City', 'Negros Oriental', '6221',
 9.3647, 122.8033,
 'Ms. Maria Garcia', '+63 35 234 5678', 'contact@sonedco.com.ph', 'https://www.sonedco.com.ph',
 'SEC-987654321', 'TIN-987-654-321-000',
 6500.00, 'tons', 'operational', '2024-2025',
 '2024-11-15', '2025-05-15',
 'Mr. Pedro Reyes', '+63 35 225 6789', 'manager@sonedco.com.ph',
 400.00, 6500.00, '24/7 during milling season', 'coal',
 1800000000.00, 380,
 'ECC-SONEDCO-2024-002', 'compliant'),

-- TOLONG - Tolong Sugar Milling Company
('TOLONG', 'Tolong Sugar Milling Company', 'TOLONG',
 'Established sugar mill serving the central region with reliable processing and quality assurance.',
 'Barangay Suba', 'Tolong', 'Negros Oriental', '6215',
 9.4567, 123.1234,
 'Engr. Ana Lim', '+63 35 345 6789', 'info@tolong.com.ph', 'https://www.tolong.com.ph',
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

-- 3. Verify the system is working
SELECT 
  'Sugar Mills System Summary' as summary,
  (SELECT COUNT(*) FROM sugar_mills) as sugar_mills_count,
  (SELECT COUNT(*) FROM sugar_mills WHERE operating_status = 'operational') as operational_mills,
  (SELECT SUM(capacity) FROM sugar_mills WHERE operating_status = 'operational') as total_capacity_tons;

-- 4. Display sample sugar mill data for verification
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

SELECT 'Sugar Mills sample data added successfully' as status;

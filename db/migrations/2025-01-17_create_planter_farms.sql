-- Migration: Create Planter Farms Table
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

-- Create sample farm data
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

SELECT 'Planter farms table created successfully' as status;

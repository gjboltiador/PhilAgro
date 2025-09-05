-- Migration: Create Sugar Mills Table
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

-- Insert sample sugar mills data
INSERT IGNORE INTO sugar_mills (plant_code, full_name, short_name, city, province, operating_status) VALUES
('URSUMCO', 'United Robina Sugar Milling Corporation', 'URSUMCO', 'Dumaguete City', 'Negros Oriental', 'operational'),
('SONEDCO', 'Southern Negros Development Corporation', 'SONEDCO', 'Bayawan City', 'Negros Oriental', 'operational'),
('TOLONG', 'Tolong Sugar Milling Company', 'TOLONG', 'Tolong', 'Negros Oriental', 'operational'),
('BUGAY', 'Bugay Sugar Milling Corporation', 'BUGAY', 'Mabinay', 'Negros Oriental', 'operational'),
('CAB', 'Central Azucarera de Bais', 'CAB', 'Bais City', 'Negros Oriental', 'operational');

SELECT 'Sugar mills table created successfully' as status;

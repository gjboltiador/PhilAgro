-- Migration: Create Planter Memberships Table
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

-- Create sample planter memberships
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

SELECT 'Planter memberships table created successfully' as status;

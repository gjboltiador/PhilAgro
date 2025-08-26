-- PhilAgro Tech - Core Database Schema (MariaDB/MySQL)
-- Safe to run multiple times (uses IF NOT EXISTS)
-- Ensure your connection default database is philagrotech

-- Recommended defaults
SET NAMES utf8mb4;
-- Note: SET CHARACTER SET can be restricted in some environments
-- We'll rely on connection/session defaults and only set names.

-- Users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- RBAC
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  perm_key VARCHAR(150) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  KEY idx_rp_role (role_id),
  KEY idx_rp_permission (permission_id)
  -- Foreign keys disabled for compatibility; enforce in app or add later via ALTER TABLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  KEY idx_ur_role (role_id)
  -- Foreign keys disabled for compatibility; enforce in app or add later via ALTER TABLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Associations and Planters
CREATE TABLE IF NOT EXISTS associations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  contact_email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  address VARCHAR(255) NULL,
  assoc_type ENUM('coop','association','company','other') NOT NULL DEFAULT 'association',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS planters (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) NULL,
  last_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(50) NOT NULL,
  email_address VARCHAR(255) NULL,
  profile_picture_url VARCHAR(500) NULL,
  valid_id_type VARCHAR(100) NULL,
  valid_id_number VARCHAR(100) NULL,
  valid_id_image_url VARCHAR(500) NULL,
  address_line VARCHAR(255) NOT NULL,
  barangay VARCHAR(100) NOT NULL,
  municipality VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active','pending','inactive') NOT NULL DEFAULT 'pending',
  membership_status ENUM('member','unaffiliated') NOT NULL DEFAULT 'unaffiliated',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_planters_user (user_id),
  CONSTRAINT fk_planters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Planter membership per crop year (enforces exclusivity)
CREATE TABLE IF NOT EXISTS planter_memberships (
  planter_id BIGINT UNSIGNED NOT NULL,
  crop_year INT NOT NULL,
  association_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (planter_id, crop_year),
  UNIQUE KEY uq_pm_triplet (planter_id, crop_year, association_id),
  KEY idx_pm_association (association_id),
  CONSTRAINT fk_pm_planter FOREIGN KEY (planter_id) REFERENCES planters(id) ON DELETE CASCADE,
  CONSTRAINT fk_pm_association FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Farms
CREATE TABLE IF NOT EXISTS farms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  planter_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NULL,
  location VARCHAR(255) NULL,
  area_hectares DECIMAL(10,2) NULL,
  crop_details VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_farms_planter (planter_id),
  CONSTRAINT fk_farms_planter FOREIGN KEY (planter_id) REFERENCES planters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Assets (trucks, tractors, equipment)
CREATE TABLE IF NOT EXISTS trucks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  association_id BIGINT UNSIGNED NULL,
  owner_user_id BIGINT UNSIGNED NULL,
  plate_no VARCHAR(50) NOT NULL UNIQUE,
  capacity_tons DECIMAL(10,2) NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_trucks_assoc (association_id),
  KEY idx_trucks_owner_user (owner_user_id),
  CONSTRAINT fk_trucks_association FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE SET NULL,
  CONSTRAINT fk_trucks_owner_user FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tractors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  association_id BIGINT UNSIGNED NULL,
  owner_user_id BIGINT UNSIGNED NULL,
  model VARCHAR(100) NULL,
  power_hp INT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tractors_assoc (association_id),
  KEY idx_tractors_owner_user (owner_user_id),
  CONSTRAINT fk_tractors_association FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE SET NULL,
  CONSTRAINT fk_tractors_owner_user FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS equipment (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  association_id BIGINT UNSIGNED NULL,
  owner_user_id BIGINT UNSIGNED NULL,
  equip_type ENUM('plow','harrow','sprayer','other') NOT NULL DEFAULT 'other',
  details VARCHAR(255) NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_equipment_assoc (association_id),
  KEY idx_equipment_owner_user (owner_user_id),
  CONSTRAINT fk_equipment_association FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipment_owner_user FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  requester_type ENUM('planter','association') NOT NULL,
  requester_id BIGINT UNSIGNED NOT NULL,
  asset_type ENUM('truck','tractor','equipment') NOT NULL,
  asset_id BIGINT UNSIGNED NULL,
  schedule_start DATETIME NOT NULL,
  schedule_end DATETIME NOT NULL,
  status ENUM('requested','approved','rejected','scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'requested',
  approver_user_id BIGINT UNSIGNED NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bookings_requester (requester_type, requester_id),
  KEY idx_bookings_asset (asset_type, asset_id),
  KEY idx_bookings_status (status),
  KEY idx_bookings_approver (approver_user_id),
  CONSTRAINT fk_bookings_approver FOREIGN KEY (approver_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Deliveries (enforces membership via composite FK)
CREATE TABLE IF NOT EXISTS deliveries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  planter_id BIGINT UNSIGNED NOT NULL,
  association_id BIGINT UNSIGNED NOT NULL,
  crop_year INT NOT NULL,
  delivery_date DATE NOT NULL,
  quantity_tons DECIMAL(12,3) NOT NULL,
  destination VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_deliveries_planter (planter_id),
  KEY idx_deliveries_assoc (association_id),
  KEY idx_deliveries_year (crop_year),
  CONSTRAINT fk_deliveries_membership FOREIGN KEY (planter_id, crop_year, association_id)
    REFERENCES planter_memberships (planter_id, crop_year, association_id)
    ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Assistance (Catalog and Orders)
CREATE TABLE IF NOT EXISTS catalog_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  supplier_type ENUM('association','user') NOT NULL,
  supplier_id BIGINT UNSIGNED NOT NULL,
  category ENUM('fertilizer','herbicide','chemical','other') NOT NULL DEFAULT 'fertilizer',
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  price DECIMAL(12,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_catalog_supplier (supplier_type, supplier_id),
  KEY idx_catalog_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  requester_type ENUM('planter','association') NOT NULL,
  requester_id BIGINT UNSIGNED NOT NULL,
  supplier_type ENUM('association','user') NOT NULL,
  supplier_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending','approved','rejected','fulfilled','cancelled') NOT NULL DEFAULT 'pending',
  approver_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_requester (requester_type, requester_id),
  KEY idx_orders_supplier (supplier_type, supplier_id),
  KEY idx_orders_status (status),
  CONSTRAINT fk_orders_approver FOREIGN KEY (approver_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  catalog_item_id BIGINT UNSIGNED NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  KEY idx_order_items_item (catalog_item_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_item FOREIGN KEY (catalog_item_id) REFERENCES catalog_items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_actor (actor_user_id),
  KEY idx_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Workforce: Drivers and Operators
CREATE TABLE IF NOT EXISTS drivers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  license_no VARCHAR(100) NULL,
  license_expiry DATE NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_drivers_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS operators (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  operator_type ENUM('tractor','equipment','other') NOT NULL DEFAULT 'other',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_operators_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Asset assignments (driver/operator to asset)
CREATE TABLE IF NOT EXISTS asset_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  asset_type ENUM('truck','tractor','equipment') NOT NULL,
  asset_id BIGINT UNSIGNED NOT NULL,
  assignee_user_id BIGINT UNSIGNED NOT NULL,
  assignee_role ENUM('driver','operator') NOT NULL,
  assigned_from DATETIME NOT NULL,
  assigned_to DATETIME NULL,
  assigned_by_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_assign_asset (asset_type, asset_id),
  KEY idx_assign_user (assignee_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Booking assignments (who/what was assigned to fulfill a booking)
CREATE TABLE IF NOT EXISTS booking_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  booking_id BIGINT UNSIGNED NOT NULL,
  asset_type ENUM('truck','tractor','equipment') NOT NULL,
  asset_id BIGINT UNSIGNED NULL,
  driver_user_id BIGINT UNSIGNED NULL,
  operator_user_id BIGINT UNSIGNED NULL,
  assigned_by_user_id BIGINT UNSIGNED NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ba_booking (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Maintenance logs for assets
CREATE TABLE IF NOT EXISTS maintenance_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  asset_type ENUM('truck','tractor','equipment') NOT NULL,
  asset_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  event_date DATE NOT NULL,
  cost DECIMAL(12,2) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_me_asset (asset_type, asset_id),
  KEY idx_me_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Messaging system
CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  subject VARCHAR(255) NULL,
  created_by_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  role ENUM('owner','member') NOT NULL DEFAULT 'member',
  PRIMARY KEY (conversation_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  sender_user_id BIGINT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_msg_convo (conversation_id),
  KEY idx_msg_sender (sender_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_user (user_id),
  KEY idx_notif_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Prices and alerts
CREATE TABLE IF NOT EXISTS sugar_markets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  region VARCHAR(100) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sugar_price_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  market_id BIGINT UNSIGNED NOT NULL,
  price_type ENUM('raw_sugar','molasses') NOT NULL DEFAULT 'raw_sugar',
  price DECIMAL(12,2) NOT NULL,
  price_date DATE NOT NULL,
  PRIMARY KEY (id),
  KEY idx_sph_market_date (market_id, price_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS price_alerts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  market_id BIGINT UNSIGNED NULL,
  price_type ENUM('raw_sugar','molasses') NOT NULL DEFAULT 'raw_sugar',
  direction ENUM('above','below') NOT NULL,
  threshold DECIMAL(12,2) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pa_user (user_id),
  KEY idx_pa_market (market_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inspections
CREATE TABLE IF NOT EXISTS crop_inspections (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  farm_id BIGINT UNSIGNED NOT NULL,
  inspector_user_id BIGINT UNSIGNED NOT NULL,
  inspection_date DATE NOT NULL,
  status ENUM('scheduled','completed','follow_up_required') NOT NULL DEFAULT 'scheduled',
  findings TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ci_farm (farm_id),
  KEY idx_ci_inspector (inspector_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Finance (minimal core)
CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_type ENUM('planter','association','user') NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  total_amount DECIMAL(14,2) NOT NULL,
  status ENUM('draft','issued','paid','void') NOT NULL DEFAULT 'issued',
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inv_customer (customer_type, customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invoice_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  invoice_id BIGINT UNSIGNED NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(12,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_inv_items_invoice (invoice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  invoice_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  method ENUM('cash','bank_transfer','check','other') NOT NULL DEFAULT 'cash',
  paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reference VARCHAR(100) NULL,
  PRIMARY KEY (id),
  KEY idx_payments_invoice (invoice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS disbursements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payee_type ENUM('planter','association','user','supplier') NOT NULL,
  payee_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  purpose VARCHAR(255) NULL,
  status ENUM('pending','approved','released','cancelled') NOT NULL DEFAULT 'pending',
  requested_by_user_id BIGINT UNSIGNED NULL,
  approved_by_user_id BIGINT UNSIGNED NULL,
  released_by_user_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_disb_payee (payee_type, payee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id BIGINT UNSIGNED NOT NULL,
  pref_key VARCHAR(100) NOT NULL,
  pref_value VARCHAR(500) NULL,
  PRIMARY KEY (user_id, pref_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS system_settings (
  setting_key VARCHAR(100) NOT NULL,
  setting_value VARCHAR(1000) NULL,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inventory movements for catalog items
CREATE TABLE IF NOT EXISTS inventory_movements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  catalog_item_id BIGINT UNSIGNED NOT NULL,
  movement_type ENUM('in','out') NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  reference VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inv_mov_item (catalog_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- News posts
CREATE TABLE IF NOT EXISTS news_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  author_user_id BIGINT UNSIGNED NULL,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_news_author (author_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


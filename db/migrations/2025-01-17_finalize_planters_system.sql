-- Migration: Finalize Planters System
-- This script adds final indexes and updates associations table

-- 1. Update associations table to include sugar_mill_id if not exists
ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS sugar_mill_id BIGINT UNSIGNED NULL AFTER id;

-- 2. Update existing associations with sugar mill relationships
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'URSUMCO') WHERE short_name = 'NOSPA' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'SONEDCO') WHERE short_name = 'BASUCO' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'BUGAY') WHERE short_name = 'MASPU' AND sugar_mill_id IS NULL;
UPDATE associations SET sugar_mill_id = (SELECT id FROM sugar_mills WHERE plant_code = 'TOLONG') WHERE short_name = 'TOSPA' AND sugar_mill_id IS NULL;

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_planters_composite_status ON planters(status, membership_status);
CREATE INDEX IF NOT EXISTS idx_memberships_composite_status ON planter_memberships(membership_status, dues_status);
CREATE INDEX IF NOT EXISTS idx_farms_composite_status ON planter_farms(farm_status, province);
CREATE INDEX IF NOT EXISTS idx_associations_sugar_mill ON associations(sugar_mill_id);

-- 4. Verify the system is working
SELECT 
  'Planters System Summary' as summary,
  (SELECT COUNT(*) FROM sugar_mills) as sugar_mills_count,
  (SELECT COUNT(*) FROM planters) as planters_count,
  (SELECT COUNT(*) FROM planter_memberships) as memberships_count,
  (SELECT COUNT(*) FROM planter_farms) as farms_count,
  (SELECT COUNT(*) FROM associations WHERE sugar_mill_id IS NOT NULL) as associations_with_mills;

SELECT 'Planters system finalized successfully' as status;

ALTER TABLE intersect_projects
  DROP COLUMN IF EXISTS owner_id;

DROP TABLE IF EXISTS intersect_users CASCADE;
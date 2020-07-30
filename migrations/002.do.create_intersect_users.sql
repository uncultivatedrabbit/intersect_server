CREATE TABLE intersect_users(
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  university_affiliation TEXT, 
  biography TEXT, 
  academic_level TEXT, 
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified TIMESTAMPTZ
);

ALTER TABLE intersect_projects
  ADD COLUMN
    owner_id INTEGER REFERENCES intersect_users(id)
    ON DELETE SET NULL;
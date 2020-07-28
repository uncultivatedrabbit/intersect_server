CREATE TABLE intersect_project_comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    project_id INTEGER
        REFERENCES intersect_projects(id) ON DELETE CASCADE NOT NULL,
    owner_id INTEGER
        REFERENCES intersect_users(id) ON DELETE CASCADE NOT NULL
);
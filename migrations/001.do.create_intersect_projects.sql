CREATE TYPE medical_specialty AS ENUM ('Allergy and Immunology', 'Anesthesiology', 'Dermatology', 'Diagnostic Radiology', 'Emergency Medicine', 'Family Medicine', 'Internal Medicine', 'Medical Genetics', 'Neurology', 'Nuclear Medicine', 'Obstetrics and Gynecology', 'Pathology', 'Pediatrics', 'Physical Medicine and Rehabilitation', 'Preventive Medicine', 'Psychiatry', 'Radiation Oncology', 'Surgery', 'Urology');

CREATE TABLE intersect_projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  medical_specialty medical_specialty NOT NULL,
  medical_subspecialty VARCHAR(40),
  pdf_file TEXT,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
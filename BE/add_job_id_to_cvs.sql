-- Add JobID column to CVs table to track which job the CV was submitted for
ALTER TABLE CVs 
ADD COLUMN JobID INT NULL,
ADD FOREIGN KEY (JobID) REFERENCES job_postings(id);

-- Create index for better performance on job-based queries
CREATE INDEX idx_cvs_job_id ON CVs(JobID);
CREATE INDEX idx_cvs_user_job ON CVs(UserID, JobID);

-- Update existing CVs to link with jobs (if any existing data needs migration)
-- This query can be customized based on existing Applications data
-- UPDATE CVs c 
-- JOIN applications a ON a.cv_id = c.CVID 
-- SET c.JobID = a.job_id 
-- WHERE c.JobID IS NULL;

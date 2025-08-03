-- Fix JobID foreign key constraint with correct column name
-- Based on JobPosting entity, the primary key column is named 'JobID' not 'id'

-- 1. First check the actual table structure
DESCRIBE job_postings;

-- 2. Add foreign key constraint with correct column name
ALTER TABLE CVs 
ADD CONSTRAINT fk_cvs_job_posting
FOREIGN KEY (JobID) REFERENCES job_postings(JobID)
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- 3. Add indexes for performance
CREATE INDEX idx_cvs_job_id ON CVs(JobID);
CREATE INDEX idx_cvs_user_job ON CVs(UserID, JobID);

-- 4. Verify the constraint was created successfully
SHOW CREATE TABLE CVs;

-- 5. Test data integrity
SELECT COUNT(*) as total_cvs FROM CVs;
SELECT COUNT(*) as total_jobs FROM job_postings;

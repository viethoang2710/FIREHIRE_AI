-- Fix JobID foreign key constraint for CVs table
-- Run these commands one by one

-- 1. First check current constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'CVs'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 2. If there are any existing constraints on JobID, drop them first
-- (Replace 'constraint_name' with actual constraint name from step 1)
-- ALTER TABLE CVs DROP FOREIGN KEY constraint_name;

-- 3. Add the foreign key constraint properly
ALTER TABLE CVs 
ADD CONSTRAINT fk_cvs_job_posting
FOREIGN KEY (JobID) REFERENCES job_postings(id)
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- 4. Add indexes for performance
CREATE INDEX idx_cvs_job_id ON CVs(JobID);
CREATE INDEX idx_cvs_user_job ON CVs(UserID, JobID);

-- 5. Verify the table structure
DESCRIBE CVs;

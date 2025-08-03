-- Fix CV table JobID foreign key issues
-- Step 1: Check current table structure
DESCRIBE CVs;

-- Step 2: Check if foreign key constraint already exists
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

-- Step 3: Drop existing foreign key constraint if it exists (replace CONSTRAINT_NAME with actual name from step 2)
-- ALTER TABLE CVs DROP FOREIGN KEY constraint_name_here;

-- Step 4: Add foreign key constraint with proper syntax
ALTER TABLE CVs 
ADD CONSTRAINT fk_cvs_job_id 
FOREIGN KEY (JobID) REFERENCES job_postings(id)
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Step 5: Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_cvs_job_id ON CVs(JobID);
CREATE INDEX IF NOT EXISTS idx_cvs_user_job ON CVs(UserID, JobID);

-- Step 6: Verify the changes
DESCRIBE CVs;

-- Step 7: Check constraint was created successfully
SHOW CREATE TABLE CVs;

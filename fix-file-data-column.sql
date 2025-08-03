-- Fix file_data column size to handle larger CV files
-- Change from TEXT to LONGBLOB to support files up to 4GB

USE firehire_ai;

-- Check current column type
DESCRIBE cvs;

-- Update file_data column to LONGBLOB
ALTER TABLE cvs MODIFY COLUMN file_data LONGBLOB;

-- Verify the change
DESCRIBE cvs;

-- Check if there are any existing records
SELECT COUNT(*) as total_cvs FROM cvs;

-- Show sample of existing data (without file content)
SELECT CVId, JobID, CandidateId, file_name, file_size, file_type, cover_letter, created_at 
FROM cvs 
ORDER BY created_at DESC 
LIMIT 5;

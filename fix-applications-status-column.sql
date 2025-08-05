-- Fix Applications table status column length
USE firehire_ai;

-- Check current column definition
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_KEY,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'Applications'
AND COLUMN_NAME = 'Status';

-- Alter the status column to accommodate all enum values
-- interview is the longest with 9 characters, so we'll use VARCHAR(20) to be safe
ALTER TABLE Applications 
MODIFY COLUMN Status VARCHAR(20) NOT NULL DEFAULT 'pending';

-- Verify the change
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_KEY,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'Applications'
AND COLUMN_NAME = 'Status';

-- Show current data to verify it's working
SELECT ApplicationID, CVID, JobID, Status, AppliedAt 
FROM Applications 
LIMIT 10;

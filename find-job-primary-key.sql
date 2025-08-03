-- Find correct primary key for job_postings table
DESCRIBE job_postings;

-- Check primary key column
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'job_postings'
AND COLUMN_KEY = 'PRI';

-- List all columns 
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'job_postings';

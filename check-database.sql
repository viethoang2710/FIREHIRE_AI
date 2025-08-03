-- Check current CVs table structure
DESCRIBE CVs;

-- Check job_postings table structure to find correct primary key column name
DESCRIBE job_postings;

-- Check if JobID column exists and its properties
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'CVs';

-- Check job_postings columns to find primary key
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'job_postings'
AND COLUMN_KEY = 'PRI';

-- Check existing foreign key constraints
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

-- Check existing CVs data
SELECT 
    CVID,
    UserID,
    JobID,
    Title,
    FileName,
    FileSize,
    CreatedAt
FROM CVs 
ORDER BY CreatedAt DESC 
LIMIT 10;

-- Check Users (candidates)
SELECT UserID, FullName, Email, Role 
FROM Users 
WHERE Role = 'CANDIDATE' 
LIMIT 5;

-- Check available jobs
SELECT id, title, location, salary, status 
FROM job_postings 
WHERE status = 'ACTIVE' 
LIMIT 5;

-- Debug script to check database data for CV upload
-- This will help us find valid UserID and JobID values for testing

-- 1. Check Users table structure and data
SELECT 'USERS TABLE:' as info;
DESCRIBE Users;

SELECT 'CANDIDATE USERS:' as info;
SELECT UserID, FullName, Email, Role 
FROM Users 
WHERE Role = 'CANDIDATE' 
LIMIT 5;

-- 2. Check job_postings table structure and data  
SELECT 'JOB_POSTINGS TABLE:' as info;
DESCRIBE job_postings;

SELECT 'ACTIVE JOBS:' as info;
SELECT JobID, Title, Location, Status
FROM job_postings 
WHERE Status = 'ACTIVE' 
LIMIT 5;

-- 3. Check CVs table structure
SELECT 'CVS TABLE:' as info;
DESCRIBE CVs;

-- 4. Check existing CV data
SELECT 'EXISTING CVS:' as info;
SELECT CVID, UserID, JobID, Title, FileName, CreatedAt
FROM CVs 
ORDER BY CreatedAt DESC 
LIMIT 5;

-- 5. Check Applications table
SELECT 'APPLICATIONS TABLE:' as info;
DESCRIBE Applications;

SELECT 'EXISTING APPLICATIONS:' as info;
SELECT ApplicationID, CVID, JobID, Status, AppliedAt
FROM Applications 
ORDER BY AppliedAt DESC 
LIMIT 5;

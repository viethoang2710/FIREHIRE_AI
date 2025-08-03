-- Check real users and jobs in database for CV upload
SELECT 'USERS IN DATABASE:' as info;
SELECT UserID, FullName, Email, Role, CreatedAt 
FROM Users 
ORDER BY UserID 
LIMIT 10;

SELECT 'CANDIDATES ONLY:' as info;
SELECT UserID, FullName, Email, Role 
FROM Users 
WHERE Role = 'CANDIDATE'
ORDER BY UserID 
LIMIT 5;

SELECT 'JOBS IN DATABASE:' as info;
SELECT JobID, Title, Status, EmployerID
FROM job_postings 
WHERE Status = 'ACTIVE'
ORDER BY JobID 
LIMIT 5;

-- Check if UserID 1002 exists
SELECT 'CHECK USER 1002:' as info;
SELECT * FROM Users WHERE UserID = 1002;

-- Check if JobID 4001 exists  
SELECT 'CHECK JOB 4001:' as info;
SELECT * FROM job_postings WHERE JobID = 4001;

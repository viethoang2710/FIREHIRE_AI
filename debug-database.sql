-- Check database for CV upload debugging
USE firehire_ai;

-- Check Users table
SELECT 'USERS TABLE:' as info;
SELECT UserID, FullName, Email, Role, CreatedAt 
FROM Users 
ORDER BY UserID 
LIMIT 10;

-- Check Jobs table  
SELECT 'JOBS TABLE:' as info;
SELECT ID as JobID, Title, CompanyName, Location, Status
FROM job_postings 
WHERE Status = 'ACTIVE'
ORDER BY ID 
LIMIT 10;

-- Check CVs table
SELECT 'CVS TABLE:' as info;
SELECT CVID, UserID, Title, FileName, 
       CASE WHEN FileData IS NOT NULL THEN 'Has File' ELSE 'No File' END as FileStatus,
       CreatedAt 
FROM CVs 
ORDER BY CVID 
LIMIT 10;

-- Check Applications table
SELECT 'APPLICATIONS TABLE:' as info;
SELECT a.ApplicationID, a.CVID, a.JobID, a.Status, a.AppliedAt,
       u.FullName as CandidateName, j.Title as JobTitle
FROM applications a
LEFT JOIN CVs c ON a.CVID = c.CVID  
LEFT JOIN Users u ON c.UserID = u.UserID
LEFT JOIN job_postings j ON a.JobID = j.ID
ORDER BY a.ApplicationID DESC
LIMIT 10;

-- Find available test data
SELECT 'SUGGESTED TEST DATA:' as info;
SELECT CONCAT('Use UserID: ', u.UserID, ' (', u.FullName, ') with JobID: ', j.ID, ' (', j.Title, ')') as suggestion
FROM Users u
CROSS JOIN job_postings j
WHERE u.Role = 'CANDIDATE' 
  AND j.Status = 'ACTIVE'
  AND NOT EXISTS (
    SELECT 1 FROM applications app
    JOIN CVs cv ON app.CVID = cv.CVID
    WHERE cv.UserID = u.UserID AND app.JobID = j.ID
  )
LIMIT 5;

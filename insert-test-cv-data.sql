-- Insert test CV data for FIREHIRE_AI database
USE firehire_ai;

-- First check current data
SELECT 'Current CV count:' as info, COUNT(*) as count FROM CVs;
SELECT 'Current User count:' as info, COUNT(*) as count FROM Users;

-- Insert test CVs (assuming we have some users and templates)
-- Let's create a simple CV template first if not exists
INSERT IGNORE INTO cv_templates (TemplateID, Name, Description, CreatedAt) 
VALUES (1, 'Basic Template', 'A simple CV template', NOW());

-- Insert test CVs (assuming UserID 1, 2, 3 exist, if not we'll create them)
INSERT IGNORE INTO Users (UserID, Username, FullName, Email, PhoneNumber, Role, CreatedAt) 
VALUES 
    (1, 'testuser1', 'Nguyen Van A', 'nguyenvana@email.com', '0123456789', 'CANDIDATE', NOW()),
    (2, 'testuser2', 'Tran Thi B', 'tranthib@email.com', '0987654321', 'CANDIDATE', NOW()),
    (3, 'testuser3', 'Le Van C', 'levanc@email.com', '0369852147', 'CANDIDATE', NOW());

-- Insert test CVs
INSERT IGNORE INTO CVs (CVID, UserID, TemplateID, Title, CreatedAt, UpdatedAt) 
VALUES 
    (1, 1, 1, 'CV Nguyen Van A - Software Engineer', NOW(), NOW()),
    (2, 2, 1, 'CV Tran Thi B - Marketing Specialist', NOW(), NOW()),
    (3, 3, 1, 'CV Le Van C - Data Analyst', NOW(), NOW()),
    (4, 1, 1, 'CV Nguyen Van A - Full Stack Developer', NOW(), NOW()),
    (5, 2, 1, 'CV Tran Thi B - UI/UX Designer', NOW(), NOW());

-- Check results
SELECT 'New CV count:' as info, COUNT(*) as count FROM CVs;
SELECT 'CV Details:' as info;
SELECT 
    c.CVID,
    c.Title,
    u.FullName as CandidateName,
    u.Email as CandidateEmail,
    u.PhoneNumber as CandidatePhone,
    c.CreatedAt
FROM CVs c 
LEFT JOIN Users u ON c.UserID = u.UserID
ORDER BY c.CVID;

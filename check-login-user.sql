-- Check user phucnn1@gmail.com for login testing
SELECT 
    id,
    fullName,
    email,
    password,
    role,
    createdAt
FROM Users 
WHERE email = 'phucnn1@gmail.com';

-- Check all users to see available test accounts
SELECT 
    id,
    fullName,
    email,
    role,
    createdAt
FROM Users 
ORDER BY id DESC
LIMIT 10;

-- Check for any candidate users
SELECT 
    id,
    fullName,
    email,
    role
FROM Users 
WHERE role = 'candidate'
ORDER BY id DESC
LIMIT 5;

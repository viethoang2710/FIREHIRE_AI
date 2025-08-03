-- Verification script for user_profiles table
-- Check if everything was created successfully

USE firehire_ai;

-- 1. Show table structure
DESCRIBE user_profiles;

-- 2. Show all data in user_profiles
SELECT * FROM user_profiles;

-- 3. Show user profiles with user information
SELECT 
    up.ProfileID,
    u.FullName,
    u.Email,
    up.Title,
    up.Bio,
    up.Skills,
    up.Experience,
    up.Phone,
    up.Address,
    up.WorkPreference,
    up.SalaryExpectation,
    up.CreatedAt,
    up.UpdatedAt
FROM user_profiles up
JOIN users u ON up.UserID = u.UserID
ORDER BY up.CreatedAt DESC;

-- 4. Count total profiles
SELECT COUNT(*) as 'Total Profiles' FROM user_profiles;

-- 5. Show indexes on the table
SHOW INDEX FROM user_profiles;

-- 6. Check foreign key constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'firehire_ai' 
    AND TABLE_NAME = 'user_profiles'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

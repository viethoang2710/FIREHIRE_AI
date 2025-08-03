-- Debug script to check Users table structure and fix user_profiles foreign key

-- Check if Users table exists (case variations)
SHOW TABLES LIKE '%user%';

-- Check Users table structure (try different cases)
DESCRIBE Users;
DESCRIBE users;

-- Check the specific UserID column type
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_KEY, 
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
    AND TABLE_NAME IN ('Users', 'users') 
    AND COLUMN_NAME = 'UserID';

-- Show foreign key constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'firehire_ai' 
    AND REFERENCED_TABLE_NAME IN ('Users', 'users');

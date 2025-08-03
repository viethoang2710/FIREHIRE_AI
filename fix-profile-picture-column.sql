-- Fix profile_picture column size issue
-- Current error: Data too long for column 'profile_picture'
-- Solution: Ensure column is LONGBLOB (not BLOB or other smaller types)

USE firehire_ai;

-- Check current column definition
SHOW CREATE TABLE user_profiles;

-- Check column details specifically
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH,
    CHARACTER_OCTET_LENGTH,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'user_profiles' 
AND COLUMN_NAME = 'ProfilePicture';

-- Fix the column to be LONGBLOB (can hold up to 4GB)
ALTER TABLE user_profiles 
MODIFY COLUMN ProfilePicture LONGBLOB;

-- Verify the change
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'user_profiles' 
AND COLUMN_NAME = 'ProfilePicture';

-- Also ensure filename and size columns are adequate
ALTER TABLE user_profiles 
MODIFY COLUMN PictureFileName VARCHAR(500),
MODIFY COLUMN PictureFileSize BIGINT;

-- Test insert to verify fix
-- SELECT 'Column size fix completed' as Status;

-- Fix image column size issue for user_profiles table
USE firehire_ai;

-- First check current table structure
DESCRIBE user_profiles;

-- Check if there are any existing profiles with images
SELECT UserID, PictureFileName, PictureFileSize, 
       CASE 
           WHEN ProfilePicture IS NULL THEN 'NULL'
           ELSE CONCAT('Has Image (', LENGTH(ProfilePicture), ' bytes)')
       END as ImageStatus
FROM user_profiles;

-- Update the ProfilePicture column to LONGBLOB if not already
-- LONGBLOB can store up to 4GB, should be enough for any profile image
ALTER TABLE user_profiles MODIFY COLUMN ProfilePicture LONGBLOB;

-- Also ensure the filename and size columns are adequate
ALTER TABLE user_profiles MODIFY COLUMN PictureFileName VARCHAR(500);
ALTER TABLE user_profiles MODIFY COLUMN PictureFileSize BIGINT;

-- Show updated structure
SHOW CREATE TABLE user_profiles;

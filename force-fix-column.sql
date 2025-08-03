-- Force fix ProfilePicture column to LONGBLOB
USE firehire_ai;

-- Kiểm tra current type cả 2 tên column
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
  AND TABLE_NAME = 'user_profiles' 
  AND (COLUMN_NAME = 'ProfilePicture' OR COLUMN_NAME = 'profile_picture');

-- Force change to LONGBLOB cho cả 2 tên có thể có
ALTER TABLE user_profiles MODIFY COLUMN ProfilePicture LONGBLOB;
ALTER TABLE user_profiles MODIFY COLUMN profile_picture LONGBLOB;

-- Verify the change
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
  AND TABLE_NAME = 'user_profiles' 
  AND (COLUMN_NAME = 'ProfilePicture' OR COLUMN_NAME = 'profile_picture');

-- Show table structure  
DESCRIBE user_profiles;

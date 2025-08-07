-- Fix database columns to support larger file sizes
ALTER TABLE cvs MODIFY file_data LONGBLOB;
ALTER TABLE user_profiles MODIFY profile_picture LONGBLOB;

-- Check the updated column types
SHOW COLUMNS FROM cvs LIKE 'file_data';
SHOW COLUMNS FROM user_profiles LIKE 'profile_picture';

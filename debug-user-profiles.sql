-- Kiểm tra và debug user_profiles table
USE firehire_ai;

-- 1. Kiểm tra cấu trúc bảng hiện tại
SHOW TABLES LIKE '%profile%';
DESCRIBE user_profiles;

-- 2. Kiểm tra dữ liệu hiện có
SELECT COUNT(*) FROM user_profiles;
SELECT ProfileID, UserID, Title, Phone, Address FROM user_profiles LIMIT 5;

-- 3. Kiểm tra foreign key references
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'firehire_ai' 
  AND TABLE_NAME = 'user_profiles' 
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 4. Test tạo sample record
INSERT INTO user_profiles (UserID, Title, Bio, Phone, Address) 
VALUES (1, 'Test Title', 'Test Bio', '123456789', 'Test Address')
ON DUPLICATE KEY UPDATE Title = VALUES(Title);

SELECT * FROM user_profiles WHERE UserID = 1;

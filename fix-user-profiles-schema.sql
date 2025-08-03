-- Fix lỗi user_profiles schema
USE firehire_ai;

-- 1. Kiểm tra bảng hiện tại
DESCRIBE user_profiles;

-- 2. Xóa bảng cũ nếu có lỗi cấu trúc
DROP TABLE IF EXISTS user_profiles;

-- 3. Tạo lại bảng user_profiles với cấu trúc đúng
CREATE TABLE user_profiles (
    ProfileID BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Title VARCHAR(255),
    Bio TEXT,
    Skills TEXT,
    Experience VARCHAR(255),
    Phone VARCHAR(20),
    Address VARCHAR(500),
    LinkedIn VARCHAR(255),
    GitHub VARCHAR(255),
    Website VARCHAR(255),
    ProfilePicture LONGBLOB,
    PictureFileName VARCHAR(255),
    PictureFileSize BIGINT,
    DateOfBirth DATE,
    Gender ENUM('MALE', 'FEMALE', 'OTHER'),
    Nationality VARCHAR(100),
    Languages TEXT,
    Education TEXT,
    Certifications TEXT,
    WorkPreference ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'REMOTE'),
    SalaryExpectation VARCHAR(100),
    IsPublic BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint - kiểm tra tên bảng Users đúng
    CONSTRAINT fk_user_profile FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    
    -- Unique constraint để đảm bảo 1 user chỉ có 1 profile
    UNIQUE KEY unique_user_profile (UserID)
);

-- 4. Kiểm tra bảng đã tạo thành công
DESCRIBE user_profiles;

-- 5. Hiển thị thông tin bảng
SHOW CREATE TABLE user_profiles;

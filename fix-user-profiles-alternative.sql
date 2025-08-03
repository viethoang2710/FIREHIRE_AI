-- Alternative fix if Users table is uppercase and UserID is different type
-- Run this if the first fix doesn't work

USE firehire_ai;

-- Check what tables actually exist
SHOW TABLES;

-- Check Users table structure (try both cases)
-- DESCRIBE Users;
-- DESCRIBE users;

-- Option A: If table is 'Users' (uppercase) with INT UserID
DROP TABLE IF EXISTS user_profiles;
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
    
    -- Try uppercase 'Users' table name
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_profile (UserID)
);

-- Option B: Create without foreign key first, then add it
-- DROP TABLE IF EXISTS user_profiles;
-- CREATE TABLE user_profiles (
--     ProfileID BIGINT AUTO_INCREMENT PRIMARY KEY,
--     UserID INT NOT NULL,
--     ... other columns ...
--     UNIQUE KEY unique_user_profile (UserID)
-- );
-- 
-- -- Add foreign key constraint separately
-- ALTER TABLE user_profiles 
-- ADD CONSTRAINT fk_user_profiles_user_id 
-- FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE;

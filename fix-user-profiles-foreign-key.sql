-- Fixed user_profiles table creation with proper UserID data type
-- This version handles the foreign key compatibility issue

USE firehire_ai;

-- Drop the table if it exists (to start fresh)
DROP TABLE IF EXISTS user_profiles;

-- Method 1: Try with INT UserID (most likely correct)
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
    
    -- Try lowercase 'users' table name
    FOREIGN KEY (UserID) REFERENCES users(UserID) ON DELETE CASCADE,
    
    -- Unique constraint
    UNIQUE KEY unique_user_profile (UserID)
);

-- Create indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(UserID);
CREATE INDEX idx_user_profiles_public ON user_profiles(IsPublic);
CREATE INDEX idx_user_profiles_work_preference ON user_profiles(WorkPreference);

-- Insert sample data
INSERT INTO user_profiles (
    UserID, Title, Bio, Skills, Experience, Phone, Address,
    WorkPreference, SalaryExpectation
) VALUES 
(1, 'Frontend Developer & Data Engineer', 
 'Passionate developer với kinh nghiệm phát triển web và phân tích dữ liệu.',
 'React, Node.js, Python, MySQL, MongoDB, JavaScript, HTML/CSS',
 '3 năm kinh nghiệm',
 '+84 123 456 789',
 'Hồ Chí Minh, Việt Nam',
 'FULL_TIME',
 '15 - 30 triệu VNĐ'
) AS new_values ON DUPLICATE KEY UPDATE
    Title = new_values.Title,
    Bio = new_values.Bio,
    Skills = new_values.Skills;

-- Verify creation
DESCRIBE user_profiles;

-- Check the data
SELECT 
    up.ProfileID,
    u.FullName,
    u.Email,
    up.Title,
    up.Experience,
    up.CreatedAt
FROM user_profiles up
JOIN users u ON up.UserID = u.UserID
LIMIT 3;

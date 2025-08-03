-- Create user_profiles table to store additional user information
-- This extends the existing Users table with profile-specific data

USE firehire_ai;

-- Drop table if exists to recreate with correct data types
DROP TABLE IF EXISTS user_profiles;

-- Create user_profiles table
CREATE TABLE user_profiles (
    ProfileID BIGINT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,  -- Changed from BIGINT to INT to match Java Integer
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
    
    -- Foreign key constraint
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    
    -- Unique constraint to ensure one profile per user
    UNIQUE KEY unique_user_profile (UserID)
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(UserID);
CREATE INDEX idx_user_profiles_public ON user_profiles(IsPublic);
CREATE INDEX idx_user_profiles_work_preference ON user_profiles(WorkPreference);

-- Insert sample profile data for existing users
INSERT INTO user_profiles (
    UserID, Title, Bio, Skills, Experience, Phone, Address,
    WorkPreference, SalaryExpectation
) VALUES 
(1, 'Frontend Developer & Data Engineer', 
 'Passionate developer với kinh nghiệm phát triển web và phân tích dữ liệu. Luôn học hỏi công nghệ mới và thích thử thách bản thân với các dự án phức tạp.',
 'React, Node.js, Python, MySQL, MongoDB, JavaScript, HTML/CSS, TypeScript, Vue.js, Django',
 '3 năm kinh nghiệm',
 '+84 123 456 789',
 'Hồ Chí Minh, Việt Nam',
 'FULL_TIME',
 '15 - 30 triệu VNĐ'
) AS new_values ON DUPLICATE KEY UPDATE
    Title = new_values.Title,
    Bio = new_values.Bio,
    Skills = new_values.Skills,
    Experience = new_values.Experience,
    Phone = new_values.Phone,
    Address = new_values.Address,
    WorkPreference = new_values.WorkPreference,
    SalaryExpectation = new_values.SalaryExpectation;

-- Show the created table structure
DESCRIBE user_profiles;

-- Show sample data
SELECT 
    up.ProfileID,
    u.FullName,
    u.Email,
    up.Title,
    up.Experience,
    up.Phone,
    up.Address,
    up.Skills,
    up.CreatedAt
FROM user_profiles up
JOIN Users u ON up.UserID = u.UserID
LIMIT 5;

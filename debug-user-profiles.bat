@echo off
echo ===========================================
echo     DEBUG USER_PROFILES TABLE
echo ===========================================
echo.

echo Checking user_profiles table structure...
echo.

echo Please run these commands manually in MySQL:
echo.
echo USE firehire_ai;
echo DESCRIBE user_profiles;
echo.
echo If table doesn't exist, create it with:
echo.
echo CREATE TABLE user_profiles (
echo     ProfileID BIGINT AUTO_INCREMENT PRIMARY KEY,
echo     UserID INT NOT NULL,
echo     Title VARCHAR(255),
echo     Bio TEXT,
echo     Skills TEXT,
echo     Experience VARCHAR(255),
echo     Phone VARCHAR(20),
echo     Address VARCHAR(500),
echo     LinkedIn VARCHAR(255),
echo     GitHub VARCHAR(255),
echo     Website VARCHAR(255),
echo     ProfilePicture LONGBLOB,
echo     PictureFileName VARCHAR(255),
echo     PictureFileSize BIGINT,
echo     DateOfBirth DATE,
echo     Gender ENUM('MALE', 'FEMALE', 'OTHER'),
echo     Nationality VARCHAR(100),
echo     Languages TEXT,
echo     Education TEXT,
echo     Certifications TEXT,
echo     WorkPreference ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'REMOTE'),
echo     SalaryExpectation VARCHAR(100),
echo     IsPublic BOOLEAN DEFAULT TRUE,
echo     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
echo     FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
echo     UNIQUE KEY unique_user_profile (UserID)
echo );
echo.

pause

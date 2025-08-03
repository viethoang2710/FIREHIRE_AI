@echo off
echo 🔧 Fixing Profile Picture Column Size Issue...
echo.

echo Problem: Database column 'profile_picture' is too small
echo Solution: Change to LONGBLOB to support larger images
echo.

REM Try different MySQL connection methods
set MYSQL_PWD=root

echo Attempting to fix database column...
echo.

REM Method 1: Direct mysql command (if mysql is in PATH)
mysql -u root -p firehire_ai < fix-profile-picture-column.sql 2>mysql_column_fix_error.log

REM Check if mysql command worked
if %ERRORLEVEL% EQU 0 (
    echo ✅ SUCCESS: Profile picture column fixed successfully!
    echo.
    echo The column is now LONGBLOB and can handle larger images.
    echo You can now test image upload again.
    echo.
) else (
    echo ❌ MySQL command line not available.
    echo.
    echo Please run the fix manually:
    echo 1. Open MySQL Workbench
    echo 2. Connect to your firehire_ai database  
    echo 3. Run this command:
    echo.
    echo    ALTER TABLE user_profiles MODIFY COLUMN ProfilePicture LONGBLOB;
    echo.
    echo 4. Then test image upload again
    echo.
    if exist mysql_column_fix_error.log (
        echo Error details:
        type mysql_column_fix_error.log
    )
)

echo.
echo 📋 Next Steps:
echo 1. After fixing the column, restart your backend
echo 2. Test image upload again using the debug page
echo 3. The 98KB image should upload successfully now
echo.
pause

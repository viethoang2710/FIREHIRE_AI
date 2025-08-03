@echo off
echo Fixing image column in user_profiles table...
echo.

REM Try different MySQL connection methods
set MYSQL_PWD=root

REM Method 1: Direct mysql command
mysql -u root firehire_ai < fix-image-column.sql 2>mysql_error.log

REM Check if mysql command worked
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Image column fixed successfully!
    echo.
    echo Checking results:
    mysql -u root -e "DESCRIBE firehire_ai.user_profiles;" 2>>mysql_error.log
) else (
    echo ERROR: MySQL command failed. Checking error log...
    if exist mysql_error.log (
        type mysql_error.log
    )
    echo.
    echo Please make sure MySQL is running and credentials are correct.
    echo You can run the fix-image-column.sql file manually in MySQL Workbench.
)

echo.
echo Press any key to continue...
pause >nul

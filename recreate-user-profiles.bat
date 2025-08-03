@echo off
echo ===========================================
echo     RECREATE USER_PROFILES TABLE 
echo ===========================================
echo.

echo Recreating user_profiles table with correct data types...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < create-user-profiles-table.sql

echo.
echo Table recreation completed!
echo Please restart your backend application.
pause

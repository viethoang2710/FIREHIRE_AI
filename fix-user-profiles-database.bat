@echo off
echo ===========================================
echo     FIX USER_PROFILES SCHEMA
echo ===========================================
echo.

echo Connecting to MySQL and fixing user_profiles table...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < fix-user-profiles-schema.sql

echo.
echo Schema fix completed!
pause

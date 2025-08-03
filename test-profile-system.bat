@echo off
echo ===========================================
echo     PROFILE SYSTEM - FULL TEST
echo ===========================================
echo.

echo 1. Recreating database table...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < create-user-profiles-table.sql

echo.
echo 2. Starting backend (in background)...
start "Backend" cmd /c "cd BE && mvn spring-boot:run"

echo.
echo 3. Waiting for backend to start (30 seconds)...
timeout /t 30

echo.
echo 4. Opening test page...
start test-profile-api.html

echo.
echo Backend is running at: http://localhost:8080
echo Frontend test page opened in browser
echo.
echo To stop backend, close the "Backend" window
pause

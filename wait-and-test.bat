@echo off
echo 🚀 Waiting for backend to start...
echo.

:check_backend
timeout /t 5 >nul
curl -s http://localhost:8080/api/profile/1 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend is running!
    echo.
    echo Opening Quick Fix page...
    start chrome quick-fix-image.html
    echo.
    echo 📋 Next steps:
    echo 1. The page should show Backend Status as "SUCCESS"
    echo 2. Try the "Fix Database Now" button
    echo 3. Then test image upload with User ID 19
    echo.
    pause
    goto end
) else (
    echo ⏳ Backend not ready yet, checking again...
    goto check_backend
)

:end

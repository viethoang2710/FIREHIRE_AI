@echo off
echo Waiting for backend to start...
echo.

:check_backend
timeout /t 3 >nul
curl -s http://localhost:8080/actuator/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend is running!
    echo Opening debug page...
    start chrome debug-image-advanced.html
    goto end
) else (
    echo ⏳ Backend not ready yet, checking again...
    goto check_backend
)

:end
echo.
echo 🔧 Debug page should be open now
echo.
echo Next steps:
echo 1. Use the debug page to analyze your image
echo 2. Test step-by-step upload to find the exact error
echo 3. Check the detailed logs for the root cause
echo.
pause

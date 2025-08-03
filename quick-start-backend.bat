@echo off
title FireHire AI Backend
color 0A
echo ==========================================
echo     🚀 FireHire AI Backend Starter
echo ==========================================
echo.

cd /d "C:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI\BE"

echo [1/3] Checking Java installation...
java -version
if %errorlevel% neq 0 (
    echo ❌ ERROR: Java not found!
    echo Please install Java 11 or higher.
    pause
    exit /b 1
) else (
    echo ✅ Java found!
)

echo.
echo [2/3] Building project...
call mvnw.cmd clean compile -q
if %errorlevel% neq 0 (
    echo ❌ ERROR: Build failed!
    echo Check the error messages above.
    pause
    exit /b 1
) else (
    echo ✅ Build successful!
)

echo.
echo [3/3] Starting Spring Boot application...
echo.
echo 🌐 Backend URL: http://localhost:8080
echo 🔗 API Base: http://localhost:8080/api
echo 📊 CV Endpoint: http://localhost:8080/api/cv/user/19
echo.
echo ⏳ Starting server... (This may take a few moments)
echo.
echo ============================================
echo   Press Ctrl+C to stop the backend server
echo ============================================
echo.

call mvnw.cmd spring-boot:run

echo.
echo ==========================================
echo     Backend stopped.
echo ==========================================
pause

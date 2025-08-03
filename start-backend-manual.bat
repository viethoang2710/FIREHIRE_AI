@echo off
echo ==========================================
echo     FireHire AI Backend Starter
echo ==========================================

cd /d "c:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI\BE"

echo [1/4] Checking Java...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java not found! Please install Java 11 or higher.
    pause
    exit /b 1
)

echo [2/4] Cleaning previous builds...
call mvnw.cmd clean

echo [3/4] Compiling project...
call mvnw.cmd compile
if %errorlevel% neq 0 (
    echo ERROR: Compilation failed!
    pause
    exit /b 1
)

echo [4/4] Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
call mvnw.cmd spring-boot:run

echo Backend stopped.
pause

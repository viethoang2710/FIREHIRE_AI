@echo off
echo ===========================================
echo     FIREHIRE AI - FRONTEND STARTUP
echo ===========================================
echo.

cd /d "c:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI\FE"

echo Checking Node.js version...
node -v
echo.

echo Checking npm version...
npm -v
echo.

echo Installing dependencies (if needed)...
npm install
echo.

echo Starting React frontend...
echo Frontend will be available at: http://localhost:3000
echo Make sure backend is running at: http://localhost:8080
echo.

npm start

pause

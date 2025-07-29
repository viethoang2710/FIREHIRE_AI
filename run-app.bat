@echo off
echo ====================================================
echo FIREHIRE_AI - Starting both backend and frontend
echo ====================================================
echo.

echo Starting Backend (Spring Boot)...
echo.
start cmd /k "cd BE && call run-spring.cmd"

echo Waiting for 10 seconds to allow backend to start...
timeout /t 10 > nul

echo.
echo Starting Frontend (React)...
echo.
start cmd /k "cd FE && npm install && npm start"

echo.
echo ====================================================
echo FIREHIRE_AI is starting up!
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Network Debug: http://localhost:3000/network-debug
echo ====================================================
echo.
echo Windows will open separate command windows for backend and frontend.

pause

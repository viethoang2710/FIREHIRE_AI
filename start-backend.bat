@echo off
cd /d "C:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI\BE"
echo Starting Spring Boot backend with file upload support...
echo Backend will run on http://localhost:8080
echo.
echo File upload configuration:
echo - Max file size: 10MB
echo - Max request size: 10MB
echo.
mvnw.cmd spring-boot:run
echo.
echo Backend stopped. Press any key to exit...
pause off
cd /d "C:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI\BE"
echo Starting Spring Boot backend...
call mvnw.cmd spring-boot:run
pause

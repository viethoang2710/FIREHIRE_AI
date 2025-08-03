@echo off
echo ===========================================
echo     FIREHIRE AI - BACKEND STARTUP
echo ===========================================
echo.

cd /d "c:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI\BE"

echo Checking Java version...
java -version
echo.

echo Checking Maven version...
mvn -version
echo.

echo Starting MySQL database (if needed)...
:: Uncomment if you want to start MySQL automatically
:: net start mysql

echo.
echo Starting Spring Boot backend...
echo Backend will be available at: http://localhost:8080
echo API documentation: http://localhost:8080/swagger-ui.html
echo.

mvn spring-boot:run

pause

@echo off
echo Đang khởi động FireHire AI...
echo.

:: Kiểm tra Java
echo Kiểm tra cài đặt Java...
java -version > nul 2>&1
if %errorlevel% neq 0 (
    echo CẢNH BÁO: Không tìm thấy Java. Đang chạy script cài đặt Java...
    call setup-java.bat
    if %errorlevel% neq 0 (
        echo Không thể thiết lập Java. Vui lòng cài đặt Java thủ công.
        pause
        exit /b 1
    )
)

:: Mở terminal mới để chạy backend
echo.
echo Đang khởi động Backend (Spring Boot)...
start cmd /k "cd BE && call mvnw-fixed.cmd spring-boot:run"

:: Đợi một chút để backend khởi động
echo Đợi backend khởi động (10 giây)...
timeout /t 10

:: Mở terminal mới để chạy frontend
echo.
echo Đang khởi động Frontend (React)...
start cmd /k "cd FE && npm install && npm start"

echo.
echo Hệ thống đang khởi động...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Trang debug mạng: http://localhost:3000/network-debug

pause

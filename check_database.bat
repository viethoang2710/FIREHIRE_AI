@echo off
echo Kiểm tra kết nối MySQL của ứng dụng FIREHIRE_AI

REM Kiểm tra xem MySQL đang chạy không
echo Kiểm tra MySQL đang chạy...
netstat -ano | findstr :3306
if %errorlevel% neq 0 (
    echo CẢNH BÁO: Có thể MySQL không đang chạy! Port 3306 không được tìm thấy.
    echo Vui lòng kiểm tra MySQL service trong Services hoặc MySQL Workbench.
) else (
    echo MySQL đang chạy (Port 3306 được tìm thấy).
)

echo.
echo Xác nhận rằng database firehire_ai tồn tại:
echo 1. Mở MySQL Command Line Client hoặc MySQL Workbench
echo 2. Chạy lệnh: SHOW DATABASES;
echo 3. Kiểm tra xem firehire_ai có trong danh sách không
echo 4. Nếu không, tạo database bằng lệnh: CREATE DATABASE firehire_ai;
echo.
echo Xác nhận rằng thông tin đăng nhập trong application.properties là chính xác:
echo - Username: root
echo - Password: 3108
echo.
echo Các bước tiếp theo:
echo 1. Chạy backend:
echo    cd BE
echo    .\mvnw-fixed.cmd spring-boot:run
echo.
echo 2. Mở terminal mới và chạy frontend:
echo    cd FE
echo    npm install
echo    npm start
echo.
echo 3. Mở trình duyệt và kiểm tra:
echo    - http://localhost:3000 (Frontend)
echo    - http://localhost:8080 (Backend)
echo.
echo Xem thêm các mẹo khắc phục sự cố trong file REGISTRATION_DEBUG.md

pause

@echo off
color 0A
title FireHire AI - Công cụ khởi động và kiểm tra

echo ==============================================================
echo               FIREHIRE AI - KHỞI ĐỘNG VÀ KIỂM TRA
echo ==============================================================
echo.

echo Chức năng của script này:
echo 1. Kiểm tra các thành phần cần thiết
echo 2. Khởi động backend/frontend
echo 3. Hỗ trợ khắc phục lỗi
echo.

:menu
echo --- MENU CHÍNH ---
echo 1. Kiểm tra môi trường (Java, MySQL)
echo 2. Khởi động Backend
echo 3. Khởi động Frontend
echo 4. Khởi động toàn bộ hệ thống
echo 5. Kiểm tra lỗi đăng ký tài khoản
echo 6. Truy cập công cụ debug
echo 0. Thoát
echo.

set /p choice=Chọn tùy chọn (0-6): 

if "%choice%"=="1" goto checkEnvironment
if "%choice%"=="2" goto startBackend
if "%choice%"=="3" goto startFrontend
if "%choice%"=="4" goto startAll
if "%choice%"=="5" goto registrationDebug
if "%choice%"=="6" goto debugTools
if "%choice%"=="0" goto end

echo Tùy chọn không hợp lệ!
echo.
goto menu

:checkEnvironment
cls
echo --- KIỂM TRA MÔI TRƯỜNG ---
echo.

echo Kiểm tra Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [CẢNH BÁO] Không tìm thấy Java! Cần cài đặt Java để chạy backend.
    echo.
    echo Chạy setup-java.bat để thiết lập Java...
    call setup-java.bat
) else (
    echo [OK] Java đã được cài đặt.
)

echo.
echo Kiểm tra MySQL...
netstat -ano | findstr :3306 >nul
if %errorlevel% neq 0 (
    echo [CẢNH BÁO] MySQL có thể không hoạt động! Port 3306 không được tìm thấy.
    echo Hãy khởi động MySQL trước khi chạy backend.
) else (
    echo [OK] MySQL đang chạy (port 3306).
)

echo.
echo Kiểm tra npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [CẢNH BÁO] Không tìm thấy npm! Cần cài đặt Node.js để chạy frontend.
    echo Tải Node.js tại: https://nodejs.org/
) else (
    echo [OK] npm đã được cài đặt.
)

echo.
pause
cls
goto menu

:startBackend
cls
echo --- KHỞI ĐỘNG BACKEND ---
echo.
echo Đang chuyển đến thư mục Backend...
cd BE
echo.
echo Khởi động backend với Spring Boot...
echo.
echo Chạy với script tự động phát hiện Java...
call run-spring.cmd
pause
cls
goto menu

:startFrontend
cls
echo --- KHỞI ĐỘNG FRONTEND ---
echo.
echo Đang chuyển đến thư mục Frontend...
cd FE
echo.
echo Cài đặt các dependencies (có thể mất vài phút)...
call npm install
echo.
echo Khởi động frontend với React...
echo.
call npm start
pause
cls
goto menu

:startAll
cls
echo --- KHỞI ĐỘNG TOÀN BỘ HỆ THỐNG ---
echo.
echo Khởi động Backend...
start cmd /k "cd BE && call run-spring.cmd"

echo.
echo Đợi 10 giây để Backend khởi động...
timeout /t 10 >nul

echo.
echo Khởi động Frontend...
start cmd /k "cd FE && npm install && npm start"

echo.
echo Hệ thống đang khởi động...
echo - Backend: http://localhost:8080
echo - Frontend: http://localhost:3000
echo.
echo Trang debug:
echo - Network Debug: http://localhost:3000/network-debug
echo - API Test: http://localhost:3000/api-test
echo.

pause
cls
goto menu

:registrationDebug
cls
echo --- KIỂM TRA LỖI ĐĂNG KÝ TÀI KHOẢN ---
echo.
echo Có một số cách để kiểm tra:
echo.
echo 1. Sử dụng trang API Test
echo 2. Kiểm tra kết nối MySQL
echo 3. Đọc hướng dẫn khắc phục lỗi đăng ký
echo 0. Quay lại menu chính
echo.

set /p regChoice=Chọn tùy chọn (0-3): 

if "%regChoice%"=="0" goto menu
if "%regChoice%"=="1" (
    start http://localhost:3000/api-test
    goto registrationDebug
)
if "%regChoice%"=="2" (
    powershell -ExecutionPolicy Bypass -File check-mysql.ps1
    goto registrationDebug
)
if "%regChoice%"=="3" (
    powershell -ExecutionPolicy Bypass -Command "& {start notepad.exe 'REGISTRATION_ERRORS.md'}"
    goto registrationDebug
)

echo Tùy chọn không hợp lệ!
goto registrationDebug

:debugTools
cls
echo --- CÔNG CỤ DEBUG ---
echo.
echo 1. Mở trang Network Debug
echo 2. Mở trang API Test
echo 3. Kiểm tra kết nối MySQL
echo 4. Kiểm tra health của backend
echo 0. Quay lại menu chính
echo.

set /p dbgChoice=Chọn công cụ (0-4): 

if "%dbgChoice%"=="0" goto menu
if "%dbgChoice%"=="1" (
    start http://localhost:3000/network-debug
    goto debugTools
)
if "%dbgChoice%"=="2" (
    start http://localhost:3000/api-test
    goto debugTools
)
if "%dbgChoice%"=="3" (
    powershell -ExecutionPolicy Bypass -File check-mysql.ps1
    goto debugTools
)
if "%dbgChoice%"=="4" (
    start http://localhost:8080/health
    goto debugTools
)

echo Tùy chọn không hợp lệ!
goto debugTools

:end
cls
echo Cảm ơn bạn đã sử dụng công cụ FireHire AI.
echo.
echo Tác giả: GitHub Copilot
echo.
pause

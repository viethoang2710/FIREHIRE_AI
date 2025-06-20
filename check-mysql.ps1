# Script kiểm tra kết nối MySQL cho FireHire_AI

Write-Host "=== Công cụ kiểm tra MySQL cho FireHire_AI ===" -ForegroundColor Cyan
Write-Host "Script này sẽ kiểm tra kết nối MySQL và cấu hình database" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem MySQL có đang chạy không
Write-Host "1. Kiểm tra MySQL có đang chạy..." -ForegroundColor Yellow
$mysqlProcess = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue

if ($mysqlProcess) {
    Write-Host "   ✅ MySQL đang chạy (port 3306 đang mở)" -ForegroundColor Green
} else {
    Write-Host "   ❌ MySQL KHÔNG chạy! Port 3306 không được tìm thấy." -ForegroundColor Red
    Write-Host "   → Hãy khởi động MySQL trước khi tiếp tục." -ForegroundColor Red
    Write-Host ""
    Write-Host "Bạn có thể khởi động MySQL bằng một trong các cách sau:" -ForegroundColor Yellow
    Write-Host "- Qua MySQL Workbench" -ForegroundColor White
    Write-Host "- Qua Services (Win+R → services.msc → tìm 'MySQL')" -ForegroundColor White
    Write-Host "- Qua Command Line: 'net start mysql'" -ForegroundColor White
    Write-Host ""
    $startMySQL = Read-Host "Bạn có muốn thử khởi động MySQL ngay bây giờ không? (Y/N)"
    if ($startMySQL -eq "Y" -or $startMySQL -eq "y") {
        try {
            Write-Host "Đang thử khởi động MySQL..." -ForegroundColor Yellow
            net start mysql80
            Write-Host "Đã khởi động MySQL thành công!" -ForegroundColor Green
        } catch {
            Write-Host "Không thể khởi động MySQL. Vui lòng khởi động thủ công." -ForegroundColor Red
        }
    }
}

# Kiểm tra cấu hình database trong application.properties
Write-Host ""
Write-Host "2. Kiểm tra cấu hình database..." -ForegroundColor Yellow
$propertiesPath = "d:\Downloads\FIREHIRE_AI\BE\src\main\resources\application.properties"

if (Test-Path $propertiesPath) {
    $properties = Get-Content $propertiesPath
    $dbUrl = ($properties | Where-Object { $_ -match "spring.datasource.url" }) -replace "spring.datasource.url=", ""
    $dbUsername = ($properties | Where-Object { $_ -match "spring.datasource.username" }) -replace "spring.datasource.username=", ""
    $dbPassword = ($properties | Where-Object { $_ -match "spring.datasource.password" }) -replace "spring.datasource.password=", ""
    
    if ($dbUrl -and $dbUsername) {
        Write-Host "   ✅ Tìm thấy cấu hình database:" -ForegroundColor Green
        Write-Host "      - URL: $dbUrl" -ForegroundColor White
        Write-Host "      - Username: $dbUsername" -ForegroundColor White
        Write-Host "      - Password: [HIDDEN]" -ForegroundColor White
    } else {
        Write-Host "   ❌ Không tìm thấy đầy đủ cấu hình database trong application.properties!" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Không tìm thấy file application.properties!" -ForegroundColor Red
}

# Hướng dẫn cách tạo database
Write-Host ""
Write-Host "3. Hướng dẫn tạo database..." -ForegroundColor Yellow
Write-Host "   Để tạo database firehire_ai trong MySQL, hãy chạy lệnh sau trong MySQL:" -ForegroundColor White
Write-Host "   CREATE DATABASE IF NOT EXISTS firehire_ai;" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Bạn có thể thực hiện điều này thông qua:" -ForegroundColor White
Write-Host "   - MySQL Workbench" -ForegroundColor White
Write-Host "   - MySQL Command Line Client" -ForegroundColor White
Write-Host "   - Hoặc bất kỳ công cụ quản lý MySQL nào khác" -ForegroundColor White

# Kiểm tra các bảng trong database
Write-Host ""
Write-Host "4. Tình trạng database..." -ForegroundColor Yellow
Write-Host "   Sau khi backend chạy lần đầu, các bảng sẽ được tự động tạo (spring.jpa.hibernate.ddl-auto=update)" -ForegroundColor White
Write-Host "   Một số bảng quan trọng cần có:" -ForegroundColor White
Write-Host "   - users: Lưu thông tin người dùng" -ForegroundColor White
Write-Host "   - employers: Lưu thông tin nhà tuyển dụng" -ForegroundColor White
Write-Host "   - candidates: Lưu thông tin ứng viên" -ForegroundColor White

# Hướng dẫn khắc phục
Write-Host ""
Write-Host "=== HƯỚNG DẪN KHẮC PHỤC LỖI ===" -ForegroundColor Green
Write-Host "1. Nếu MySQL không chạy:" -ForegroundColor White
Write-Host "   - Khởi động MySQL qua Services" -ForegroundColor White
Write-Host "   - Hoặc chạy lệnh: net start mysql" -ForegroundColor White
Write-Host ""
Write-Host "2. Nếu không kết nối được database:" -ForegroundColor White
Write-Host "   - Kiểm tra username và password trong application.properties" -ForegroundColor White
Write-Host "   - Thử đăng nhập trực tiếp vào MySQL với thông tin tương tự" -ForegroundColor White
Write-Host ""
Write-Host "3. Nếu không tạo được tài khoản:" -ForegroundColor White
Write-Host "   - Kiểm tra log backend xem có lỗi SQL không" -ForegroundColor White
Write-Host "   - Kiểm tra database đã được tạo chưa" -ForegroundColor White
Write-Host "   - Kiểm tra quyền của user MySQL (cần quyền CREATE TABLE)" -ForegroundColor White
Write-Host ""
Write-Host "4. Kiểm tra API qua trang test:" -ForegroundColor White
Write-Host "   - Truy cập: http://localhost:3000/api-test" -ForegroundColor Cyan
Write-Host "   - Tool này sẽ thử đăng ký tài khoản trực tiếp qua API" -ForegroundColor White

Write-Host ""
$action = Read-Host "Bạn muốn làm gì tiếp theo? (1: Mở MySQL Workbench, 2: Khởi động backend, 3: Truy cập trang API Test, Enter: Thoát)"

switch ($action) {
    "1" {
        try { Start-Process "C:\Program Files\MySQL\MySQL Workbench\MySQLWorkbench.exe" } catch { Write-Host "Không thể mở MySQL Workbench" -ForegroundColor Red }
    }
    "2" {
        Set-Location "d:\Downloads\FIREHIRE_AI\BE"
        .\run-spring.ps1
    }
    "3" {
        Start-Process "http://localhost:3000/api-test"
    }
}

# Kiểm tra kết nối MySQL của ứng dụng FIREHIRE_AI

Write-Host "Kiểm tra kết nối MySQL của ứng dụng FIREHIRE_AI" -ForegroundColor Cyan

# Kiểm tra xem MySQL đang chạy không
Write-Host "Kiểm tra MySQL đang chạy..." -ForegroundColor Yellow
$mysqlRunning = netstat -ano | Select-String ":3306"
if (-not $mysqlRunning) {
    Write-Host "CẢNH BÁO: Có thể MySQL không đang chạy! Port 3306 không được tìm thấy." -ForegroundColor Red
    Write-Host "Vui lòng kiểm tra MySQL service trong Services hoặc MySQL Workbench." -ForegroundColor Red
} else {
    Write-Host "MySQL đang chạy (Port 3306 được tìm thấy)." -ForegroundColor Green
}

Write-Host "`nXác nhận rằng database firehire_ai tồn tại:" -ForegroundColor Yellow
Write-Host "1. Mở MySQL Command Line Client hoặc MySQL Workbench"
Write-Host "2. Chạy lệnh: SHOW DATABASES;"
Write-Host "3. Kiểm tra xem firehire_ai có trong danh sách không"
Write-Host "4. Nếu không, tạo database bằng lệnh: CREATE DATABASE firehire_ai;"

Write-Host "`nXác nhận rằng thông tin đăng nhập trong application.properties là chính xác:" -ForegroundColor Yellow
Write-Host "- Username: root"
Write-Host "- Password: 3108"

Write-Host "`nCác bước tiếp theo:" -ForegroundColor Green
Write-Host "1. Chạy backend:" -ForegroundColor White
Write-Host "   cd BE" -ForegroundColor Cyan
Write-Host "   .\mvnw-fixed.cmd spring-boot:run" -ForegroundColor Cyan

Write-Host "`n2. Mở terminal mới và chạy frontend:" -ForegroundColor White
Write-Host "   cd FE" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan

Write-Host "`n3. Mở trình duyệt và kiểm tra:" -ForegroundColor White
Write-Host "   - http://localhost:3000 (Frontend)" -ForegroundColor Cyan
Write-Host "   - http://localhost:8080 (Backend)" -ForegroundColor Cyan

Write-Host "`nXem thêm các mẹo khắc phục sự cố trong file REGISTRATION_DEBUG.md" -ForegroundColor Yellow

Write-Host "`nNhấn Enter để tiếp tục..." -ForegroundColor Magenta
Read-Host

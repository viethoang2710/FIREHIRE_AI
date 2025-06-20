# Script khởi động FireHire AI

Write-Host "Đang khởi động FireHire AI..." -ForegroundColor Cyan

# Kiểm tra Java
Write-Host "Kiểm tra cài đặt Java..." -ForegroundColor Yellow
$javaInstalled = $false
try {
    $javaVersion = java -version 2>&1
    $javaInstalled = $true
} catch {
    Write-Host "CẢNH BÁO: Không tìm thấy Java. Đang chạy script cài đặt Java..." -ForegroundColor Red
    & "$PSScriptRoot\setup-java.ps1"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Không thể thiết lập Java. Vui lòng cài đặt Java thủ công." -ForegroundColor Red
        Read-Host "Nhấn Enter để thoát"
        exit 1
    }
}

# Khởi động backend
Write-Host "`nĐang khởi động Backend (Spring Boot)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\BE'; .\mvnw-fixed.cmd spring-boot:run"

# Đợi backend khởi động
Write-Host "Đợi backend khởi động (10 giây)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Khởi động frontend
Write-Host "`nĐang khởi động Frontend (React)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\FE'; npm install; npm start"

Write-Host "`nHệ thống đang khởi động..." -ForegroundColor Green
Write-Host "Backend: http://localhost:8080" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "`nTrang debug mạng: http://localhost:3000/network-debug" -ForegroundColor Magenta

Read-Host "`nNhấn Enter để kết thúc script này (các cửa sổ phụ vẫn tiếp tục chạy)"

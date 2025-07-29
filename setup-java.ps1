# Tìm và thiết lập JAVA_HOME tự động

Write-Host "Đang tìm cài đặt Java..."

# Tìm các đường dẫn Java có thể có
$javaPaths = @(
    "C:\Program Files\Java\jdk*",
    "C:\Program Files\Java\jre*",
    "C:\Program Files (x86)\Java\jdk*",
    "C:\Program Files (x86)\Java\jre*"
)

# Tìm thư mục Java mới nhất
$javaHome = $null
foreach ($path in $javaPaths) {
    $directories = Get-ChildItem -Path $path -ErrorAction SilentlyContinue
    if ($directories -and $directories.Count -gt 0) {
        $javaHome = $directories | Sort-Object -Property Name -Descending | Select-Object -First 1 -ExpandProperty FullName
        break
    }
}

if ($javaHome) {
    # Thiết lập biến môi trường cho phiên hiện tại
    $env:JAVA_HOME = $javaHome
    Write-Host "Đã thiết lập JAVA_HOME tạm thời thành: $javaHome" -ForegroundColor Green
    
    # Cập nhật PATH
    $env:Path = "$env:Path;$javaHome\bin"
    Write-Host "Đã thêm Java vào PATH cho phiên hiện tại" -ForegroundColor Green
    
    # Kiểm tra phiên bản Java
    Write-Host "`nKiểm tra phiên bản Java:" -ForegroundColor Yellow
    java -version
    
    # Hỏi người dùng có muốn thiết lập vĩnh viễn không
    $response = Read-Host "`nBạn có muốn thiết lập JAVA_HOME vĩnh viễn không? (Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "Machine")
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
        if (-not $currentPath.Contains("$javaHome\bin")) {
            [Environment]::SetEnvironmentVariable("Path", "$currentPath;$javaHome\bin", "Machine")
        }
        Write-Host "Đã thiết lập JAVA_HOME vĩnh viễn thành: $javaHome" -ForegroundColor Green
        Write-Host "Bạn cần khởi động lại PowerShell để các thay đổi có hiệu lực toàn hệ thống" -ForegroundColor Yellow
    }
    
    # Hỏi người dùng có muốn chạy backend không
    $runBackend = Read-Host "`nBạn có muốn chạy backend ngay bây giờ không? (Y/N)"
    if ($runBackend -eq "Y" -or $runBackend -eq "y") {
        Write-Host "Đang chuyển đến thư mục backend..." -ForegroundColor Cyan
        Set-Location -Path "d:\Downloads\FIREHIRE_AI\BE"
        Write-Host "Đang khởi động backend..." -ForegroundColor Cyan
        .\mvnw-fixed.cmd spring-boot:run
    } else {
        Write-Host "Để chạy backend, sử dụng lệnh:" -ForegroundColor Cyan
        Write-Host "cd d:\Downloads\FIREHIRE_AI\BE" -ForegroundColor White
        Write-Host ".\mvnw-fixed.cmd spring-boot:run" -ForegroundColor White
    }
} else {
    Write-Host "Không tìm thấy cài đặt Java trên máy này." -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Java từ: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    Write-Host "Khuyến nghị: Java 11 LTS hoặc Java 17 LTS" -ForegroundColor Yellow
    
    $installNow = Read-Host "Bạn có muốn mở trang tải Java ngay bây giờ không? (Y/N)"
    if ($installNow -eq "Y" -or $installNow -eq "y") {
        Start-Process "https://www.oracle.com/java/technologies/downloads/"
    }
}

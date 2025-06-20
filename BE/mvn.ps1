# Giải pháp nhanh cho lỗi JAVA_HOME

Write-Host "Cố gắng phát hiện và thiết lập Java để chạy Spring Boot..." -ForegroundColor Cyan

# Tìm kiếm Java
$javaPaths = @(
    "$env:ProgramFiles\Java\jdk*",
    "$env:ProgramFiles\Java\jre*", 
    "${env:ProgramFiles(x86)}\Java\jdk*",
    "${env:ProgramFiles(x86)}\Java\jre*"
)

$javaFound = $false
foreach ($path in $javaPaths) {
    $dirs = Get-ChildItem -Path $path -ErrorAction SilentlyContinue
    if ($dirs) {
        $latestJava = $dirs | Sort-Object -Property Name -Descending | Select-Object -First 1 -ExpandProperty FullName
        if (Test-Path "$latestJava\bin\java.exe") {
            $env:JAVA_HOME = $latestJava
            $javaFound = $true
            break
        }
    }
}

if ($javaFound) {
    Write-Host "Đã tìm thấy Java tại: $env:JAVA_HOME" -ForegroundColor Green
    Write-Host "Đang thiết lập JAVA_HOME tạm thời..." -ForegroundColor Cyan
    
    # Thêm Java vào Path
    $env:Path = "$env:JAVA_HOME\bin;$env:Path"
    
    # Kiểm tra phiên bản Java
    Write-Host "`nPhiên bản Java:" -ForegroundColor Yellow
    java -version
    
    Write-Host "`nĐang chạy Spring Boot..." -ForegroundColor Cyan
    # Chạy mvnw với command line arguments từ script gốc
    & "$PSScriptRoot\mvnw.cmd" $args
} else {
    Write-Host "Không tìm thấy Java trên hệ thống này!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Java từ: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    
    $installJava = Read-Host "Bạn có muốn mở trang tải Java không? (Y/N)"
    if ($installJava -eq "Y" -or $installJava -eq "y") {
        Start-Process "https://www.oracle.com/java/technologies/downloads/"
    }
}

try {
    # Kết nối MySQL và check CV data
    $mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    if (Test-Path $mysqlPath) {
        Write-Host "=== KIỂM TRA DỮ LIỆU CV ===" -ForegroundColor Yellow
        
        # Try without password first
        Write-Host "Thử kết nối MySQL không password..." -ForegroundColor Blue
        & $mysqlPath -u root firehire_ai -e "SELECT COUNT(*) as Total_CVs FROM CVs;" 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Kết nối thành công!" -ForegroundColor Green
            
            # Check CVs table structure
            Write-Host "`n1. Cấu trúc bảng CVs:" -ForegroundColor Green
            & $mysqlPath -u root firehire_ai -e "DESCRIBE CVs;"
            
            # Check CV data
            Write-Host "`n2. Dữ liệu CV (5 records đầu):" -ForegroundColor Green
            & $mysqlPath -u root firehire_ai -e "SELECT CVID, UserID, Title, FileName, FileSize, CoverLetter, JobID FROM CVs LIMIT 5;"
            
            # Count total CVs
            Write-Host "`n3. Tổng số CV:" -ForegroundColor Green
            & $mysqlPath -u root firehire_ai -e "SELECT COUNT(*) as Total_CVs FROM CVs;"
            
        } else {
            Write-Host "Không thể kết nối MySQL. Có thể cần password hoặc MySQL chưa chạy." -ForegroundColor Red
        }
        
    } else {
        Write-Host "MySQL không tìm thấy tại: $mysqlPath" -ForegroundColor Red
        
        # Try alternative paths
        $altPaths = @(
            "C:\xampp\mysql\bin\mysql.exe",
            "C:\wamp64\bin\mysql\mysql*\bin\mysql.exe",
            "mysql.exe"
        )
        
        foreach ($path in $altPaths) {
            if (Test-Path $path) {
                Write-Host "Tìm thấy MySQL tại: $path" -ForegroundColor Green
                break
            }
        }
    }
} catch {
    Write-Host "Lỗi: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nHoàn thành kiểm tra!" -ForegroundColor Yellow

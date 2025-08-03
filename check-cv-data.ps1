try {
    # Kết nối MySQL và check CV data
    $mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    if (Test-Path $mysqlPath) {
        Write-Host "=== KIỂM TRA DỮ LIỆU CV ===" -ForegroundColor Yellow
        
        # Check CVs table structure
        Write-Host "1. Cấu trúc bảng CVs:" -ForegroundColor Green
        & $mysqlPath -u root -pPhuc2710@ firehire_ai -e "DESCRIBE CVs;"
        
        # Check CV data
        Write-Host "`n2. Dữ liệu CV (5 records đầu):" -ForegroundColor Green
        & $mysqlPath -u root -pPhuc2710@ firehire_ai -e "SELECT CVID, UserID, Title, FileName, FileSize, CoverLetter, JobID FROM CVs LIMIT 5;"
        
        # Count total CVs
        Write-Host "`n3. Tổng số CV:" -ForegroundColor Green
        & $mysqlPath -u root -pPhuc2710@ firehire_ai -e "SELECT COUNT(*) as Total_CVs FROM CVs;"
        
        # Check CVs for specific user
        Write-Host "`n4. CV của User ID 19:" -ForegroundColor Green
        & $mysqlPath -u root -pPhuc2710@ firehire_ai -e "SELECT * FROM CVs WHERE UserID = 19;"
        
        # Check all users with CVs
        Write-Host "`n5. Users có CV:" -ForegroundColor Green
        & $mysqlPath -u root -pPhuc2710@ firehire_ai -e "SELECT DISTINCT UserID, COUNT(*) as CV_Count FROM CVs GROUP BY UserID;"
        
    } else {
        Write-Host "MySQL không tìm thấy tại: $mysqlPath" -ForegroundColor Red
        Write-Host "Vui lòng cập nhật đường dẫn MySQL" -ForegroundColor Red
    }
} catch {
    Write-Host "Lỗi: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nHoàn thành kiểm tra!" -ForegroundColor Yellow

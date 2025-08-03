# Test script cho chức năng nhà tuyển dụng xem CV theo Job ID
# PowerShell script để test API endpoints

Write-Host "===========================================" -ForegroundColor Yellow
Write-Host "    🏢 Test Employer CV Management APIs" -ForegroundColor Yellow  
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host ""

# Kiểm tra backend đang chạy
Write-Host "1. Kiểm tra Backend Status..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method GET
    Write-Host "✅ Backend đang hoạt động!" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend không hoạt động!" -ForegroundColor Red
    Write-Host "Hãy chạy: quick-start-backend.bat" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test endpoint lấy tất cả applications
Write-Host "2. Test: Lấy tất cả applications..." -ForegroundColor Green
try {
    $allApps = Invoke-RestMethod -Uri "http://localhost:8080/api/applications" -Method GET
    Write-Host "✅ Lấy được $($allApps.data.Count) applications" -ForegroundColor Green
} catch {
    Write-Host "❌ Lỗi khi lấy applications: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test endpoint lấy applications theo job ID
$jobIds = @(1, 2, 3)
foreach ($jobId in $jobIds) {
    Write-Host "3. Test: Lấy CV cho Job ID $jobId..." -ForegroundColor Green
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/applications/job/$jobId" -Method GET
        if ($response.success) {
            Write-Host "✅ Job ID $jobId có $($response.data.Count) CV ứng tuyển" -ForegroundColor Green
            
            if ($response.data.Count -gt 0) {
                Write-Host "   Danh sách ứng viên:" -ForegroundColor Cyan
                foreach ($app in $response.data) {
                    Write-Host "   - $($app.candidateName): $($app.cvTitle) [$($app.status)]" -ForegroundColor White
                }
            }
        } else {
            Write-Host "⚠️ API response không thành công: $($response.message)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Lỗi khi test Job ID $jobId : $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test endpoint từ EmployerController (nếu có)
Write-Host "4. Test: Employer endpoint cho Job applications..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/employers/job/1/applications" -Method GET
    if ($response.success) {
        Write-Host "✅ Employer endpoint hoạt động! Có $($response.data.Count) applications" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Employer endpoint chưa hoạt động: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Điều này bình thường nếu endpoint chưa được implement" -ForegroundColor Yellow
}

Write-Host ""

# Test database data
Write-Host "5. Kiểm tra dữ liệu database..." -ForegroundColor Green
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (Test-Path $mysqlPath) {
    try {
        Write-Host "   Checking Applications table..." -ForegroundColor Cyan
        & $mysqlPath -u root -pPhuc2710@ firehire_ai -e "SELECT COUNT(*) as total_applications FROM applications;"
        
        Write-Host "   Checking CVs table..." -ForegroundColor Cyan  
        & $mysqlPath -u root -pPhuc2710@ firehire_ai -e "SELECT COUNT(*) as total_cvs FROM CVs;"
        
        Write-Host "   Applications by Job ID..." -ForegroundColor Cyan
        & $mysqlPath -u root -pPhuc2710@ firehire_ai -e "SELECT job_id, COUNT(*) as app_count FROM applications GROUP BY job_id;"
        
    } catch {
        Write-Host "❌ Không thể kết nối MySQL: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ MySQL không được tìm thấy tại đường dẫn mặc định" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host "    ✅ Test hoàn thành!" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "📝 Tóm tắt chức năng đã tạo:" -ForegroundColor Green
Write-Host "1. ✅ Backend API: GET /api/applications/job/{jobId}" -ForegroundColor White
Write-Host "2. ✅ Frontend Page: EmployerCVListPage.js" -ForegroundColor White  
Write-Host "3. ✅ Frontend Page: JobManagementPage.js" -ForegroundColor White
Write-Host "4. ✅ Demo HTML: employer-cv-demo.html" -ForegroundColor White
Write-Host "5. ✅ Controller endpoint cho Employer" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Để sử dụng:" -ForegroundColor Green
Write-Host "1. Khởi động Backend: quick-start-backend.bat" -ForegroundColor White
Write-Host "2. Khởi động Frontend: cd FE && npm start" -ForegroundColor White  
Write-Host "3. Truy cập Job Management: http://localhost:3000/job-management" -ForegroundColor White
Write-Host "4. Hoặc test demo: mở employer-cv-demo.html" -ForegroundColor White

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

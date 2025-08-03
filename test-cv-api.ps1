# Test CV Upload API after backend is fixed

Write-Host "Testing CV Upload API functionality..." -ForegroundColor Green

# Test if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/jobs" -Method GET -TimeoutSec 5
    Write-Host "✓ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is not running. Please start it first." -ForegroundColor Red
    Write-Host "Run: cd BE; .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow
    exit
}

# Test get all applications
try {
    $applicationsResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/applications" -Method GET
    $applications = $applicationsResponse.Content | ConvertFrom-Json
    Write-Host "✓ Applications API working. Found $($applications.data.Count) applications" -ForegroundColor Green
} catch {
    Write-Host "✗ Error testing applications API: $($_.Exception.Message)" -ForegroundColor Red
}

# Test get applications by candidate
try {
    $candidateAppsResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/applications/candidate/1002" -Method GET
    $candidateApps = $candidateAppsResponse.Content | ConvertFrom-Json
    Write-Host "✓ Candidate applications API working. Found $($candidateApps.data.Count) applications for candidate 1002" -ForegroundColor Green
} catch {
    Write-Host "✗ Error testing candidate applications API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAPI endpoints ready for CV upload testing!" -ForegroundColor Cyan
Write-Host "1. Open test-cv-upload.html in browser" -ForegroundColor Yellow
Write-Host "2. Select sample-cv.txt file" -ForegroundColor Yellow
Write-Host "3. Click 'Upload CV to Database'" -ForegroundColor Yellow

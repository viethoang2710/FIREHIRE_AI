# Quick Backend Start and Test Script
Write-Host "🚀 Starting Backend and Testing CV Upload..." -ForegroundColor Cyan

# Change to BE directory
Set-Location "C:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI\BE"

# Check if backend is already running
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/jobs" -Method GET -TimeoutSec 3
    $backendRunning = $true
    Write-Host "✅ Backend is already running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend not running, starting it..." -ForegroundColor Yellow
}

if (-not $backendRunning) {
    Write-Host "Starting Spring Boot..." -ForegroundColor Yellow
    Start-Process -FilePath "mvnw.cmd" -ArgumentList "spring-boot:run" -NoNewWindow -PassThru
    
    # Wait for backend to start
    Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
    $timeout = 60 # seconds
    $elapsed = 0
    
    do {
        Start-Sleep -Seconds 2
        $elapsed += 2
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/api/jobs" -Method GET -TimeoutSec 2
            $backendRunning = $true
            Write-Host "✅ Backend started successfully!" -ForegroundColor Green
            break
        } catch {
            Write-Host "." -NoNewline
        }
    } while ($elapsed -lt $timeout)
    
    if (-not $backendRunning) {
        Write-Host "`n❌ Backend failed to start within $timeout seconds" -ForegroundColor Red
        exit 1
    }
}

# Test API endpoints
Write-Host "`n🔍 Testing API endpoints..." -ForegroundColor Cyan

try {
    $jobsResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/jobs" -Method GET
    $jobs = $jobsResponse.Content | ConvertFrom-Json
    Write-Host "✅ Jobs API: Found $($jobs.data.Count) jobs" -ForegroundColor Green
} catch {
    Write-Host "❌ Jobs API failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $appsResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/applications" -Method GET
    $apps = $appsResponse.Content | ConvertFrom-Json
    Write-Host "✅ Applications API: Found $($apps.data.Count) applications" -ForegroundColor Green
} catch {
    Write-Host "❌ Applications API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Go back to root directory
Set-Location "C:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI"

Write-Host "`n🎯 Next steps to debug CV upload:" -ForegroundColor Yellow
Write-Host "1. Open debug-cv-upload.html in browser" -ForegroundColor White
Write-Host "2. Check 'Backend Status' first" -ForegroundColor White
Write-Host "3. Test 'API Endpoints'" -ForegroundColor White
Write-Host "4. Try 'CV Upload Test' with sample-cv.txt" -ForegroundColor White
Write-Host "`n📱 Frontend testing:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 in browser" -ForegroundColor White
Write-Host "2. Try to apply for a job" -ForegroundColor White
Write-Host "3. Check browser console (F12) for errors" -ForegroundColor White

Write-Host "`n✨ Ready for testing!" -ForegroundColor Green

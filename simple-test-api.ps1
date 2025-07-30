Write-Host "🔥 Testing FireHire AI Backend APIs..." -ForegroundColor Yellow

Write-Host "`n1. Testing backend connection..." -ForegroundColor Green
try {
    $response1 = Invoke-WebRequest -Uri "http://localhost:8080/api/jobs/hot-jobs?limit=1" -Method GET
    Write-Host "✅ Status: $($response1.StatusCode)" -ForegroundColor Green
    Write-Host "📦 Response: $($response1.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing GET recruiter jobs..." -ForegroundColor Green
try {
    $response2 = Invoke-WebRequest -Uri "http://localhost:8080/api/recruiter/jobs?employerId=1" -Method GET
    Write-Host "✅ Status: $($response2.StatusCode)" -ForegroundColor Green
    Write-Host "📦 Response: $($response2.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing POST create job..." -ForegroundColor Green
$jobJson = '{
    "title": "Test Job via PowerShell",
    "description": "Đây là job test từ PowerShell script", 
    "location": "Hà Nội",
    "salary": "1500-2500 USD",
    "jobType": "Full-time",
    "industry": "Công nghệ thông tin",
    "experienceLevel": "Middle", 
    "skillsRequired": "React, Node.js, JavaScript",
    "benefits": "Bảo hiểm, thưởng năm",
    "status": "ACTIVE",
    "employerId": 1
}'

try {
    $response3 = Invoke-WebRequest -Uri "http://localhost:8080/api/recruiter/jobs" -Method POST -ContentType "application/json" -Body $jobJson
    Write-Host "✅ Status: $($response3.StatusCode)" -ForegroundColor Green
    Write-Host "📦 Response: $($response3.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 API testing completed!" -ForegroundColor Yellow

# PowerShell script để test API endpoints
Write-Host "🔥 Testing FireHire AI Backend APIs..." -ForegroundColor Yellow

# Function để test API endpoint
function Test-APIEndpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [string]$Body = $null
    )
    
    Write-Host "`n$Name..." -ForegroundColor Green
    
    try {
        if ($Body) {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -ContentType "application/json" -Body $Body
        } else {
            $response = Invoke-WebRequest -Uri $Url -Method $Method
        }
        
        Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "📦 Response: $($response.Content)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 1: Backend connection
Test-APIEndpoint -Name "1. Testing backend connection" -Method "GET" -Url "http://localhost:8080/api/jobs/hot-jobs?limit=1"

# Test 2: GET recruiter jobs  
Test-APIEndpoint -Name "2. Testing GET recruiter jobs" -Method "GET" -Url "http://localhost:8080/api/recruiter/jobs?employerId=1"

# Test 3: POST create job
$jobData = @{
    title = "Test Job via PowerShell"
    description = "Đây là job test từ PowerShell script"
    location = "Hà Nội"
    salary = "1500-2500 USD"
    jobType = "Full-time"
    industry = "Công nghệ thông tin"
    experienceLevel = "Middle"
    skillsRequired = "React, Node.js, JavaScript"
    benefits = "Bảo hiểm, thưởng năm"
    status = "ACTIVE"
    employerId = 1
} | ConvertTo-Json

Test-APIEndpoint -Name "3. Testing POST create job" -Method "POST" -Url "http://localhost:8080/api/recruiter/jobs" -Body $jobData

Write-Host "`n🎯 API testing completed!" -ForegroundColor Yellow

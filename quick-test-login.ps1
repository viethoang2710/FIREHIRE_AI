# Quick Login Test Script
$loginData = @{
    email = "testlogin@example.com"
    password = "testpass123"
} | ConvertTo-Json

Write-Host "Testing login with new JWT secret..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ LOGIN SUCCESS!" -ForegroundColor Green
    Write-Host "User: $($response.fullName)" -ForegroundColor Green
    Write-Host "Role: $($response.role)" -ForegroundColor Green
    if ($response.token) {
        Write-Host "Token: Received" -ForegroundColor Green
    } else {
        Write-Host "Token: Missing" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ LOGIN FAILED:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nTesting CV upload endpoint..." -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/jobs" -Method GET
    Write-Host "✅ Backend is responding to API calls" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not responding" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

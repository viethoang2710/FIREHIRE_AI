# Test if users exist in database
Write-Host "Testing user existence in database..." -ForegroundColor Cyan

try {
    # Test if user 1002 exists
    $userResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/users" -Method GET
    $users = $userResponse.Content | ConvertFrom-Json
    
    if ($users.success -and $users.data) {
        Write-Host "Found $($users.data.Count) users in database" -ForegroundColor Green
        
        # Look for user 1002
        $user1002 = $users.data | Where-Object { $_.id -eq 1002 }
        if ($user1002) {
            Write-Host "✅ User 1002 exists: $($user1002.fullName) ($($user1002.email))" -ForegroundColor Green
        } else {
            Write-Host "❌ User 1002 NOT found in database" -ForegroundColor Red
            Write-Host "Available users:" -ForegroundColor Yellow
            $users.data | ForEach-Object { Write-Host "  - ID: $($_.id), Name: $($_.fullName), Email: $($_.email)" }
        }
    } else {
        Write-Host "❌ No users found or users API not working" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error checking users: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    # Test if job 4001 exists
    $jobsResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/jobs" -Method GET
    $jobs = $jobsResponse.Content | ConvertFrom-Json
    
    if ($jobs.success -and $jobs.data) {
        Write-Host "Found $($jobs.data.Count) jobs in database" -ForegroundColor Green
        
        # Look for job 4001
        $job4001 = $jobs.data | Where-Object { $_.id -eq 4001 }
        if ($job4001) {
            Write-Host "✅ Job 4001 exists: $($job4001.title)" -ForegroundColor Green
        } else {
            Write-Host "❌ Job 4001 NOT found in database" -ForegroundColor Red
            Write-Host "Available jobs (first 5):" -ForegroundColor Yellow
            $jobs.data | Select-Object -First 5 | ForEach-Object { Write-Host "  - ID: $($_.id), Title: $($_.title)" }
        }
    } else {
        Write-Host "❌ No jobs found or jobs API not working" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error checking jobs: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nRecommendations:" -ForegroundColor Yellow
Write-Host "1. Use valid User ID from the list above" -ForegroundColor White
Write-Host "2. Use valid Job ID from the list above" -ForegroundColor White
Write-Host "3. Test CV upload with correct IDs" -ForegroundColor White

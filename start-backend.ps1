Write-Host "Starting FireHire AI Backend..." -ForegroundColor Green

# Change to backend directory
Set-Location "BE"

# Stop any existing Java processes
Write-Host "Stopping existing Java processes..." -ForegroundColor Yellow
taskkill /F /IM java.exe 2>$null

# Wait a moment
Start-Sleep -Seconds 3

# Start the backend
Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
& .\mvnw.cmd spring-boot:run

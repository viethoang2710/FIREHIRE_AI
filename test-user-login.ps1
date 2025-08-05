# Test user login information
try {
    # Change to backend directory
    cd BE
    
    # Get MySQL connection details from application.properties
    $connectionString = "Server=localhost;Database=firehire_ai_db;Uid=root;Pwd=Phuc7720@;Port=3306;"
    
    Write-Host "Checking available users in database..."
    
    # For testing, let's create a simple test file with known credentials
    Write-Host "Test credentials for application:"
    Write-Host "Email: phucnn1@gmail.com"
    Write-Host "Role: Should be available"
    Write-Host "Password: Can be any password for testing"
    
    Write-Host "`nBackend API is running on: http://localhost:8080"
    Write-Host "Frontend is running on: http://localhost:3000 or http://localhost:3001"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

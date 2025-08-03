# Create user_profiles table in MySQL database
# Run SQL commands to create the user profiles table

Write-Host "🔧 Creating user_profiles table..." -ForegroundColor Green

try {
    # Try with common MySQL passwords
    $passwords = @("123456", "firehire123!", "", "root", "password")
    
    foreach ($password in $passwords) {
        Write-Host "Trying password: $password" -ForegroundColor Yellow
        
        if ($password -eq "") {
            $result = & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root firehire_ai < "create-user-profiles-table.sql" 2>$null
        } else {
            $result = Get-Content "create-user-profiles-table.sql" | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"$password" firehire_ai 2>$null
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully created user_profiles table!" -ForegroundColor Green
            
            # Verify the table was created
            Write-Host "📋 Verifying table structure..." -ForegroundColor Blue
            if ($password -eq "") {
                & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root firehire_ai -e "DESCRIBE user_profiles;"
            } else {
                & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"$password" firehire_ai -e "DESCRIBE user_profiles;"
            }
            
            # Show sample data
            Write-Host "📊 Showing sample data..." -ForegroundColor Blue
            if ($password -eq "") {
                & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root firehire_ai -e "SELECT up.ProfileID, u.FullName, u.Email, up.Title, up.Experience FROM user_profiles up JOIN Users u ON up.UserID = u.UserID LIMIT 3;"
            } else {
                & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"$password" firehire_ai -e "SELECT up.ProfileID, u.FullName, u.Email, up.Title, up.Experience FROM user_profiles up JOIN Users u ON up.UserID = u.UserID LIMIT 3;"
            }
            break
        }
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Could not connect to MySQL. Please check manually." -ForegroundColor Red
        Write-Host "You can run the SQL manually using MySQL Workbench or command line:" -ForegroundColor Yellow
        Write-Host "mysql -u root -p firehire_ai < create-user-profiles-table.sql" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🏁 User profiles table creation script completed." -ForegroundColor Blue

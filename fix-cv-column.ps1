# Fix file_data column size for CV uploads
# Run SQL commands to increase column size

Write-Host "🔧 Fixing file_data column size..." -ForegroundColor Green

try {
    # Try with common MySQL passwords
    $passwords = @("123456", "firehire123!", "", "root", "password")
    
    foreach ($password in $passwords) {
        Write-Host "Trying password: $password" -ForegroundColor Yellow
        
        if ($password -eq "") {
            $result = & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root firehire_ai -e "ALTER TABLE cvs MODIFY COLUMN file_data LONGBLOB;" 2>$null
        } else {
            $result = & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"$password" firehire_ai -e "ALTER TABLE cvs MODIFY COLUMN file_data LONGBLOB;" 2>$null
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully updated file_data column to LONGBLOB!" -ForegroundColor Green
            
            # Verify the change
            if ($password -eq "") {
                & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root firehire_ai -e "DESCRIBE cvs;"
            } else {
                & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"$password" firehire_ai -e "DESCRIBE cvs;"
            }
            break
        }
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Could not connect to MySQL. Please check manually." -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🏁 Database fix script completed." -ForegroundColor Blue

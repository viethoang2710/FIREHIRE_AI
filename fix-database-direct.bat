@echo off
echo ========================================
echo       FIX DATABASE PROFILE PICTURE
echo ========================================

echo.
echo Connecting to MySQL and running fix script...

rem Run the SQL script using MySQL command line
mysql -u root -p123456789 -e "USE firehire_ai; ALTER TABLE user_profiles MODIFY COLUMN ProfilePicture LONGBLOB; DESCRIBE user_profiles;" 2>mysql_fix_error.log

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ MySQL command failed. Error details:
    type mysql_fix_error.log
    echo.
    echo 💡 Trying alternative method using PowerShell...
    
    rem Alternative using PowerShell and connection string
    powershell -Command "try { $conn = New-Object System.Data.SqlClient.SqlConnection; $conn.ConnectionString = 'Server=localhost;Database=firehire_ai;Uid=root;Pwd=123456789;'; $conn.Open(); $cmd = $conn.CreateCommand(); $cmd.CommandText = 'ALTER TABLE user_profiles MODIFY COLUMN ProfilePicture LONGBLOB'; $cmd.ExecuteNonQuery(); Write-Host 'Database fixed successfully!'; $conn.Close(); } catch { Write-Host 'PowerShell method also failed: ' + $_.Exception.Message }"
) else (
    echo.
    echo ✅ Database fixed successfully!
    echo.
    echo Current table structure:
    mysql -u root -p123456789 -e "USE firehire_ai; DESCRIBE user_profiles;" 2>nul | findstr ProfilePicture
)

echo.
echo ========================================
echo              COMPLETED
echo ========================================
pause

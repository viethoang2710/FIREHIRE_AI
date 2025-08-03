# PowerShell script to check and update database schema for CV-Job linking
Write-Host "CV Database Update Script" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# Database connection parameters
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$database = "firehire_ai"
$username = "root"

Write-Host "Checking MySQL installation..." -ForegroundColor Yellow

if (Test-Path $mysqlPath) {
    Write-Host "✓ MySQL found at: $mysqlPath" -ForegroundColor Green
} else {
    Write-Host "✗ MySQL not found at expected path" -ForegroundColor Red
    Write-Host "Please update the path in this script or install MySQL" -ForegroundColor Yellow
    exit
}

Write-Host "`nWhat would you like to do?" -ForegroundColor Yellow
Write-Host "1. Check current CVs table structure"
Write-Host "2. Add JobID column to CVs table"
Write-Host "3. Check existing CVs data"
Write-Host "4. Show Users and Jobs for testing"
Write-Host "5. Exit"

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`nChecking CVs table structure..." -ForegroundColor Yellow
        $query = "DESCRIBE CVs;"
        & $mysqlPath -u $username -p $database -e $query
    }
    
    "2" {
        Write-Host "`nAdding JobID column to CVs table..." -ForegroundColor Yellow
        $queries = @(
            "ALTER TABLE CVs ADD COLUMN JobID INT NULL;",
            "ALTER TABLE CVs ADD FOREIGN KEY (JobID) REFERENCES job_postings(id);",
            "CREATE INDEX idx_cvs_job_id ON CVs(JobID);",
            "CREATE INDEX idx_cvs_user_job ON CVs(UserID, JobID);"
        )
        
        foreach ($query in $queries) {
            Write-Host "Executing: $query" -ForegroundColor Cyan
            & $mysqlPath -u $username -p $database -e $query
        }
        Write-Host "✓ Database schema updated!" -ForegroundColor Green
    }
    
    "3" {
        Write-Host "`nChecking existing CVs data..." -ForegroundColor Yellow
        $query = "SELECT CVID, UserID, JobID, Title, FileName, FileSize, CreatedAt FROM CVs ORDER BY CreatedAt DESC LIMIT 10;"
        & $mysqlPath -u $username -p $database -e $query
    }
    
    "4" {
        Write-Host "`nShowing Users (Candidates)..." -ForegroundColor Yellow
        $query = "SELECT UserID, FullName, Email, Role FROM Users WHERE Role = 'CANDIDATE' LIMIT 5;"
        & $mysqlPath -u $username -p $database -e $query
        
        Write-Host "`nShowing Jobs..." -ForegroundColor Yellow
        $query = "SELECT id, title, location, salary FROM job_postings WHERE status = 'ACTIVE' LIMIT 5;"
        & $mysqlPath -u $username -p $database -e $query
    }
    
    "5" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit
    }
    
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host "`nScript completed!" -ForegroundColor Green

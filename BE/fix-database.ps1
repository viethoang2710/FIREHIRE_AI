# Script để sửa lỗi cột CompanyLogo trong database
Write-Host "=== Sửa lỗi cột CompanyLogo ===" -ForegroundColor Green

# Tìm MySQL command line client
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe", 
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysql.exe",
    "mysql"
)

$mysqlCmd = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path -ErrorAction SilentlyContinue) {
        $mysqlCmd = $path
        break
    } elseif ($path -eq "mysql") {
        try {
            & mysql --version | Out-Null
            $mysqlCmd = $path
            break
        } catch {
            continue
        }
    }
}

if (-not $mysqlCmd) {
    Write-Host "Không tìm thấy MySQL command line client!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt MySQL hoặc cập nhật PATH environment variable" -ForegroundColor Yellow
    exit 1
}

Write-Host "Sử dụng MySQL client: $mysqlCmd" -ForegroundColor Yellow

# Thực thi SQL script
Write-Host "Đang thực thi script sửa cột CompanyLogo..." -ForegroundColor Yellow

$sqlFile = "fix_company_logo_column.sql"
$command = "& `"$mysqlCmd`" -u root -p -e `"source $sqlFile`""

Write-Host "Vui lòng nhập password MySQL để tiếp tục..." -ForegroundColor Cyan
Invoke-Expression $command

if ($LASTEXITCODE -eq 0) {
    Write-Host "Đã sửa thành công cột CompanyLogo!" -ForegroundColor Green
    Write-Host "Bây giờ bạn có thể thử tạo job posting với logo again" -ForegroundColor Green
} else {
    Write-Host "Có lỗi khi thực thi SQL script" -ForegroundColor Red
}

# PowerShell script to run Spring Boot application with automatic Java detection

Write-Host "Checking for Java installation..." -ForegroundColor Yellow

# Try to detect Java installation
$javaFound = $false
$javaDirectories = @(
    "$env:ProgramFiles\Java\jdk*",
    "$env:ProgramFiles\Java\jre*",
    "$env:ProgramW6432\Java\jdk*",
    "$env:ProgramW6432\Java\jre*",
    "${env:ProgramFiles(x86)}\Java\jdk*",
    "${env:ProgramFiles(x86)}\Java\jre*"
)

$autoJavaHome = $null
foreach ($pattern in $javaDirectories) {
    $dirs = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
    if ($dirs) {
        # Sort by name descending to get the newest Java version first
        $javaDir = $dirs | Sort-Object -Property Name -Descending | Select-Object -First 1 -ExpandProperty FullName
        if (Test-Path "$javaDir\bin\java.exe") {
            $autoJavaHome = $javaDir
            $javaFound = $true
            break
        }
    }
}

if ($javaFound) {
    Write-Host "Found Java installation at: $autoJavaHome" -ForegroundColor Green
    $env:JAVA_HOME = $autoJavaHome
    Write-Host "Temporarily setting JAVA_HOME to: $env:JAVA_HOME" -ForegroundColor Cyan
    
    # Update PATH to include JAVA_HOME\bin
    $env:Path = "$env:JAVA_HOME\bin;$env:Path"
    
    # Print java version to verify it's working
    Write-Host "`nVerifying Java installation:"
    try {
        java -version
        Write-Host "Java verification successful!" -ForegroundColor Green
    } catch {
        Write-Host "Error verifying Java. Please check your installation." -ForegroundColor Red
        exit 1
    }
    
    # Run Maven wrapper command
    Write-Host "`nStarting Spring Boot application..." -ForegroundColor Cyan
    Write-Host "Using command: .\mvnw.cmd spring-boot:run`n" -ForegroundColor White
    
    # Execute Maven
    .\mvnw.cmd spring-boot:run
} else {
    Write-Host "No Java installation found." -ForegroundColor Red
    Write-Host "Please install Java from: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    
    $installJava = Read-Host "Do you want to open the Java download page? (Y/N)"
    if ($installJava -eq "Y" -or $installJava -eq "y") {
        Start-Process "https://www.oracle.com/java/technologies/downloads/"
    }
    exit 1
}

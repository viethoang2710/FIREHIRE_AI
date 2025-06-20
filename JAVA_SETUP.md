# Hướng dẫn cài đặt và cấu hình Java

## Lỗi "JAVA_HOME not found"

Khi bạn gặp lỗi:
```
Error: JAVA_HOME not found in your environment.
Please set the JAVA_HOME variable in your environment to match the
location of your Java installation.
```

Điều này có nghĩa là môi trường của bạn chưa được cấu hình biến JAVA_HOME, cần thiết để chạy các ứng dụng Java như Spring Boot.

## Các bước cài đặt và cấu hình Java

### Bước 1: Kiểm tra xem Java đã được cài đặt chưa

```powershell
java -version
```

Nếu Java đã được cài đặt, bạn sẽ thấy thông tin phiên bản, ví dụ:
```
java version "11.0.12" 2021-07-20 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.12+8-LTS-237)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.12+8-LTS-237, mixed mode)
```

Nếu không thấy, bạn cần cài đặt Java.

### Bước 2: Cài đặt Java (nếu chưa có)

1. Tải Java từ trang chính thức: https://www.oracle.com/java/technologies/downloads/
   - Chọn Java 11 hoặc Java 17 LTS (Khuyến nghị)
   
2. Chạy file cài đặt và làm theo hướng dẫn

### Bước 3: Thiết lập biến môi trường JAVA_HOME

#### Cách 1: Thiết lập tạm thời trong PowerShell hiện tại

```powershell
# Thay đổi đường dẫn này theo vị trí cài đặt Java trên máy của bạn
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11.0.12"
```

#### Cách 2: Thiết lập vĩnh viễn cho Windows

1. Nhấn chuột phải vào **This PC** hoặc **My Computer**
2. Chọn **Properties**
3. Chọn **Advanced system settings**
4. Nhấn **Environment Variables**
5. Trong phần **System variables**, nhấn **New**
6. Nhập `JAVA_HOME` làm tên biến (Variable name)
7. Nhập đường dẫn đến thư mục cài đặt Java (ví dụ: `C:\Program Files\Java\jdk-11.0.12`) làm giá trị (Variable value)
8. Nhấn **OK** để lưu

#### Cách 3: Sử dụng PowerShell để thiết lập vĩnh viễn

```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-11.0.12", "Machine")
```

### Bước 4: Thêm Java vào PATH (nếu cần)

Thêm `%JAVA_HOME%\bin` vào biến PATH để có thể chạy các lệnh Java từ bất kỳ đâu:

```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";%JAVA_HOME%\bin", "Machine")
```

### Bước 5: Kiểm tra cài đặt

Mở PowerShell hoặc Command Prompt mới và chạy:

```powershell
echo %JAVA_HOME%
java -version
```

## Cách tìm đường dẫn Java đã cài đặt

Nếu bạn đã cài đặt Java nhưng không biết chính xác đường dẫn:

1. Tìm kiếm "java.exe" trong Windows Search
2. Nhấn chuột phải vào file java.exe và chọn "Open file location"
3. Đi lên một cấp thư mục từ thư mục "bin"
4. Sao chép đường dẫn này để sử dụng làm JAVA_HOME

## Script tự động tìm và thiết lập JAVA_HOME

Chạy script sau trong PowerShell để tự động tìm và thiết lập JAVA_HOME:

```powershell
# Tìm các đường dẫn Java có thể có
$javaPaths = @(
    "C:\Program Files\Java\jdk*",
    "C:\Program Files\Java\jre*",
    "C:\Program Files (x86)\Java\jdk*",
    "C:\Program Files (x86)\Java\jre*"
)

# Tìm thư mục Java mới nhất
$javaHome = $null
foreach ($path in $javaPaths) {
    $directories = Get-ChildItem -Path $path -ErrorAction SilentlyContinue
    if ($directories -and $directories.Length -gt 0) {
        $javaHome = $directories | Sort-Object -Property Name -Descending | Select-Object -First 1 -ExpandProperty FullName
        break
    }
}

if ($javaHome) {
    # Thiết lập biến môi trường cho phiên hiện tại
    $env:JAVA_HOME = $javaHome
    Write-Host "Đã thiết lập JAVA_HOME tạm thời thành: $javaHome"
    
    # Hỏi người dùng có muốn thiết lập vĩnh viễn không
    $response = Read-Host "Bạn có muốn thiết lập JAVA_HOME vĩnh viễn không? (Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "Machine")
        [Environment]::SetEnvironmentVariable("Path", $env:Path + ";%JAVA_HOME%\bin", "Machine")
        Write-Host "Đã thiết lập JAVA_HOME vĩnh viễn thành: $javaHome"
    }
} else {
    Write-Host "Không tìm thấy cài đặt Java. Vui lòng cài đặt Java trước."
}
```

## Chạy ứng dụng sau khi đã thiết lập JAVA_HOME

Sau khi thiết lập JAVA_HOME, bạn cần mở lại terminal hoặc PowerShell để các thay đổi có hiệu lực. Sau đó chạy lại lệnh:

```powershell
cd d:\Downloads\FIREHIRE_AI\BE
.\mvnw-fixed.cmd spring-boot:run
```

Nếu bạn không muốn khởi động lại terminal, bạn có thể thiết lập JAVA_HOME cho phiên hiện tại và chạy ứng dụng:

```powershell
# Thiết lập tạm thời cho phiên hiện tại (thay đổi đường dẫn phù hợp)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11.0.12"
cd d:\Downloads\FIREHIRE_AI\BE
.\mvnw-fixed.cmd spring-boot:run
```

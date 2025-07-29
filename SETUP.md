# Hướng dẫn Cài đặt và Cấu hình Môi trường Phát triển

## Cài đặt Công cụ Cần thiết

### 1. Cài đặt JDK (Java Development Kit)

1. Tải JDK 17 từ trang chính thức của Oracle hoặc OpenJDK:
   - Oracle JDK: https://www.oracle.com/java/technologies/downloads/
   - OpenJDK: https://adoptium.net/

2. Cài đặt JDK và thiết lập biến môi trường:
   - Đặt JAVA_HOME trỏ đến thư mục JDK
   - Thêm %JAVA_HOME%\bin vào PATH

### 2. Cài đặt Maven

1. Tải Maven từ trang chính thức: https://maven.apache.org/download.cgi

2. Giải nén tệp đã tải về vào một thư mục (ví dụ: C:\Program Files\Maven)

3. Thiết lập biến môi trường:
   - Tạo biến MAVEN_HOME trỏ đến thư mục Maven
   - Thêm %MAVEN_HOME%\bin vào PATH

### 3. Cài đặt Node.js và npm

1. Tải Node.js từ trang chính thức: https://nodejs.org/
   (Node.js đã bao gồm npm)

2. Cài đặt Node.js và npm theo hướng dẫn

## Kiểm tra Cài đặt

Sau khi cài đặt, mở PowerShell hoặc Command Prompt mới và kiểm tra:

```bash
# Kiểm tra Java
java -version

# Kiểm tra Maven
mvn -version

# Kiểm tra Node.js và npm
node -v
npm -v
```

## Khởi động Ứng dụng

### Backend (Spring Boot)

1. Di chuyển đến thư mục BE:
```
cd BE
```

2. Chạy ứng dụng với Maven:
```
mvn spring-boot:run
```

### Frontend (React)

1. Di chuyển đến thư mục FE:
```
cd FE
```

2. Cài đặt dependencies:
```
npm install
```

3. Khởi động ứng dụng:
```
npm start
```

## Trường hợp không thể cài đặt Maven

Nếu không thể cài đặt Maven, bạn có thể sử dụng Maven Wrapper đã được cung cấp:

1. Di chuyển đến thư mục BE:
```
cd BE
```

2. Sửa lỗi Maven Wrapper (nếu cần):
```
# Xóa mvnw.cmd hiện tại nếu không hoạt động
del mvnw.cmd

# Đổi tên mvnw-fixed.cmd thành mvnw.cmd
rename mvnw-fixed.cmd mvnw.cmd
```

3. Chạy ứng dụng với Maven Wrapper:
```
.\mvnw.cmd spring-boot:run
```

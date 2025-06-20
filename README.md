# FireHire AI - Ứng dụng tuyển dụng với AI

> **Lưu ý quan trọng**: Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ phát triển cần thiết. Xem hướng dẫn chi tiết trong [SETUP.md](SETUP.md).

Dự án này được chia thành hai phần: Backend (BE) và Frontend (FE).

## Cấu trúc dự án

```
FIREHIRE_AI/
│
├── BE/ - Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/ - Mã nguồn Java
│   │   │   └── resources/ - Cấu hình và tài nguyên
│   │   └── test/ - Unit tests
│   ├── Database.sql - SQL script thiết lập database
│   ├── pom.xml - Cấu hình Maven
│   ├── mvnw - Maven Wrapper (Unix/Linux)
│   └── mvnw.cmd - Maven Wrapper (Windows)
│
└── FE/ - Frontend (React)
    ├── public/ - Tài nguyên tĩnh
    ├── src/ - Mã nguồn React
    │   ├── components/ - Các component React
    │   ├── contexts/ - Context API
    │   ├── pages/ - Các trang
    │   ├── services/ - Các service giao tiếp với API
    │   └── ...
    ├── package.json - Cấu hình NPM
    └── ...
```

## Cài đặt và chạy dự án

### Khởi động nhanh (Tự động)

Để khởi động cả Frontend và Backend tự động:

```
# Sử dụng PowerShell
.\start-app.ps1

# HOẶC sử dụng Command Prompt
start-app.bat
```

Script này sẽ:
1. Kiểm tra và thiết lập Java nếu cần
2. Khởi động Backend (Spring Boot)
3. Khởi động Frontend (React)
4. Tự động mở trình duyệt với ứng dụng

Hoặc bạn có thể khởi động riêng Backend và Frontend như sau:

### Backend (BE)

1. Di chuyển vào thư mục BE:
```
cd BE
```

2. Chạy ứng dụng Spring Boot:
```
./mvnw spring-boot:run  # Trên Unix/Linux

# Trên Windows PowerShell hoặc Command Prompt, có hai tùy chọn:
.\mvnw-fixed.cmd spring-boot:run  # Sử dụng file script cố định
# HOẶC

# Nếu gặp lỗi "JAVA_HOME not found", hãy chạy script thiết lập Java:
..\setup-java.ps1  # Trong PowerShell
# HOẶC
..\setup-java.bat  # Trong Command Prompt
cd src\main\java\com\example\firehire_ai
javac FireHireAiApplication.java
java com.example.firehire_ai.FireHireAiApplication
```

Backend sẽ chạy tại http://localhost:8080

### Frontend (FE)

1. Di chuyển vào thư mục FE:
```
cd FE
```

2. Cài đặt dependencies:
```
npm install
```

3. Chạy ứng dụng React:
```
npm start
```

Frontend sẽ chạy tại http://localhost:3000

## Luồng xác thực

1. **Đăng ký tài khoản**:
   - Thông tin đăng ký sẽ được gửi từ FE tới BE
   - BE xử lý và lưu thông tin vào MySQL
   - Sau khi đăng ký thành công, người dùng sẽ được chuyển hướng đến trang đăng nhập

2. **Đăng nhập**:
   - Thông tin đăng nhập được gửi từ FE tới BE
   - BE xác thực và trả về JWT token
   - FE lưu token vào localStorage và hiển thị thông tin người dùng thay vì nút đăng nhập/đăng ký

3. **Đăng xuất**:
   - FE xóa token khỏi localStorage
   - Giao diện sẽ hiển thị lại các nút đăng nhập/đăng ký

## Lưu ý khi phát triển

- BE và FE được cấu hình để hoạt động cùng nhau thông qua proxy (tệp package.json cấu hình proxy tới localhost:8080)
- Đảm bảo MySQL đang chạy và có cơ sở dữ liệu phù hợp với cấu hình trong application.properties

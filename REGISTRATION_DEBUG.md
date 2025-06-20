# Hướng dẫn khắc phục lỗi đăng ký tài khoản

## Nguyên nhân có thể gây ra lỗi

1. **Kết nối Frontend-Backend**: Frontend không gửi request đúng đến backend hoặc backend không nhận/xử lý đúng request
2. **Kết nối Database**: Backend không kết nối được với MySQL
3. **Lỗi CORS**: Backend chưa cấu hình cho phép requests từ frontend
4. **Lỗi Validation**: Dữ liệu gửi từ frontend không đáp ứng yêu cầu của backend
5. **Lỗi Proxy**: Frontend không proxy đúng request tới backend URL

## Các bước kiểm tra và sửa lỗi

### 1. Kiểm tra kết nối cơ sở dữ liệu MySQL

- Đảm bảo MySQL server đang chạy:

```shell
# Kiểm tra MySQL đang chạy
# Windows (PowerShell)
Get-Service mysql*
# Hoặc kiểm tra port 3306 đang được sử dụng
netstat -ano | findstr :3306
```

- Đảm bảo database `firehire_ai` đã được tạo:

```sql
CREATE DATABASE IF NOT EXISTS firehire_ai;
```

- Kiểm tra thông tin đăng nhập MySQL trong `application.properties` là chính xác:

```
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/firehire_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=3108
```

### 2. Chạy backend với debug mode

Sửa file `application.properties` của backend để hiển thị log chi tiết hơn:

```
# Thêm các dòng sau vào application.properties
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate=DEBUG
logging.level.com.example.firehire_ai=DEBUG
```

### 3. Khởi động lại cả frontend và backend

- Khởi động backend:

```shell
cd d:\Downloads\FIREHIRE_AI\BE
# Nếu dùng Maven Wrapper trên Windows
.\mvnw.cmd spring-boot:run
# Hoặc dùng mvnw-fixed.cmd đã được cập nhật 
.\mvnw-fixed.cmd spring-boot:run
```

- Khởi động frontend (mở terminal mới):

```shell
cd d:\Downloads\FIREHIRE_AI\FE
npm install
npm start
```

### 4. Kiểm tra console của trình duyệt khi đăng ký

- Mở Developer Tools (F12)
- Chọn tab "Console"
- Chọn tab "Network"
- Thử đăng ký tài khoản và xem log

### 5. Kiểm tra CORS trong backend

Đảm bảo backend cho phép CORS từ frontend. Tìm hoặc tạo file cấu hình CORS:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 6. Sử dụng Postman để kiểm tra API trực tiếp

- Tải và cài đặt [Postman](https://www.postman.com/downloads/)
- Tạo request POST đến `http://localhost:8080/auth/register/candidate` với body JSON:

```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

- Kiểm tra response từ API

### 7. Kiểm tra bảng users trong database

```sql
USE firehire_ai;
SELECT * FROM users;
```

## Các sửa đổi đã được thực hiện để giúp debug

1. Đã thêm log chi tiết cho API requests/responses trong `api.js`
2. Đã thêm log chi tiết cho quá trình đăng ký trong `authService.js`
3. Đã thêm cấu hình proxy `http://localhost:8080` vào `package.json`

## Nếu vẫn gặp lỗi

- Kiểm tra các log từ backend và frontend để tìm nguyên nhân chính xác
- Kiểm tra JSON body được gửi từ frontend có đúng format mà backend yêu cầu không
- Kiểm tra version và tương thích của các thư viện trong package.json

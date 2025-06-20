# Hướng dẫn khắc phục lỗi đăng ký tài khoản

## Công cụ kiểm tra lỗi

Để giúp bạn xác định nguyên nhân của vấn đề đăng ký, tôi đã tạo các công cụ sau:

1. **Trang API Test:** Kiểm tra API trực tiếp
   - Truy cập: http://localhost:3000/api-test
   - Công cụ này gửi yêu cầu trực tiếp đến backend, bỏ qua React

2. **Trang Network Debug:** Kiểm tra kết nối mạng
   - Truy cập: http://localhost:3000/network-debug
   - Công cụ này kiểm tra kết nối giữa frontend và backend

3. **Script kiểm tra MySQL:**
   - Chạy file `check-mysql.ps1` trong thư mục gốc
   - Kiểm tra MySQL đang chạy và cấu hình database

## Các nguyên nhân thường gặp và cách khắc phục

### 1. MySQL không chạy hoặc không kết nối được

**Dấu hiệu:**
- Lỗi trong console backend: "Could not connect to database"
- Không thể truy cập API `/health/database`

**Cách khắc phục:**
```powershell
# Kiểm tra MySQL đang chạy
netstat -ano | findstr :3306

# Khởi động MySQL nếu chưa chạy
net start mysql80  # Tên dịch vụ có thể khác trên máy của bạn

# Kiểm tra cấu hình trong application.properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/firehire_ai?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=3108
```

### 2. Database chưa được tạo

**Dấu hiệu:**
- Lỗi khi khởi động backend: "Unknown database 'firehire_ai'"
- API đăng ký trả về lỗi 500

**Cách khắc phục:**
- Mở MySQL Workbench hoặc MySQL Command Line
- Chạy lệnh SQL:
```sql
CREATE DATABASE IF NOT EXISTS firehire_ai;
```

### 3. Lỗi CORS hoặc Proxy

**Dấu hiệu:**
- Lỗi trong browser console: "Access-Control-Allow-Origin"
- Không thể gửi request từ frontend đến backend

**Cách khắc phục:**
- Đảm bảo backend đã cấu hình CORS:
```java
// WebConfig.java đã được cài đặt
```

- Đảm bảo frontend có proxy trong package.json:
```json
"proxy": "http://localhost:8080",
```

- Khởi động lại cả frontend và backend

### 4. Dữ liệu đăng ký không hợp lệ

**Dấu hiệu:**
- API đăng ký trả về lỗi 400 (Bad Request)
- Log backend hiển thị validation errors

**Cách khắc phục:**
- Kiểm tra cấu trúc dữ liệu gửi lên có đúng yêu cầu không
- Tài khoản phải có email duy nhất (không trùng lặp)
- Mật khẩu phải đủ độ dài (thông thường ≥ 8 ký tự)

### 5. Lỗi xử lý trong backend

**Dấu hiệu:**
- API đăng ký trả về lỗi 500 (Internal Server Error)
- Log backend hiển thị stack trace

**Cách khắc phục:**
- Kiểm tra log backend để xác định nguyên nhân
- Đảm bảo các entity classes khớp với cấu trúc database
- Kiểm tra các ràng buộc trong database (foreign keys, unique constraints)

## Cách kiểm tra lỗi chi tiết

### 1. Kiểm tra log backend

```powershell
# Chạy backend với log chi tiết
cd d:\Downloads\FIREHIRE_AI\BE
.\run-spring.ps1

# Theo dõi log khi đăng ký
```

### 2. Kiểm tra API trực tiếp

- Truy cập: http://localhost:3000/api-test
- Nhấn "Chạy tất cả kiểm tra" để thử các API

### 3. Kiểm tra dữ liệu form gửi đi

Thêm đoạn code sau vào `RegistrationPage.js` trước khi gọi `register`:

```javascript
console.log('Data being sent:', userData);
```

## Sửa lỗi cụ thể

### Lỗi: Email đã tồn tại

Nếu nhận được thông báo "Email already in use":
- Thử đăng ký với email khác
- Hoặc xóa tài khoản cũ trong database:
```sql
DELETE FROM users WHERE email = 'email_da_dung@example.com';
```

### Lỗi: Không thể kết nối tới database

Kiểm tra:
- MySQL đang chạy
- Thông tin đăng nhập database chính xác
- Database firehire_ai đã được tạo

### Lỗi: Network Error

Kiểm tra:
- Backend đang chạy (http://localhost:8080/health)
- Proxy đã được cấu hình
- CORS đã được cấu hình

## Nếu vẫn gặp lỗi

Vui lòng cung cấp:
1. Screenshot của lỗi trong console trình duyệt
2. Log từ backend khi đăng ký
3. Kết quả từ trang API Test

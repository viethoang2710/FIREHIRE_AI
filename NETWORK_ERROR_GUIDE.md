# Hướng dẫn xử lý lỗi Network Error

## Lỗi "JAVA_HOME not found"

Nếu bạn gặp lỗi:
```
Error: JAVA_HOME not found in your environment.
Please set the JAVA_HOME variable in your environment to match the
location of your Java installation.
```

Đây là do biến môi trường JAVA_HOME không được thiết lập. Để khắc phục:

1. Chạy script tự động thiết lập Java:
   ```
   .\setup-java.ps1
   ```
   
2. Hoặc xem hướng dẫn chi tiết trong file `JAVA_SETUP.md`

## Trang debug mạng

Đã tạo trang debug mạng để giúp bạn phát hiện và khắc phục lỗi kết nối. 
Truy cập: http://localhost:3000/network-debug khi frontend đang chạy.

## Các lỗi thường gặp

### 1. Lỗi "Network Error" khi đăng ký/đăng nhập

Đây là lỗi phổ biến khi frontend không thể kết nối được với backend. Nguyên nhân có thể là:

- **Backend không chạy**: Đảm bảo backend đang chạy trên port 8080
- **Lỗi CORS**: Backend không chấp nhận request từ frontend
- **Lỗi Proxy**: Cấu hình proxy trong package.json không đúng

### 2. Lỗi "Cannot POST /auth/register/candidate"

Lỗi này xảy ra khi proxy không hoạt động đúng. Đảm bảo:

- Frontend đã được khởi động lại sau khi thêm cấu hình proxy
- Cấu hình proxy trong package.json là đúng: `"proxy": "http://localhost:8080"`

### 3. Lỗi với status code 400, 401, 500

- **400 Bad Request**: Dữ liệu gửi từ frontend không đúng định dạng yêu cầu của backend
- **401 Unauthorized**: Chưa đăng nhập hoặc token không hợp lệ
- **500 Internal Server Error**: Lỗi xử lý trong backend, kiểm tra log backend

## Các bước kiểm tra và sửa lỗi

### Bước 1: Kiểm tra backend có đang chạy không

```powershell
# Kiểm tra port 8080 có đang được sử dụng không
netstat -ano | findstr :8080

# Nếu không thấy, khởi động backend
cd d:\Downloads\FIREHIRE_AI\BE
.\mvnw-fixed.cmd spring-boot:run
```

### Bước 2: Kiểm tra kết nối cơ sở dữ liệu

```powershell
# Kiểm tra MySQL có đang chạy không
netstat -ano | findstr :3306

# Chạy script kiểm tra
cd d:\Downloads\FIREHIRE_AI
.\check_database.ps1
```

### Bước 3: Đảm bảo cấu hình proxy đúng

Kiểm tra file `package.json` trong thư mục frontend có dòng sau không:

```json
"proxy": "http://localhost:8080",
```

Nếu chưa có hoặc không đúng, sửa lại và khởi động lại frontend:

```powershell
cd d:\Downloads\FIREHIRE_AI\FE
npm start
```

### Bước 4: Kiểm tra lỗi trong console trình duyệt

1. Mở DevTools trong trình duyệt (F12 hoặc right-click > Inspect)
2. Chọn tab "Console" để xem lỗi JavaScript
3. Chọn tab "Network" để xem các request API
4. Thử đăng ký lại và xem chi tiết lỗi

### Bước 5: Sử dụng trang debug

1. Truy cập http://localhost:3000/network-debug
2. Nhấn "Bắt đầu kiểm tra" để chạy các test kết nối
3. Xem kết quả và làm theo gợi ý khắc phục

## Mã lỗi và giải thích chi tiết

| Mã lỗi | Mô tả | Giải pháp |
|--------|-------|-----------|
| Network Error | Frontend không kết nối được với backend | Kiểm tra backend có đang chạy và CORS |
| 400 | Dữ liệu không hợp lệ | Kiểm tra dữ liệu đăng ký khớp với yêu cầu backend |
| 401 | Không có quyền truy cập | Kiểm tra đăng nhập và token |
| 409 | Email đã tồn tại | Sử dụng email khác để đăng ký |
| 500 | Lỗi server | Kiểm tra log backend và kết nối database |

## Cải thiện đã thực hiện

1. Thêm log chi tiết trong api.js, authService.js
2. Thêm HealthController trong backend để kiểm tra kết nối
3. Thêm WebConfig để cấu hình CORS
4. Tạo trang debug mạng để kiểm tra kết nối
5. Thêm xử lý lỗi chi tiết trong RegistrationPage.js

Nếu sau khi đã thử các bước trên mà vẫn gặp lỗi, vui lòng kiểm tra log backend và frontend để tìm nguyên nhân cụ thể.

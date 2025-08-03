# 🏢 Chức năng Nhà tuyển dụng xem CV theo Job ID

## 📋 Tổng quan
Tính năng này cho phép nhà tuyển dụng xem tất cả các CV mà ứng viên đã nộp vào một công việc cụ thể thông qua Job ID.

## 🔧 Các thành phần đã tạo

### 1. Backend API Endpoints

#### Endpoint chính: `/api/applications/job/{jobId}`
- **Method**: GET
- **URL**: `http://localhost:8080/api/applications/job/{jobId}`
- **Mô tả**: Lấy tất cả CV ứng tuyển cho một Job ID
- **Response**: 
```json
{
  "success": true,
  "message": "Applications retrieved successfully", 
  "data": [
    {
      "applicationId": 1,
      "cvId": 1,
      "cvTitle": "CV for Kỹ sư dữ liệu",
      "jobId": 1,
      "jobTitle": "Junior Data Engineer",
      "companyName": "Tech Solutions",
      "appliedAt": "2025-08-02T04:18:10",
      "status": "PENDING",
      "candidateName": "Nguyễn Như Phúc",
      "candidateEmail": "phuc.nguyen@example.com",
      "candidatePhone": "0123456789"
    }
  ]
}
```

#### Endpoint phụ: `/api/employers/job/{jobId}/applications`
- **Method**: GET
- **URL**: `http://localhost:8080/api/employers/job/{jobId}/applications`
- **Mô tả**: Endpoint tương tự nhưng trong EmployerController
- **File**: `EmployerController.java`

### 2. Frontend Components

#### JobManagementPage.js
- **Path**: `/job-management`
- **Mô tả**: Trang quản lý danh sách công việc của nhà tuyển dụng
- **Tính năng**:
  - Hiển thị danh sách tất cả công việc
  - Thống kê số ứng viên, lượt xem
  - Tìm kiếm và lọc công việc
  - Nút "Xem CV" để chuyển đến trang chi tiết

#### EmployerCVListPage.js  
- **Path**: `/employer-cv-list/{jobId}`
- **Mô tả**: Trang xem chi tiết CV ứng tuyển cho một công việc
- **Tính năng**:
  - Hiển thị thông tin công việc
  - Danh sách CV ứng tuyển
  - Xem chi tiết CV
  - Tải CV
  - Cập nhật trạng thái ứng tuyển
  - Thống kê ứng viên

#### EmployerDashboardPage.js
- **Path**: `/recruiter-dashboard` 
- **Mô tả**: Trang dashboard chính cho nhà tuyển dụng
- **Tính năng**: Hiện tại redirect đến JobManagementPage

### 3. Demo & Testing

#### employer-cv-demo.html
- **Mô tả**: Trang demo HTML để test chức năng
- **Tính năng**:
  - Test backend APIs
  - Demo danh sách công việc
  - Mock data cho ứng viên
  - Xem CV theo Job ID

#### test-employer-cv.ps1
- **Mô tả**: PowerShell script để test các API endpoints
- **Tính năng**:
  - Kiểm tra backend status
  - Test API endpoints
  - Kiểm tra database
  - Tóm tắt kết quả

## 🚀 Cách sử dụng

### 1. Khởi động Backend
```bash
cd "C:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI"
quick-start-backend.bat
```

### 2. Khởi động Frontend  
```bash
cd FE
npm start
```

### 3. Truy cập chức năng
- **Job Management**: http://localhost:3000/job-management
- **Demo HTML**: Mở file `employer-cv-demo.html` 

### 4. Test APIs
```powershell
# Chạy PowerShell script
.\test-employer-cv.ps1

# Hoặc test manual
curl http://localhost:8080/api/applications/job/1
```

## 📊 Database Schema

### Bảng `applications`
```sql
- application_id (Primary Key)
- cv_id (Foreign Key -> CVs)
- job_id (Foreign Key -> job_postings) 
- applied_at (DateTime)
- status (ENUM: PENDING, REVIEWED, ACCEPTED, REJECTED)
```

### Bảng `CVs`
```sql
- cv_id (Primary Key)
- user_id (Foreign Key -> users)
- title (VARCHAR)
- file_name (VARCHAR)
- file_size (BIGINT)
- created_at (DateTime)
```

## 🔗 API Flow

1. **Nhà tuyển dụng** truy cập Job Management
2. **Chọn công việc** cần xem CV ứng tuyển
3. **Frontend** gọi API `GET /api/applications/job/{jobId}`
4. **Backend** query database và trả về danh sách applications
5. **Frontend** hiển thị danh sách CV với thông tin ứng viên
6. **Nhà tuyển dụng** có thể xem, tải CV và cập nhật trạng thái

## 🎯 Tính năng hiện có

✅ **Đã hoàn thành**:
- Lấy danh sách CV theo Job ID
- Hiển thị thông tin ứng viên chi tiết
- Cập nhật trạng thái ứng tuyển
- Giao diện quản lý công việc
- Test & demo tools

🔄 **Có thể mở rộng**:
- Tải CV file thực tế
- Xem trước CV trong modal
- Gửi email cho ứng viên  
- Lọc ứng viên theo tiêu chí
- Export danh sách ứng viên
- Tích hợp calendar để đặt lịch phỏng vấn

## 🐛 Troubleshooting

### Backend không hoạt động
```bash
# Kiểm tra Java
java -version

# Kiểm tra port 8080
netstat -an | findstr 8080

# Khởi động lại
quick-start-backend.bat
```

### Frontend lỗi
```bash
# Kiểm tra dependencies
cd FE
npm install

# Khởi động lại
npm start
```

### Database issues
```sql
-- Kiểm tra dữ liệu
SELECT * FROM applications;
SELECT * FROM CVs;
SELECT * FROM job_postings;
```

## 📝 Notes

- Endpoint `/api/applications/job/{jobId}` đã có sẵn trong `ApplicationController`
- Code được tổ chức theo pattern MVC với Service layer
- Frontend sử dụng React với functional components và hooks
- Mock data được cung cấp để test khi chưa có dữ liệu thực
- Responsive design với Tailwind CSS
- Có bảo mật với ProtectedRoute cho role EMPLOYER

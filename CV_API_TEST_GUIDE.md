# 🚀 Hướng dẫn Test CV API

## Bước 1: Khởi động Backend Server

### Cách 1: Sử dụng Maven Wrapper (Recommended)
```powershell
cd BE
.\mvnw spring-boot:run
```

### Cách 2: Sử dụng Script có sẵn
```powershell
.\start-backend.ps1
```

### Cách 3: Sử dụng Run Script trong BE
```powershell
cd BE
.\run-spring.ps1
```

## Bước 2: Kiểm tra Server Status

1. **Mở file test-cv-api.html** trong browser:
   - File: `c:\Users\NGUYENNHUPHUC\OneDrive\Documents\FIREHIRE_AI\test-cv-api.html`
   - Hoặc double-click vào file

2. **Test Server Status**:
   - Click button "🌐 Test Server Status"
   - Nếu thành công sẽ thấy response từ health endpoint

## Bước 3: Test CV API

1. **Nhập User ID**: Thử với ID 19 (default)
2. **Click "📋 Test Get User CVs"**
3. **Xem kết quả**:
   - ✅ Success: API trả về danh sách CV
   - ❌ Error: Kiểm tra lỗi trong console

## Bước 4: Test Frontend

1. **Khởi động Frontend**:
```powershell
cd FE
npm start
```

2. **Mở ProfilePage**: `http://localhost:3000/profile`

3. **Kiểm tra Browser Console**: F12 → Console tab

## 🔍 Debug Information

### CVDTO Fields (đã được cập nhật):
- ✅ `cvId`: ID của CV
- ✅ `title`: Tiêu đề CV  
- ✅ `fileName`: Tên file CV
- ✅ `fileSize`: Kích thước file
- ✅ `coverLetter`: Thư xin việc
- ✅ `job`: Thông tin công việc (JobPostingDTO)
- ✅ `createdAt`: Ngày tạo
- ✅ `updatedAt`: Ngày cập nhật

### ProfilePage.js Changes:
- ✅ Enhanced debug logging với emoji
- ✅ Improved error handling
- ✅ Better data processing với detailed logs
- ✅ Network error detection

## 🔧 Troubleshooting

### 1. Server không khởi động được
- Kiểm tra Java installed: `java -version`
- Kiểm tra port 8080 available: `netstat -an | findstr 8080`
- Xem log lỗi trong terminal

### 2. API trả về empty data
- Kiểm tra database có data CV không
- Xem server logs cho SQL queries
- Test trực tiếp database với MySQL

### 3. Frontend không hiển thị
- Kiểm tra browser console errors
- Verify API response structure
- Check CORS settings

### 4. Database Issues
```sql
-- Check CVs table
SELECT COUNT(*) FROM CVs;

-- Check specific user CVs  
SELECT * FROM CVs WHERE UserID = 19;

-- Check table structure
DESCRIBE CVs;
```

## 📋 Expected API Response Format

```json
{
  "success": true,
  "message": "CVs retrieved successfully",
  "data": [
    {
      "cvId": 1,
      "userId": 19,
      "title": "Frontend Developer",
      "fileName": "CV_Frontend_Dev.pdf",
      "fileSize": 1024000,
      "fileType": "application/pdf",
      "coverLetter": "Dear Hiring Manager...",
      "createdAt": "2025-08-01T10:00:00",
      "updatedAt": "2025-08-01T10:00:00",
      "job": {
        "id": 1,
        "title": "Frontend Developer",
        "companyName": "Tech Company",
        "location": "Ho Chi Minh City",
        "salary": "15-25 triệu VNĐ"
      },
      "sections": [],
      "skillTags": ["React", "JavaScript"]
    }
  ]
}
```

## 🎯 Next Steps

1. **Khởi động server** theo hướng dẫn trên
2. **Test API** với tool test-cv-api.html
3. **Kiểm tra ProfilePage** trong browser
4. **Report kết quả** về tình trạng hiển thị CV data

---
📝 **Note**: CVDTO đã được cập nhật để include tất cả các fields cần thiết (fileName, fileSize, coverLetter, job). ProfilePage.js đã được enhance với detailed logging để debug dễ dàng hơn.

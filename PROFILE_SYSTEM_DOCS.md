# 🔥 FIREHIRE AI - Profile Management System

Hệ thống quản lý profile và ảnh đại diện đã được tích hợp thành công!

## 🚀 Tính năng mới

### ✅ Frontend (React)
- **ProfilePage.js**: Hiển thị và chỉnh sửa profile
- **ProfileEditModal.js**: Modal chỉnh sửa với form validation
- **Image Upload**: Upload ảnh đại diện với preview
- **API Integration**: Kết nối với backend thật

### ✅ Backend (Spring Boot)
- **UserProfile Entity**: Model đầy đủ với enums
- **UserProfileRepository**: Query methods cho database
- **UserProfileService**: Business logic và file handling
- **UserProfileController**: REST API endpoints

### ✅ Database
- **user_profiles table**: Schema đầy đủ
- **Image storage**: LONGBLOB cho ảnh đại diện
- **Foreign key**: Liên kết với Users table

## 🛠️ Cách sử dụng

### 1. Khởi động Backend
```bash
# Chạy file này để start backend
start-backend-profile.bat
```

### 2. Khởi động Frontend  
```bash
# Chạy file này để start frontend
start-frontend-profile.bat
```

### 3. Test Profile System
1. Mở browser: `http://localhost:3000`
2. Navigate đến ProfilePage
3. Click "✏️ Chỉnh sửa" để mở modal
4. Cập nhật thông tin và upload ảnh
5. Save và xem kết quả

## 📋 API Endpoints

### Profile CRUD
- `GET /api/profile/{userId}` - Lấy profile
- `GET /api/profile/{userId}/full` - Lấy profile + user info
- `POST /api/profile/{userId}` - Cập nhật profile
- `POST /api/profile/{userId}/with-image` - Cập nhật + ảnh

### Image Management  
- `POST /api/profile/{userId}/image` - Upload ảnh riêng
- `GET /api/profile/{userId}/image` - Lấy ảnh đại diện
- `DELETE /api/profile/{userId}/image` - Xóa ảnh

## 🔧 Configuration

### Backend Requirements
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Spring Boot 3.x

### Frontend Requirements  
- Node.js 16+
- React 18+
- Tailwind CSS

## 📝 Database Schema

```sql
CREATE TABLE user_profiles (
    ProfileID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    Title VARCHAR(200),
    Bio TEXT,
    Skills TEXT,
    Experience VARCHAR(500),
    Phone VARCHAR(20),
    Address VARCHAR(500),
    LinkedIn VARCHAR(255),
    GitHub VARCHAR(255),
    Website VARCHAR(255),
    ProfilePicture LONGBLOB,
    PictureFileName VARCHAR(255),
    PictureFileSize BIGINT,
    WorkPreference ENUM('FULL_TIME','PART_TIME','CONTRACT','FREELANCE','INTERNSHIP'),
    SalaryExpectation VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
```

## 🎯 Validation Rules

### Image Upload
- **Max size**: 5MB
- **Formats**: JPG, PNG, GIF, WebP
- **Storage**: LONGBLOB in database

### Profile Fields
- **Title**: Max 200 characters
- **Bio**: Unlimited text
- **Phone**: Max 20 characters  
- **Address**: Max 500 characters
- **URLs**: Validated format

## 🐛 Troubleshooting

### Common Issues
1. **CORS Error**: Backend CORS đã config cho localhost:3000
2. **File Too Large**: Check 5MB limit
3. **DB Connection**: Verify MySQL running
4. **Port Conflicts**: Backend:8080, Frontend:3000

### Debug Steps
1. Check console logs (F12)
2. Verify API responses in Network tab
3. Check backend logs for errors
4. Validate database connection

## 🔄 Next Steps

1. **Authentication**: Integrate với JWT system
2. **File Storage**: Move to cloud storage (AWS S3)
3. **Image Optimization**: Resize và compress
4. **Profile Validation**: Add more field validation
5. **Real-time Updates**: WebSocket cho live updates

---

**Tất cả components đã được tạo và tích hợp thành công!** 🎉

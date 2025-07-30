# 🔥 FireHire AI - Luồng Dữ Liệu Job Posting

## 📋 Tổng Quan
Tài liệu này mô tả luồng dữ liệu hoàn chỉnh từ việc nhà tuyển dụng đăng tin tuyển dụng cho đến khi ứng viên thấy được thông tin job trên trang HomePage.

## 🚀 Luồng Dữ Liệu Chi Tiết

### 1. Nhà Tuyển Dụng Đăng Tin (Frontend)
**File:** `RecruiterDashboardPage.js`
**Component:** `PostJobModal`

#### Quy Trình:
1. Nhà tuyển dụng đăng nhập và truy cập dashboard
2. Click "Đăng tin mới" → Mở PostJobModal
3. Điền form với thông tin:
   - Tên việc làm
   - Địa điểm làm việc  
   - Mức lương
   - Loại hình công việc
   - Mô tả công việc
   - Yêu cầu ứng viên
   - Quyền lợi

#### Data Flow:
```javascript
// Trong handleSubmit của PostJobModal
const jobDataToSend = {
  title: formData.jobTitle,
  location: formData.location,
  salary: formData.salary,
  description: formData.description,
  requirements: formData.requirements,
  benefits: formData.benefits,
  type: formData.type,
  status: "Đang hiển thị",
  employerId: employerId // từ localStorage
};

// Gọi recruiterService.createJob()
const responseData = await recruiterService.createJob(jobDataToSend);
```

### 2. Service Layer - recruiterService.js
**File:** `services/recruiterService.js`
**Function:** `createJob()`

#### Chuyển Đổi Dữ Liệu:
Frontend format → Backend API format
```javascript
const apiJobData = {
  employerId: jobDataToSubmit.employerId,
  title: jobDataToSubmit.title,
  description: jobDataToSubmit.description,
  location: jobDataToSubmit.location,
  salary: jobDataToSubmit.salary,
  jobType: jobDataToSubmit.type || "Full-time",
  industry: jobDataToSubmit.industry || "Công nghệ thông tin",
  experienceLevel: jobDataToSubmit.experienceLevel || "Không yêu cầu kinh nghiệm",
  skillsRequired: jobDataToSubmit.requirements || "",
  benefits: jobDataToSubmit.benefits || "",
  status: "ACTIVE" // Backend sử dụng ACTIVE thay vì "Đang hiển thị"
};
```

#### API Call:
```javascript
// POST request đến backend
const response = await axios.post(`${API_URL}/jobs`, apiJobData, getAuthHeader());
```

### 3. Backend API - RecruiterController.java
**File:** `controller/RecruiterController.java`
**Endpoint:** `POST /api/recruiter/jobs`

#### Controller Layer:
```java
@PostMapping("/jobs")
public ResponseEntity<ApiResponse<JobPostingDTO>> createJobPosting(
        @RequestBody JobPostingRequest request) {
    return ResponseEntity.ok(jobPostingService.createJobPosting(request));
}
```

### 4. Service Layer - JobPostingService.java
**File:** `service/JobPostingService.java`
**Method:** `createJobPosting()`

#### Business Logic:
1. Validate dữ liệu đầu vào
2. Tạo JobPosting entity
3. Set các thuộc tính mặc định (createdDate, status, etc.)
4. Lưu vào database thông qua Repository
5. Chuyển đổi Entity → DTO
6. Trả về ApiResponse

### 5. Database Layer
**Entity:** `JobPosting.java`
**Table:** `job_postings`

#### Database Schema:
```sql
CREATE TABLE job_postings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employer_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  salary VARCHAR(255),
  job_type VARCHAR(100),
  industry VARCHAR(255),
  experience_level VARCHAR(255),
  skills_required TEXT,
  benefits TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES employers(id)
);
```

### 6. Hiển Thị Cho Ứng Viên - HomePage.js
**File:** `pages/HomePage.js`
**Component:** `FeaturedJobs`

#### Data Fetching:
```javascript
// Trong FeaturedJobs.js useEffect
const response = await jobService.getHotLatestJobs();
```

### 7. Job Service - jobService.js
**File:** `services/jobService.js`
**Function:** `getHotLatestJobs()`

#### API Calls:
```javascript
// Gọi song song 2 endpoints
const [hotRes, latestRes] = await Promise.all([
  api.get('/jobs/hot-jobs', { params: { limit: 6 } }),
  api.get('/jobs/latest-jobs', { params: { limit: 6 } })
]);

// Xử lý dữ liệu trả về
let hotJobs = hotRes.data.success ? hotRes.data.data : [];
let latestJobs = latestRes.data.success ? latestRes.data.data : [];

// Gộp và loại trùng
const allJobs = [...hotJobs, ...latestJobs].filter((job, idx, arr) => 
  arr.findIndex(j => j.id === job.id) === idx
);
```

### 8. Backend Public API - JobPostingController.java
**File:** `controller/JobPostingController.java`
**Endpoints:** 
- `GET /api/jobs/hot-jobs`
- `GET /api/jobs/latest-jobs`

#### Hot Jobs Logic:
```java
@GetMapping("/hot-jobs")
public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getHotJobs(
        @RequestParam(defaultValue = "10") int limit) {
    return ResponseEntity.ok(jobPostingService.getHotJobs(limit));
}
```

#### Latest Jobs Logic:
```java
@GetMapping("/latest-jobs")
public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getLatestJobs(
        @RequestParam(defaultValue = "10") int limit) {
    return ResponseEntity.ok(jobPostingService.getLatestJobs(limit));
}
```

### 9. JobPostingService - Business Logic
**File:** `service/JobPostingService.java`

#### Hot Jobs Query:
```java
// Lấy jobs có nhiều lượt apply nhất
public ApiResponse<List<JobPostingDTO>> getHotJobs(int limit) {
    List<JobPosting> hotJobs = jobPostingRepository
        .findActiveJobsOrderByApplicationCount(PageRequest.of(0, limit));
    // Convert to DTO và trả về
}
```

#### Latest Jobs Query:
```java
// Lấy jobs mới nhất theo createdDate
public ApiResponse<List<JobPostingDTO>> getLatestJobs(int limit) {
    List<JobPosting> latestJobs = jobPostingRepository
        .findActiveJobsOrderByCreatedDate(PageRequest.of(0, limit));
    // Convert to DTO và trả về
}
```

### 10. Frontend Display - FeaturedJobs.js
**Component:** `FeaturedJobs`

#### Render Logic:
```javascript
{jobs.map(job => (
  <div key={job.id} className="job-card">
    <h3>{job.title}</h3>
    <p>{job.company || 'Tech Solutions Inc.'}</p>
    <div>
      <MapPin size={16} /> {job.location}
      <span>{job.salary}</span>
    </div>
    <div className="tags">
      {job.jobType && <span>{job.jobType}</span>}
      {job.industry && <span>{job.industry}</span>}
      {job.experienceLevel && <span>{job.experienceLevel}</span>}
    </div>
    <p>Đăng {job.createdDate}</p>
    <button onClick={() => handleApplyClick(job.id)}>
      Nộp CV
    </button>
  </div>
))}
```

## 🔧 Cấu Hình Cần Thiết

### Frontend Configuration
**File:** `services/api.js`
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Backend Configuration
**File:** `application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/firehire_ai
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### CORS Configuration
**File:** `controller/*.java`
```java
@CrossOrigin(origins = "http://localhost:3000")
```

## 🧪 Testing

### Test File
**File:** `test-job-flow.html`

#### Test Cases:
1. ✅ Backend Connection Test
2. ✅ Create Job API Test  
3. ✅ Get Jobs API Test
4. ✅ Frontend Display Test

### Manual Testing Steps:
1. Khởi động Backend: `java -jar target/firehire_ai-0.0.1-SNAPSHOT.jar`
2. Khởi động Frontend: `npm start`
3. Mở test file: `test-job-flow.html`
4. Test tạo job từ RecruiterDashboard
5. Verify job hiển thị ở HomePage

## 🐛 Troubleshooting

### Common Issues:

#### 1. Backend Connection Failed
- ✅ Check backend đang chạy ở port 8080
- ✅ Check database connection
- ✅ Check CORS configuration

#### 2. Job Creation Failed
- ✅ Check employerId có tồn tại
- ✅ Check required fields không null
- ✅ Check authentication headers

#### 3. Jobs Not Displaying
- ✅ Check API endpoints trả về đúng format
- ✅ Check frontend jobService.js mapping
- ✅ Check console errors

#### 4. Database Issues
- ✅ Check MySQL service running
- ✅ Check database schema exists
- ✅ Check foreign key constraints

## 📊 Data Flow Diagram

```
[Recruiter Dashboard] 
       ↓ (POST /api/recruiter/jobs)
[RecruiterController] 
       ↓ (createJobPosting())
[JobPostingService] 
       ↓ (save())
[JobPostingRepository] 
       ↓ (INSERT)
[MySQL Database] 
       ↑ (SELECT)
[JobPostingRepository] 
       ↑ (getHotJobs/getLatestJobs)
[JobPostingService] 
       ↑ (GET /api/jobs/hot-jobs, /api/jobs/latest-jobs)
[JobPostingController] 
       ↑ (jobService.getHotLatestJobs())
[FeaturedJobs Component] 
       ↑ (render)
[HomePage] 
       ↑ (display)
[Candidate View]
```

## ✅ Validation Checklist

- [ ] Backend khởi động thành công
- [ ] Database connection hoạt động
- [ ] Recruiter có thể đăng tin
- [ ] Tin được lưu vào database
- [ ] API endpoints trả về data
- [ ] Frontend load được jobs
- [ ] Jobs hiển thị đúng format
- [ ] Real-time sync hoạt động

## 🎯 Next Steps

1. **Authentication Integration**: Tích hợp JWT cho security
2. **File Upload**: Thêm chức năng upload logo công ty
3. **Search & Filter**: Tìm kiếm và lọc jobs
4. **Job Application**: Hoàn thiện chức năng nộp CV
5. **Admin Management**: Quản lý jobs từ admin panel
6. **Notification**: Thông báo real-time cho các sự kiện
7. **Performance**: Caching và pagination
8. **Testing**: Unit tests và integration tests

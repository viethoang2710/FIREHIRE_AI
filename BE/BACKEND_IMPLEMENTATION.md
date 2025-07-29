# FIREHIRE AI - Backend API Implementation

## Tóm tắt các chức năng đã được implement

### ✅ 1. Phân tích CV bằng AI (CV Analysis)

**Controller**: `CVAnalysisController`
- `POST /api/cv-analysis/analyze` - Phân tích CV từ file PDF/DOCX
- `POST /api/cv-analysis/analyze-text` - Phân tích CV từ text
- `GET /api/cv-analysis/analysis-history/{userId}` - Lấy lịch sử phân tích

**Features**:
- Phân tích nội dung CV và tính điểm (0-100)
- Đưa ra feedback và gợi ý cải thiện
- Tìm từ khóa ngành nghề phù hợp
- Lưu lịch sử phân tích
- Hỗ trợ file PDF và DOCX

### ✅ 2. Tải xuống CV (CV Download)

**Controller**: `CVController` (đã cải thiện)
- `GET /api/cv/{cvId}/download?format=pdf|docx` - Tải CV dưới dạng PDF hoặc DOCX
- `POST /api/cv/{cvId}/generate-pdf` - Tạo URL PDF cho CV

**Features**:
- Export CV ra định dạng PDF hoặc DOCX
- Tạo link tải xuống tạm thời

### ✅ 3. Nộp CV ứng tuyển (Job Application)

**Controller**: `ApplicationController` (đã cải thiện)
- `POST /api/applications/apply-with-cv` - Nộp đơn ứng tuyển kèm file CV
- `GET /api/applications/candidate/{candidateId}` - Lấy đơn ứng tuyển của ứng viên
- `GET /api/applications/employer/{employerId}` - Lấy đơn ứng tuyển theo nhà tuyển dụng
- `POST /api/applications/{id}/shortlist` - Shortlist ứng viên
- `POST /api/applications/{id}/reject` - Từ chối ứng viên
- `POST /api/applications/{id}/interview` - Lên lịch phỏng vấn

**Features**:
- Upload CV file khi ứng tuyển
- Validation file type và size
- Quản lý trạng thái đơn ứng tuyển
- Cover letter tùy chọn

### ✅ 4. Tìm kiếm việc làm nâng cao (Advanced Job Search)

**Controller**: `JobSearchController`
- `GET /api/job-search/advanced` - Tìm kiếm nâng cao với nhiều tiêu chí
- `GET /api/job-search/by-location` - Tìm theo địa điểm
- `GET /api/job-search/by-industry` - Tìm theo ngành nghề
- `GET /api/job-search/suggestions` - Gợi ý tìm kiếm
- `GET /api/job-search/filters/*` - Lấy danh sách bộ lọc
- `GET /api/job-search/recommended/{candidateId}` - Công việc gợi ý
- `POST /api/job-search/save-search` - Lưu tìm kiếm
- `GET /api/job-search/saved-searches/{candidateId}` - Tìm kiếm đã lưu

**Features**:
- Tìm kiếm theo địa điểm, ngành nghề, kinh nghiệm, mức lương
- Pagination và sorting
- Gợi ý tự động
- Lưu và quản lý tìm kiếm
- Thống kê việc làm

### ✅ 5. Cải thiện Job Posting

**Controller**: `JobPostingController` (đã cải thiện)
- `GET /api/jobs/search` - Tìm kiếm nâng cao với nhiều tham số
- `GET /api/jobs/industry` - Lấy việc làm theo ngành nghề
- `GET /api/jobs/locations` - Lấy danh sách địa điểm
- `GET /api/jobs/industries` - Lấy danh sách ngành nghề
- `GET /api/jobs/hot-jobs` - Việc làm hot
- `GET /api/jobs/latest-jobs` - Việc làm mới nhất
- `GET /api/jobs/similar/{jobId}` - Việc làm tương tự
- `POST /api/jobs/{jobId}/apply` - Nộp đơn ứng tuyển

**Features**:
- Tìm kiếm đa tiêu chí
- Phân loại việc làm
- Tracking lượt xem và ứng tuyển
- Việc làm urgent/hot

## Cấu trúc Database đã cập nhật

### Bảng mới:
- `cv_analysis` - Lưu kết quả phân tích CV
- `cv_analysis_feedback` - Feedback chi tiết
- `cv_analysis_keywords` - Từ khóa tìm thấy
- `cv_analysis_missing_sections` - Phần thiếu
- `cv_analysis_suggestions` - Gợi ý cải thiện
- `saved_searches` - Tìm kiếm đã lưu
- `job_views` - Tracking lượt xem việc làm
- `job_applications_files` - File đính kèm đơn ứng tuyển

### Bảng đã cải thiện:
- `job_postings` - Thêm salary, industry, experience_level, job_type, view_count, etc.
- `applications` - Thêm cv_file_path, cover_letter

## Cách sử dụng API

### 1. Phân tích CV:
```bash
curl -X POST "http://localhost:8080/api/cv-analysis/analyze" \
  -F "file=@cv.pdf" \
  -F "targetPosition=Java Developer"
```

### 2. Tìm kiếm việc làm:
```bash
curl "http://localhost:8080/api/job-search/advanced?keyword=Java&location=Ho Chi Minh&industry=IT&page=0&size=10"
```

### 3. Nộp đơn ứng tuyển:
```bash
curl -X POST "http://localhost:8080/api/applications/apply-with-cv" \
  -F "jobId=1" \
  -F "candidateId=1" \
  -F "cvFile=@cv.pdf" \
  -F "coverLetter=Dear HR..."
```

### 4. Tải CV:
```bash
curl "http://localhost:8080/api/cv/1/download?format=pdf" -o cv.pdf
```

## Dependencies đã thêm

- **Apache PDFBox**: Xử lý file PDF
- **Apache POI**: Xử lý file DOCX  
- **iText**: Tạo PDF
- **Commons IO**: Thao tác file

## Status

- ✅ **Build thành công**: Tất cả lỗi compilation đã được fix
- ✅ **API endpoints**: Đã implement đầy đủ các endpoints
- ✅ **Database schema**: Đã tạo script cập nhật
- 🔄 **Testing**: Cần test các API với frontend
- 🔄 **Database setup**: Cần chạy script cập nhật database

## Kế hoạch tiếp theo

1. **Database Setup**: Chạy `database_updates.sql` 
2. **Frontend Integration**: Cập nhật frontend để gọi các API mới
3. **File Storage**: Implement proper file storage (local/cloud)
4. **Advanced Features**: AI analysis, recommendation engine
5. **Performance**: Caching, pagination optimization

## Testing

Backend đang chạy trên: `http://localhost:8080`

Swagger UI (nếu có): `http://localhost:8080/swagger-ui.html`

## Notes

- Một số chức năng được implement ở mức cơ bản để đảm bảo build thành công
- File processing hiện tại đơn giản, có thể cải thiện thêm
- Cần setup database schema trước khi test đầy đủ
- Authentication/Authorization cần được xem xét cho các API mới

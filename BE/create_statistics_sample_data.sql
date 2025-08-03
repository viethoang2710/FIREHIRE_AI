-- Script to create sample data for statistics testing

USE firehire_ai;

-- Create sample users if they don't exist
INSERT IGNORE INTO users (UserID, FullName, Email, PasswordHash, PhoneNumber, Role, CreatedAt, LastLogin) VALUES
(1001, 'Admin System', 'admin@firehire.com', 'hashed_password', '0901000001', 'ADMIN', DATE_SUB(NOW(), INTERVAL 90 DAY), NOW()),
(1002, 'Nguyễn Văn A', 'nguyenvana@example.com', 'hashed_password', '0901000002', 'CANDIDATE', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1003, 'Trần Thị B', 'tranthib@example.com', 'hashed_password', '0901000003', 'CANDIDATE', DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1004, 'Lê Văn C', 'levanc@example.com', 'hashed_password', '0901000004', 'CANDIDATE', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1005, 'Phạm Thị D', 'phamthid@example.com', 'hashed_password', '0901000005', 'CANDIDATE', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1006, 'Hoàng Văn E', 'hoangvane@example.com', 'hashed_password', '0901000006', 'CANDIDATE', DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
(1007, 'Vũ Thị F', 'vuthif@example.com', 'hashed_password', '0901000007', 'CANDIDATE', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
(1008, 'Đỗ Văn G', 'dovang@example.com', 'hashed_password', '0901000008', 'CANDIDATE', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(1009, 'Bùi Thị H', 'buithih@example.com', 'hashed_password', '0901000009', 'CANDIDATE', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(1010, 'Lý Văn I', 'lyvani@example.com', 'hashed_password', '0901000010', 'CANDIDATE', NOW(), NOW()),

-- Employers
(2001, 'FPT Software HR', 'hr@fpt.com', 'hashed_password', '0902000001', 'EMPLOYER', DATE_SUB(NOW(), INTERVAL 60 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2002, 'Viettel HR', 'hr@viettel.com', 'hashed_password', '0902000002', 'EMPLOYER', DATE_SUB(NOW(), INTERVAL 50 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2003, 'VNG HR', 'hr@vng.com', 'hashed_password', '0902000003', 'EMPLOYER', DATE_SUB(NOW(), INTERVAL 40 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2004, 'Techcombank HR', 'hr@techcombank.com', 'hashed_password', '0902000004', 'EMPLOYER', DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
(2005, 'Tiki HR', 'hr@tiki.com', 'hashed_password', '0902000005', 'EMPLOYER', DATE_SUB(NOW(), INTERVAL 20 DAY), NOW());

-- Create employers
INSERT IGNORE INTO employers (EmployerID, UserID, CompanyName, Industry, CompanySize, Website, Address, Description) VALUES
(3001, 2001, 'FPT Software', 'Công nghệ thông tin', '10000+', 'https://www.fpt-software.com', 'Hà Nội', 'Công ty phần mềm hàng đầu Việt Nam'),
(3002, 2002, 'Viettel Group', 'Viễn thông', '10000+', 'https://www.viettel.com.vn', 'Hà Nội', 'Tập đoàn viễn thông lớn nhất Việt Nam'),
(3003, 2003, 'VNG Corporation', 'Công nghệ thông tin', '1000-5000', 'https://www.vng.com.vn', 'TP.HCM', 'Công ty công nghệ hàng đầu Việt Nam'),
(3004, 2004, 'Techcombank', 'Ngân hàng & Tài chính', '5000-10000', 'https://www.techcombank.com', 'Hà Nội', 'Ngân hàng thương mại cổ phần hàng đầu'),
(3005, 2005, 'Tiki Corporation', 'Thương mại điện tử', '1000-5000', 'https://www.tiki.vn', 'TP.HCM', 'Sàn thương mại điện tử hàng đầu');

-- Create job postings with various dates and statuses
INSERT IGNORE INTO job_postings (JobID, EmployerID, Title, Description, Requirements, Location, Salary, Industry, ExperienceLevel, JobType, Status, CreatedDate, UpdatedDate, ExpiryDate, ApplicationCount, CompanyName) VALUES
-- FPT Software jobs
(4001, 3001, 'Senior Java Developer', 'Phát triển ứng dụng Java cho dự án lớn', 'Java, Spring Boot, MySQL', 'Hà Nội', '20-30 triệu', 'Công nghệ thông tin', 'Senior', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 30 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 15, 'FPT Software'),
(4002, 3001, 'Frontend Developer', 'Phát triển giao diện người dùng với React', 'React, JavaScript, CSS', 'Hà Nội', '15-25 triệu', 'Công nghệ thông tin', 'Mid-level', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 25 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 25 DAY), 12, 'FPT Software'),
(4003, 3001, 'DevOps Engineer', 'Quản lý hạ tầng và CI/CD', 'Docker, Kubernetes, AWS', 'Hà Nội', '25-35 triệu', 'Công nghệ thông tin', 'Senior', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 20 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), 8, 'FPT Software'),

-- Viettel jobs
(4004, 3002, 'Network Engineer', 'Thiết kế và quản lý hệ thống mạng', 'Cisco, Network Security', 'Hà Nội', '18-28 triệu', 'Viễn thông', 'Mid-level', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 15 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 35 DAY), 10, 'Viettel Group'),
(4005, 3002, 'Data Analyst', 'Phân tích dữ liệu viễn thông', 'Python, SQL, Tableau', 'Hà Nội', '16-24 triệu', 'Viễn thông', 'Mid-level', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 10 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 40 DAY), 7, 'Viettel Group'),

-- VNG jobs
(4006, 3003, 'Game Developer', 'Phát triển game mobile', 'Unity, C#, Game Design', 'TP.HCM', '22-32 triệu', 'Công nghệ thông tin', 'Senior', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 8 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 22 DAY), 20, 'VNG Corporation'),
(4007, 3003, 'Product Manager', 'Quản lý sản phẩm digital', 'Product Management, Analytics', 'TP.HCM', '25-40 triệu', 'Công nghệ thông tin', 'Senior', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 25 DAY), 5, 'VNG Corporation'),

-- Techcombank jobs
(4008, 3004, 'Business Analyst', 'Phân tích nghiệp vụ ngân hàng', 'Business Analysis, Banking', 'Hà Nội', '20-30 triệu', 'Ngân hàng & Tài chính', 'Mid-level', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 27 DAY), 3, 'Techcombank'),
(4009, 3004, 'Risk Management Specialist', 'Quản lý rủi ro tín dụng', 'Risk Management, Finance', 'Hà Nội', '18-26 triệu', 'Ngân hàng & Tài chính', 'Mid-level', 'Full-time', 'ACTIVE', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), DATE_ADD(NOW(), INTERVAL 29 DAY), 1, 'Techcombank'),

-- Tiki jobs
(4010, 3005, 'Marketing Specialist', 'Marketing sản phẩm trực tuyến', 'Digital Marketing, SEO/SEM', 'TP.HCM', '12-18 triệu', 'Marketing & Truyền thông', 'Junior', 'Full-time', 'ACTIVE', NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 0, 'Tiki Corporation'),

-- Some inactive/expired jobs
(4011, 3001, 'Intern Developer', 'Thực tập sinh lập trình', 'Programming basics', 'Hà Nội', '5-8 triệu', 'Công nghệ thông tin', 'Entry-level', 'Internship', 'INACTIVE', DATE_SUB(NOW(), INTERVAL 45 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 25, 'FPT Software'),
(4012, 3002, 'Project Manager', 'Quản lý dự án viễn thông', 'Project Management, Agile', 'Hà Nội', '30-45 triệu', 'Viễn thông', 'Senior', 'Full-time', 'INACTIVE', DATE_SUB(NOW(), INTERVAL 40 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), 18, 'Viettel Group');

-- Create CVs for candidates
INSERT IGNORE INTO cvs (CVID, UserID, Title, CreatedAt, UpdatedAt) VALUES
(5001, 1002, 'Nguyễn Văn A - Java Developer', DATE_SUB(NOW(), INTERVAL 29 DAY), NOW()),
(5002, 1003, 'Trần Thị B - Frontend Developer', DATE_SUB(NOW(), INTERVAL 24 DAY), NOW()),
(5003, 1004, 'Lê Văn C - DevOps Engineer', DATE_SUB(NOW(), INTERVAL 19 DAY), NOW()),
(5004, 1005, 'Phạm Thị D - Data Analyst', DATE_SUB(NOW(), INTERVAL 14 DAY), NOW()),
(5005, 1006, 'Hoàng Văn E - Game Developer', DATE_SUB(NOW(), INTERVAL 9 DAY), NOW()),
(5006, 1007, 'Vũ Thị F - Business Analyst', DATE_SUB(NOW(), INTERVAL 4 DAY), NOW()),
(5007, 1008, 'Đỗ Văn G - Marketing Specialist', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(5008, 1009, 'Bùi Thị H - Product Manager', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(5009, 1010, 'Lý Văn I - Full Stack Developer', NOW(), NOW());

-- Create applications with various statuses and dates
INSERT IGNORE INTO applications (ApplicationID, CVID, JobID, AppliedAt, Status) VALUES
-- Recent applications (last 7 days)
(6001, 5001, 4001, DATE_SUB(NOW(), INTERVAL 1 DAY), 'pending'),
(6002, 5002, 4002, DATE_SUB(NOW(), INTERVAL 1 DAY), 'pending'),
(6003, 5003, 4003, DATE_SUB(NOW(), INTERVAL 2 DAY), 'viewed'),
(6004, 5004, 4004, DATE_SUB(NOW(), INTERVAL 2 DAY), 'pending'),
(6005, 5005, 4006, DATE_SUB(NOW(), INTERVAL 3 DAY), 'accepted'),
(6006, 5006, 4008, DATE_SUB(NOW(), INTERVAL 3 DAY), 'pending'),
(6007, 5007, 4010, DATE_SUB(NOW(), INTERVAL 4 DAY), 'viewed'),
(6008, 5008, 4007, DATE_SUB(NOW(), INTERVAL 5 DAY), 'accepted'),
(6009, 5009, 4001, DATE_SUB(NOW(), INTERVAL 6 DAY), 'rejected'),

-- Older applications (last 30 days)
(6010, 5001, 4004, DATE_SUB(NOW(), INTERVAL 10 DAY), 'accepted'),
(6011, 5002, 4006, DATE_SUB(NOW(), INTERVAL 12 DAY), 'rejected'),
(6012, 5003, 4001, DATE_SUB(NOW(), INTERVAL 15 DAY), 'viewed'),
(6013, 5004, 4002, DATE_SUB(NOW(), INTERVAL 18 DAY), 'accepted'),
(6014, 5005, 4003, DATE_SUB(NOW(), INTERVAL 20 DAY), 'pending'),
(6015, 5006, 4005, DATE_SUB(NOW(), INTERVAL 22 DAY), 'rejected'),
(6016, 5007, 4007, DATE_SUB(NOW(), INTERVAL 25 DAY), 'accepted'),
(6017, 5008, 4008, DATE_SUB(NOW(), INTERVAL 28 DAY), 'viewed'),

-- Historical applications (older than 30 days)
(6018, 5001, 4011, DATE_SUB(NOW(), INTERVAL 35 DAY), 'accepted'),
(6019, 5002, 4012, DATE_SUB(NOW(), INTERVAL 37 DAY), 'rejected'),
(6020, 5003, 4011, DATE_SUB(NOW(), INTERVAL 40 DAY), 'viewed'),
(6021, 5004, 4012, DATE_SUB(NOW(), INTERVAL 42 DAY), 'accepted'),
(6022, 5005, 4011, DATE_SUB(NOW(), INTERVAL 43 DAY), 'pending');

-- Update application counts in job_postings
UPDATE job_postings jp SET application_count = (
    SELECT COUNT(*) FROM applications a WHERE a.JobID = jp.JobID
);

SELECT 'Sample statistics data created successfully!' as Result;
SELECT 'Users created:', COUNT(*) FROM users WHERE UserID >= 1001;
SELECT 'Jobs created:', COUNT(*) FROM job_postings WHERE JobID >= 4001;
SELECT 'Applications created:', COUNT(*) FROM applications WHERE ApplicationID >= 6001;

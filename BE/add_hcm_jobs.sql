-- Insert additional jobs for Ho Chi Minh City testing
-- These jobs will have different variations of Ho Chi Minh location names

INSERT INTO job_postings (employer_id, title, description, location, salary, job_type, industry, experience_level, skills_required, benefits, company_name, status, created_date, updated_date) 
VALUES 
-- Jobs with different Ho Chi Minh location variations
(1, 'Frontend Developer (ReactJS)', 'Develop modern web applications using React, JavaScript, and CSS. Work with a dynamic team to create user-friendly interfaces.', 'TP. Hồ Chí Minh', '15-25 triệu VND', 'FULL_TIME', 'Công nghệ thông tin', 'JUNIOR', 'React, JavaScript, CSS, HTML', 'Bảo hiểm đầy đủ, Thưởng hiệu suất', 'Tech Solutions Inc.', 'ACTIVE', NOW(), NOW()),

(1, 'Backend Developer (Java)', 'Build robust backend systems using Java and Spring Boot. Design and implement RESTful APIs.', 'Hồ Chí Minh', '20-35 triệu VND', 'FULL_TIME', 'Công nghệ thông tin', 'SENIOR', 'Java, Spring Boot, MySQL, REST API', 'Làm việc từ xa, Đào tạo kỹ năng', 'Software House HCMC', 'ACTIVE', NOW(), NOW()),

(1, 'UI/UX Designer', 'Create beautiful and intuitive user interfaces. Collaborate with development teams to implement designs.', 'TPHCM', '18-28 triệu VND', 'FULL_TIME', 'Thiết kế', 'MID_LEVEL', 'Figma, Adobe XD, Prototyping, UI Design', 'Môi trường sáng tạo, Flexible time', 'Creative Studio', 'ACTIVE', NOW(), NOW()),

(1, 'Sales Manager', 'Lead sales team and develop business relationships. Manage B2B sales processes and CRM systems.', 'HCM', '25-40 triệu VND', 'FULL_TIME', 'Kinh doanh', 'SENIOR', 'B2B Sales, CRM, Team Management, Communication', 'Hoa hồng cao, Xe công ty', 'Business Solutions', 'ACTIVE', NOW(), NOW()),

(1, 'Data Analyst', 'Analyze data trends and create insights for business decisions. Work with Python, SQL, and BI tools.', 'Saigon', '15-22 triệu VND', 'FULL_TIME', 'Công nghệ thông tin', 'JUNIOR', 'Python, SQL, Power BI, Excel', 'Đào tạo chuyên sâu, Cơ hội thăng tiến', 'Analytics Pro', 'ACTIVE', NOW(), NOW()),

(1, 'Mobile Developer (React Native)', 'Develop cross-platform mobile applications. Work on both iOS and Android platforms.', 'TP. Hồ Chí Minh', '22-32 triệu VND', 'FULL_TIME', 'Công nghệ thông tin', 'MID_LEVEL', 'React Native, iOS, Android, Mobile Development', 'Thiết bị làm việc, Team building', 'Mobile First Co.', 'ACTIVE', NOW(), NOW()),

(1, 'DevOps Engineer', 'Manage cloud infrastructure and deployment pipelines. Work with AWS, Docker, and Kubernetes.', 'Hồ Chí Minh', '30-45 triệu VND', 'FULL_TIME', 'Công nghệ thông tin', 'SENIOR', 'AWS, Docker, Kubernetes, CI/CD', 'Chứng chỉ AWS, Remote work', 'Cloud Infrastructure Ltd.', 'ACTIVE', NOW(), NOW()),

(1, 'Product Manager', 'Lead product development strategy and roadmap. Coordinate between technical and business teams.', 'Hồ Chí Minh', '35-50 triệu VND', 'FULL_TIME', 'Quản lý sản phẩm', 'SENIOR', 'Product Strategy, Agile, Data Analysis, Leadership', 'Stock options, Leadership training', 'Innovation Hub', 'ACTIVE', NOW(), NOW()),

(1, 'Marketing Specialist', 'Develop and execute digital marketing campaigns. Manage SEO, SEM, and social media marketing.', 'Ho Chi Minh City', '12-20 triệu VND', 'FULL_TIME', 'Marketing', 'JUNIOR', 'SEO, Google Ads, Social Media, Content Marketing', 'Thưởng dự án, Học phí khóa học', 'Digital Growth Agency', 'ACTIVE', NOW(), NOW());

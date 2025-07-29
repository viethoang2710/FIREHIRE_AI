-- Update job_postings table structure
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS salary VARCHAR(100);
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50);
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS job_type VARCHAR(50);
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS skills_required TEXT;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS benefits TEXT;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS application_deadline DATETIME;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT FALSE;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS application_count INT DEFAULT 0;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS created_date DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS updated_date DATETIME;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS expiry_date DATETIME;

-- Create CV analysis table
CREATE TABLE IF NOT EXISTS cv_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    file_name VARCHAR(255),
    score INT,
    target_position VARCHAR(255),
    analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    cv_content LONGTEXT,
    INDEX idx_user_id (user_id),
    INDEX idx_analysis_date (analysis_date)
);

-- Create CV analysis feedback table
CREATE TABLE IF NOT EXISTS cv_analysis_feedback (
    analysis_id INT,
    feedback TEXT,
    FOREIGN KEY (analysis_id) REFERENCES cv_analysis(id) ON DELETE CASCADE
);

-- Create CV analysis keywords table
CREATE TABLE IF NOT EXISTS cv_analysis_keywords (
    analysis_id INT,
    keyword VARCHAR(255),
    FOREIGN KEY (analysis_id) REFERENCES cv_analysis(id) ON DELETE CASCADE,
    INDEX idx_keyword (keyword)
);

-- Create CV analysis missing sections table
CREATE TABLE IF NOT EXISTS cv_analysis_missing_sections (
    analysis_id INT,
    missing_section VARCHAR(255),
    FOREIGN KEY (analysis_id) REFERENCES cv_analysis(id) ON DELETE CASCADE
);

-- Create CV analysis suggestions table
CREATE TABLE IF NOT EXISTS cv_analysis_suggestions (
    analysis_id INT,
    suggestion TEXT,
    FOREIGN KEY (analysis_id) REFERENCES cv_analysis(id) ON DELETE CASCADE
);

-- Update applications table to support file uploads
ALTER TABLE applications ADD COLUMN IF NOT EXISTS cv_file_path VARCHAR(500);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS cv_file_name VARCHAR(255);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS cv_file_size BIGINT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS cover_letter TEXT;

-- Create saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    search_query VARCHAR(500),
    search_filters TEXT,
    search_name VARCHAR(255),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_candidate_id (candidate_id)
);

-- Create job views table for tracking
CREATE TABLE IF NOT EXISTS job_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    viewer_id INT,
    viewer_type VARCHAR(20), -- 'CANDIDATE', 'EMPLOYER', 'ANONYMOUS'
    view_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id),
    INDEX idx_viewer (viewer_id, viewer_type),
    INDEX idx_view_date (view_date)
);

-- Create job applications with file support
CREATE TABLE IF NOT EXISTS job_applications_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    file_type VARCHAR(20), -- 'CV', 'COVER_LETTER', 'PORTFOLIO'
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT,
    content_type VARCHAR(100),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Insert sample industries
INSERT IGNORE INTO job_postings (title, description, location, industry, experience_level, job_type, company_name, salary, status) VALUES
('Java Developer', 'Develop and maintain Java applications', 'Ho Chi Minh City', 'Information Technology', 'Junior', 'Full-time', 'Tech Corp', '15-25 triệu', 'ACTIVE'),
('Marketing Manager', 'Lead marketing campaigns and strategies', 'Ha Noi', 'Marketing', 'Senior', 'Full-time', 'Marketing Solutions', '20-30 triệu', 'ACTIVE'),
('Sales Executive', 'Drive sales and business development', 'Da Nang', 'Sales', 'Mid-level', 'Full-time', 'Sales Pro', '12-18 triệu', 'ACTIVE'),
('Data Analyst', 'Analyze data and create reports', 'Ho Chi Minh City', 'Information Technology', 'Mid-level', 'Full-time', 'Data Insights', '18-28 triệu', 'ACTIVE'),
('HR Specialist', 'Manage human resources activities', 'Ha Noi', 'Human Resources', 'Junior', 'Full-time', 'HR Solutions', '10-15 triệu', 'ACTIVE');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_location ON job_postings(location);
CREATE INDEX IF NOT EXISTS idx_job_industry ON job_postings(industry);
CREATE INDEX IF NOT EXISTS idx_job_experience ON job_postings(experience_level);
CREATE INDEX IF NOT EXISTS idx_job_type ON job_postings(job_type);
CREATE INDEX IF NOT EXISTS idx_job_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_created ON job_postings(created_date);
CREATE INDEX IF NOT EXISTS idx_job_urgent ON job_postings(is_urgent);
CREATE INDEX IF NOT EXISTS idx_job_views ON job_postings(view_count);

-- Update existing job postings with default values
UPDATE job_postings SET 
    status = 'ACTIVE',
    created_date = CURRENT_TIMESTAMP,
    view_count = 0,
    application_count = 0,
    is_urgent = FALSE
WHERE status IS NULL;

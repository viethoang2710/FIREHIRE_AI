-- Script kiểm tra jobs trong database
USE firehire_ai;

-- Xem tất cả jobs đã tạo
SELECT 
    id,
    title,
    location,
    salary,
    job_type,
    status,
    employer_id,
    created_date
FROM job_postings 
ORDER BY created_date DESC 
LIMIT 10;

-- Kiểm tra jobs của employer cụ thể
SELECT COUNT(*) as total_jobs, employer_id 
FROM job_postings 
GROUP BY employer_id;

-- Xem chi tiết jobs mới nhất
SELECT * FROM job_postings 
WHERE created_date >= CURDATE() 
ORDER BY created_date DESC;

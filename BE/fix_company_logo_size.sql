-- Sửa cột company_logo để có thể chứa dữ liệu base64 lớn
USE firehire_ai;

-- Kiểm tra cấu trúc hiện tại
DESCRIBE Job_Postings;

-- Sửa cột company_logo từ varchar(500) thành LONGTEXT
ALTER TABLE Job_Postings 
MODIFY COLUMN company_logo LONGTEXT;

-- Kiểm tra lại sau khi sửa
DESCRIBE Job_Postings;

-- Kiểm tra dữ liệu hiện có
SELECT JobID, Title, company_logo IS NOT NULL as HasLogo FROM Job_Postings LIMIT 5;

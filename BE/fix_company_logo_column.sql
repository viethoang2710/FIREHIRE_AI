-- Sửa cột CompanyLogo để đảm bảo có thể chứa dữ liệu base64 lớn
USE firehire_ai;

-- Kiểm tra cấu trúc hiện tại
DESCRIBE Job_Postings;

-- Nếu cột CompanyLogo đã tồn tại nhưng có kích thước sai, sửa lại
ALTER TABLE Job_Postings 
MODIFY COLUMN CompanyLogo LONGTEXT;

-- Nếu cột chưa tồn tại, thêm mới  
-- ALTER TABLE Job_Postings
-- ADD COLUMN CompanyLogo LONGTEXT;

-- Kiểm tra lại sau khi sửa
DESCRIBE Job_Postings;

-- Kiểm tra dữ liệu hiện có
SELECT ID, Title, CompanyLogo IS NOT NULL as HasLogo FROM Job_Postings LIMIT 5;

-- Thêm cột CompanyLogo vào bảng Job_Postings với kích thước đủ lớn cho base64
ALTER TABLE Job_Postings
ADD COLUMN CompanyLogo LONGTEXT;

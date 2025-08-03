-- Add new columns to CVs table for storing uploaded files
-- Run this script to update the database schema

USE firehire_ai;

-- Add new columns to CVs table
ALTER TABLE CVs 
ADD COLUMN FileName VARCHAR(255) NULL AFTER UpdatedAt,
ADD COLUMN FileSize BIGINT NULL AFTER FileName,
ADD COLUMN FileType VARCHAR(50) NULL AFTER FileSize,
ADD COLUMN FileData LONGBLOB NULL AFTER FileType,
ADD COLUMN CoverLetter TEXT NULL AFTER FileData;

-- Verify the changes
DESC CVs;

-- Check existing data
SELECT CVID, UserID, Title, FileName, FileSize, FileType, 
       CASE WHEN FileData IS NOT NULL THEN 'Has File Data' ELSE 'No File Data' END as FileStatus,
       CreatedAt, UpdatedAt
FROM CVs 
LIMIT 10;

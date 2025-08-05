-- Check Applications table structure
USE firehire_ai;

-- Describe Applications table
DESCRIBE Applications;

-- Check columns information
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_KEY,
    COLUMN_DEFAULT,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'firehire_ai' 
AND TABLE_NAME = 'Applications'
ORDER BY ORDINAL_POSITION;

-- Check existing Applications data
SELECT * FROM Applications LIMIT 5;

-- Check Applications count
SELECT COUNT(*) as total_applications FROM Applications;

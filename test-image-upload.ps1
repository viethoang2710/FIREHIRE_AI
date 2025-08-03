# Test Image Upload After Database Fix
Write-Host "=== Testing Image Upload After Database Fix ===" -ForegroundColor Green

# Kiểm tra file ảnh test
$imagePath = "test-image.png"
if (Test-Path $imagePath) {
    Write-Host "✓ Found test image: $imagePath" -ForegroundColor Green
    $imageSize = (Get-Item $imagePath).Length
    Write-Host "  Image size: $($imageSize/1KB) KB" -ForegroundColor Cyan
} else {
    Write-Host "✗ Test image not found: $imagePath" -ForegroundColor Red
    exit 1
}

# Test upload với curl (Windows 10+)
Write-Host "`n--- Testing Image Upload ---" -ForegroundColor Yellow

$response = curl.exe -X POST -H "Accept: application/json" -F "image=@$imagePath" "http://localhost:8080/api/profile/19/upload-image"

Write-Host "Upload Response:" -ForegroundColor Green
Write-Host $response -ForegroundColor White

# Kiểm tra kết quả
if ($response -like "*error*" -or $response -like "*ERROR*") {
    Write-Host "✗ Upload failed" -ForegroundColor Red
} else {
    Write-Host "✓ Upload successful!" -ForegroundColor Green
    
    # Test get image
    Write-Host "`n--- Testing Image Retrieval ---" -ForegroundColor Yellow
    $getResponse = curl.exe -I "http://localhost:8080/api/profile/19/image"
    Write-Host "Get Image Response Headers:" -ForegroundColor Green
    Write-Host $getResponse -ForegroundColor White
}

Write-Host "`n=== Test Completed ===" -ForegroundColor Green

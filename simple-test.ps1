Write-Host "Testing Image Upload" -ForegroundColor Green

# Test upload
$response = curl.exe -X POST -F "image=@test-image.png" "http://localhost:8080/api/profile/19/upload-image"
Write-Host "Response: $response"

# Test get profile info
$profileData = curl.exe "http://localhost:8080/api/profile/19"
Write-Host "Profile: $profileData"

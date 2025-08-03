# Add jobs to database via REST API
# This script will add multiple Ho Chi Minh jobs with different location variations

$apiUrl = "http://localhost:8080/api/recruiter/jobs"
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Sample jobs data with different Ho Chi Minh location variations
$jobs = @(
    @{
        employerId = 1
        title = "Frontend Developer (ReactJS)"
        description = "Develop modern web applications using React, JavaScript, and CSS. Work with a dynamic team to create user-friendly interfaces."
        location = "TP. Hồ Chí Minh"
        salary = "15-25 triệu VND"
        jobType = "FULL_TIME"
        industry = "Công nghệ thông tin"
        experienceLevel = "JUNIOR"
        skillsRequired = "React, JavaScript, CSS, HTML"
        benefits = "Bảo hiểm đầy đủ, Thưởng hiệu suất"
        companyName = "Tech Solutions Inc."
        status = "ACTIVE"
    },
    @{
        employerId = 1
        title = "Backend Developer (Java)"
        description = "Build robust backend systems using Java and Spring Boot. Design and implement RESTful APIs."
        location = "Hồ Chí Minh"
        salary = "20-35 triệu VND"
        jobType = "FULL_TIME"
        industry = "Công nghệ thông tin"
        experienceLevel = "SENIOR"
        skillsRequired = "Java, Spring Boot, MySQL, REST API"
        benefits = "Làm việc từ xa, Đào tạo kỹ năng"
        companyName = "Software House HCMC"
        status = "ACTIVE"
    },
    @{
        employerId = 1
        title = "UI/UX Designer"
        description = "Create beautiful and intuitive user interfaces. Collaborate with development teams to implement designs."
        location = "TPHCM"
        salary = "18-28 triệu VND"
        jobType = "FULL_TIME"
        industry = "Thiết kế"
        experienceLevel = "MID_LEVEL"
        skillsRequired = "Figma, Adobe XD, Prototyping, UI Design"
        benefits = "Môi trường sáng tạo, Flexible time"
        companyName = "Creative Studio"
        status = "ACTIVE"
    },
    @{
        employerId = 1
        title = "Sales Manager"
        description = "Lead sales team and develop business relationships. Manage B2B sales processes and CRM systems."
        location = "HCM"
        salary = "25-40 triệu VND"
        jobType = "FULL_TIME"
        industry = "Kinh doanh"
        experienceLevel = "SENIOR"
        skillsRequired = "B2B Sales, CRM, Team Management, Communication"
        benefits = "Hoa hồng cao, Xe công ty"
        companyName = "Business Solutions"
        status = "ACTIVE"
    },
    @{
        employerId = 1
        title = "Data Analyst"
        description = "Analyze data trends and create insights for business decisions. Work with Python, SQL, and BI tools."
        location = "Saigon"
        salary = "15-22 triệu VND"
        jobType = "FULL_TIME"
        industry = "Công nghệ thông tin"
        experienceLevel = "JUNIOR"
        skillsRequired = "Python, SQL, Power BI, Excel"
        benefits = "Đào tạo chuyên sâu, Cơ hội thăng tiến"
        companyName = "Analytics Pro"
        status = "ACTIVE"
    },
    @{
        employerId = 1
        title = "Mobile Developer (React Native)"
        description = "Develop cross-platform mobile applications. Work on both iOS and Android platforms."
        location = "TP. Hồ Chí Minh"
        salary = "22-32 triệu VND"
        jobType = "FULL_TIME"
        industry = "Công nghệ thông tin"
        experienceLevel = "MID_LEVEL"
        skillsRequired = "React Native, iOS, Android, Mobile Development"
        benefits = "Thiết bị làm việc, Team building"
        companyName = "Mobile First Co."
        status = "ACTIVE"
    },
    @{
        employerId = 1
        title = "DevOps Engineer"
        description = "Manage cloud infrastructure and deployment pipelines. Work with AWS, Docker, and Kubernetes."
        location = "Hồ Chí Minh"
        salary = "30-45 triệu VND"
        jobType = "FULL_TIME"
        industry = "Công nghệ thông tin"
        experienceLevel = "SENIOR"
        skillsRequired = "AWS, Docker, Kubernetes, CI/CD"
        benefits = "Chứng chỉ AWS, Remote work"
        companyName = "Cloud Infrastructure Ltd."
        status = "ACTIVE"
    },
    @{
        employerId = 1
        title = "Marketing Specialist"
        description = "Develop and execute digital marketing campaigns. Manage SEO, SEM, and social media marketing."
        location = "Ho Chi Minh City"
        salary = "12-20 triệu VND"
        jobType = "FULL_TIME"
        industry = "Marketing"
        experienceLevel = "JUNIOR"
        skillsRequired = "SEO, Google Ads, Social Media, Content Marketing"
        benefits = "Thưởng dự án, Học phí khóa học"
        companyName = "Digital Growth Agency"
        status = "ACTIVE"
    }
)

Write-Host "Adding jobs to database via REST API..." -ForegroundColor Green

$successCount = 0
$errorCount = 0

foreach ($job in $jobs) {
    try {
        $jsonBody = $job | ConvertTo-Json -Depth 3
        Write-Host "Adding job: $($job.title) at $($job.location)" -ForegroundColor Yellow
        
        $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Headers $headers -Body $jsonBody
        
        if ($response) {
            Write-Host "✅ Successfully added: $($job.title)" -ForegroundColor Green
            $successCount++
        }
    }
    catch {
        Write-Host "❌ Failed to add: $($job.title) - $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "✅ Successfully added: $successCount jobs" -ForegroundColor Green
Write-Host "❌ Failed to add: $errorCount jobs" -ForegroundColor Red

Write-Host "`nTesting API endpoint..." -ForegroundColor Cyan
try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/jobs/location?location=Ho Chi Minh City" -Method GET -Headers @{"Accept"="application/json"}
    Write-Host "Found $($testResponse.data.Count) jobs in Ho Chi Minh City" -ForegroundColor Green
}
catch {
    Write-Host "Failed to test API: $($_.Exception.Message)" -ForegroundColor Red
}

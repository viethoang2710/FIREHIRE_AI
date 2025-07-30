#!/bin/bash
# Script test API endpoints

echo "🔥 Testing FireHire AI Backend APIs..."

# Test backend connection
echo "1. Testing backend connection..."
curl -X GET "http://localhost:8080/api/jobs/hot-jobs?limit=1" -H "Content-Type: application/json"
echo ""

# Test GET recruiter jobs
echo "2. Testing GET recruiter jobs..."
curl -X GET "http://localhost:8080/api/recruiter/jobs?employerId=1" -H "Content-Type: application/json"
echo ""

# Test POST create job
echo "3. Testing POST create job..."
curl -X POST "http://localhost:8080/api/recruiter/jobs" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Job via CURL",
       "description": "Đây là job test từ CURL script",
       "location": "Hà Nội", 
       "salary": "1500-2500 USD",
       "jobType": "Full-time",
       "industry": "Công nghệ thông tin",
       "experienceLevel": "Middle",
       "skillsRequired": "React, Node.js, JavaScript",
       "benefits": "Bảo hiểm, thưởng năm",
       "status": "ACTIVE",
       "employerId": 1
     }'
echo ""

echo "🎯 API testing completed!"

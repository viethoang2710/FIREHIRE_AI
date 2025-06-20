// src/pages/HotLatestJobsPage.js
import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';

// Mock data cho ví dụ
const mockHotJobs = [
  { id: 1, title: 'Blockchain Developer (Hot)', companyName: 'Crypto Lab', companyLogo: 'https://via.placeholder.com/50/000000/FFFFFF?text=CL', salary: '30-60 triệu', location: 'TP.HCM', experience: '3 năm', deadline: '25/06/2025', tags: ['Blockchain', 'Solidity', 'Hot'] },
  { id: 2, title: 'AI Engineer (Mới nhất)', companyName: 'AI Solutions Inc.', companyLogo: 'https://via.placeholder.com/50/FF4500/FFFFFF?text=AI', salary: '25-50 triệu', location: 'Hà Nội', experience: '2 năm', deadline: '01/07/2025', tags: ['AI', 'Machine Learning', 'Python', 'Mới'] },
  { id: 3, title: 'Trưởng phòng Marketing (Hot)', companyName: 'Luxury Brand', companyLogo: 'https://via.placeholder.com/50/8A2BE2/FFFFFF?text=LB', salary: '20-35 triệu', location: 'Hà Nội', experience: '5 năm', deadline: '20/06/2025', tags: ['Marketing', 'Quản lý', 'Hot'] },
  { id: 4, title: 'Data Analyst (Mới nhất)', companyName: 'Data Insights', companyLogo: 'https://via.placeholder.com/50/00CED1/FFFFFF?text=DI', salary: '12-22 triệu', location: 'TP.HCM', experience: '1 năm', deadline: '07/07/2025', tags: ['Data', 'Analytics', 'SQL', 'Mới'] },
  { id: 5, title: 'Chuyên viên tuyển dụng', companyName: 'HR Connect', companyLogo: 'https://via.placeholder.com/50/FFD700/000000?text=HC', salary: '8-15 triệu', location: 'Đà Nẵng', experience: '2 năm', deadline: '15/07/2025', tags: ['Tuyển dụng', 'HR'] },
];

function HotLatestJobsPage({ navigate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(8); // Giả định

  useEffect(() => {
    // Fetch hot/latest jobs from API
    setLoading(true);
    setTimeout(() => {
      // Trong thực tế, bạn sẽ có logic để phân biệt hot/latest từ API
      setJobs(mockHotJobs);
      setTotalPages(Math.ceil(mockHotJobs.length / 5)); // 5 job mỗi trang
      setLoading(false);
    }, 500);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải việc làm Hot/Mới nhất...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Việc làm Hot / Mới nhất</h1>

      {jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} navigate={navigate} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center text-gray-600">Hiện không có việc làm Hot/Mới nhất nào.</p>
      )}
    </div>
  );
}

export default HotLatestJobsPage;
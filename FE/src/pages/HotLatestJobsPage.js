// src/pages/HotLatestJobsPage.js (hiển thị tất cả việc làm)
import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import jobService from '../services/jobService';

function HotLatestJobsPage({ navigate, showAlert }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch tất cả công việc từ API với phân trang
        const response = await jobService.getAllJobs({
          page: currentPage - 1, // Backend thường bắt đầu từ 0
          size: 10 // 10 jobs per page
        });
        
        console.log('All jobs API response:', response);
        
        if (response && response.content) {
          setJobs(response.content);
          setTotalPages(Math.ceil((response.totalElements || response.content.length) / 10));
        } else {
          setJobs([]);
          setTotalPages(1);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching all jobs:', err);
        setError('Không thể tải danh sách việc làm. Vui lòng thử lại.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải danh sách việc làm...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Tất cả việc làm</h1>

      {jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} navigate={navigate} showAlert={showAlert} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center text-gray-600">Hiện không có việc làm nào.</p>
      )}
    </div>
  );
}

export default HotLatestJobsPage;
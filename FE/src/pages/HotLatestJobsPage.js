// src/pages/HotLatestJobsPage.js
import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import jobService from '../services/jobService';

function HotLatestJobsPage({ navigate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch hot and latest jobs from API
        const response = await jobService.getHotLatestJobs();
        const hotLatestJobs = response.content || [];
        setJobs(hotLatestJobs);
        setTotalPages(Math.ceil(hotLatestJobs.length / 10)); // 10 jobs per page
        setError(null);
      } catch (err) {
        console.error('Error fetching hot/latest jobs:', err);
        setError('Không thể tải danh sách việc làm. Vui lòng thử lại.');
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
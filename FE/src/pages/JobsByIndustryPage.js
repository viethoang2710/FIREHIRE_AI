// src/pages/JobsByIndustryPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';

const mockJobs = [
  { id: 1, title: 'Lập trình viên Java Senior', companyName: 'FPT Software', companyLogo: 'https://via.placeholder.com/50/FF0000/FFFFFF?text=FPT', salary: '20-35 triệu', location: 'Hà Nội', experience: '5 năm', deadline: '30/06/2025', tags: ['Java', 'Spring Boot', 'Backend', 'Hot'] },
  { id: 2, title: 'Chuyên viên Digital Marketing', companyName: 'VNG Corp', companyLogo: 'https://via.placeholder.com/50/0000FF/FFFFFF?text=VNG', salary: '10-18 triệu', location: 'TP.HCM', experience: '2 năm', deadline: '28/06/2025', tags: ['Marketing', 'SEO', 'Content'] },
  { id: 3, title: 'Kế toán tổng hợp', companyName: 'Viettel', companyLogo: 'https://via.placeholder.com/50/008000/FFFFFF?text=VT', salary: '8-15 triệu', location: 'Đà Nẵng', experience: '3 năm', deadline: '05/07/2025', tags: ['Kế toán', 'Tài chính'] },
  { id: 4, title: 'Thiết kế đồ họa', companyName: 'Game Studio', companyLogo: 'https://via.placeholder.com/50/FFFF00/000000?text=GS', salary: '9-16 triệu', location: 'Hà Nội', experience: '1 năm', deadline: '10/07/2025', tags: ['Thiết kế', 'Graphic Design'] },
];

function JobsByIndustryPage({ industrySlug }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  const popularIndustries = [
    { name: 'Công nghệ thông tin', slug: 'it' },
    { name: 'Marketing & Truyền thông', slug: 'marketing' },
    { name: 'Kinh doanh & Bán hàng', slug: 'sales' },
    { name: 'Ngân hàng & Tài chính', slug: 'finance' },
    { name: 'Nhân sự', slug: 'hr' },
    { name: 'Xây dựng', slug: 'construction' },
  ];

  const jobsPerPage = 5;

  const handleNavigate = (routeName, params = {}) => {
    let path = '/viec-lam-theo-nganh-nghe';
    if (routeName === 'jobsByIndustry' && params.slug) {
      path += `/${params.slug}`;
    }
    navigate(path);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        let filteredJobs = mockJobs;

        if (industrySlug) {
          if (industrySlug === 'it') {
            filteredJobs = filteredJobs.filter(job => job.tags.includes('Java') || job.tags.includes('Backend'));
          } else if (industrySlug === 'marketing') {
            filteredJobs = filteredJobs.filter(job => job.tags.includes('Marketing'));
          } else if (industrySlug === 'finance') {
            filteredJobs = filteredJobs.filter(job => job.tags.includes('Tài chính'));
          }
        }

        if (filters.locations && filters.locations.length > 0) {
          filteredJobs = filteredJobs.filter(job =>
            filters.locations.some(loc => job.location.includes(loc))
          );
        }

        const total = filteredJobs.length;
        const pages = Math.ceil(total / jobsPerPage);
        const startIdx = (currentPage - 1) * jobsPerPage;
        const paginatedJobs = filteredJobs.slice(startIdx, startIdx + jobsPerPage);

        setJobs(paginatedJobs);
        setTotalPages(pages);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }, 500);
  }, [industrySlug, currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentIndustryName = popularIndustries.find(ind => ind.slug === industrySlug)?.name || 'Tất cả ngành nghề';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-700">Đang tải việc làm theo ngành nghề...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        <p>Lỗi: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Việc làm ngành nghề: {currentIndustryName}</h1>

      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {popularIndustries.map(industry => (
          <button
            key={industry.slug}
            onClick={() => handleNavigate('jobsByIndustry', { slug: industry.slug })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              industrySlug === industry.slug ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {industry.name}
          </button>
        ))}
        {industrySlug && (
          <button
            onClick={() => handleNavigate('jobsByIndustry')}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Xem tất cả
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        <div className="md:w-3/4">
          {jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-center text-gray-600">Không tìm thấy việc làm nào phù hợp với tiêu chí của bạn.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsByIndustryPage;

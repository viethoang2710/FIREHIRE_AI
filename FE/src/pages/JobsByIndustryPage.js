// src/pages/JobsByIndustryPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import jobService from '../services/jobService';

function JobsByIndustryPage() {
  const navigate = useNavigate();
  const { industrySlug } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  const popularIndustries = [
    { name: 'Công nghệ thông tin', slug: 'it', actualName: 'IT' }, 
    { name: 'Marketing & Truyền thông', slug: 'marketing', actualName: 'Marketing' },
    { name: 'Kinh doanh & Bán hàng', slug: 'sales', actualName: 'Kinh doanh' },
    { name: 'Ngân hàng & Tài chính', slug: 'finance', actualName: 'Tài chính' },
    { name: 'Nhân sự', slug: 'hr', actualName: 'Nhân sự' },
    { name: 'Xây dựng', slug: 'construction', actualName: 'Xây dựng' },
    { name: 'Software Testing', slug: 'software-testing', actualName: 'Software Testing' },
  ];

  // Function to get actual industry name from slug
  const getActualIndustryName = (slug) => {
    if (!slug) return null;
    
    // Map common slugs to actual database values (test với values đã hoạt động)
    const industryMap = {
      'it': 'IT', // Dùng "IT" vì API đã test thành công
      'marketing': 'Marketing',
      'sales': 'Kinh doanh',
      'finance': 'Tài chính', 
      'hr': 'Nhân sự',
      'construction': 'Xây dựng',
      'software-testing': 'Software Testing'
    };
    
    return industryMap[slug] || slug;
  };

  const handleNavigate = (routeName, params = {}) => {
    let path = '/jobs-by-industry';
    if (routeName === 'jobsByIndustry' && params.slug) {
      path += `/${params.slug}`;
    }
    navigate(path);
  };

  useEffect(() => {
    const fetchJobsByIndustry = async () => {
      try {
        setLoading(true);
        setError(null);

        let jobsData = [];
        if (industrySlug) {
          // Convert slug to actual industry name for database query
          const actualIndustryName = getActualIndustryName(industrySlug);
          console.log(`Using actual industry name: ${actualIndustryName} for slug: ${industrySlug}`);
          
          // Fetch jobs by specific industry
          jobsData = await jobService.getJobsByIndustry(actualIndustryName, { 
            ...filters, 
            page: currentPage - 1, 
            size: 10 
          });
        } else {
          // Fetch all jobs with industry filter from sidebar
          const response = await jobService.getAllJobs({ 
            ...filters, 
            page: currentPage - 1, 
            size: 10 
          });
          jobsData = response.content || response || [];
        }

        setJobs(jobsData);
        setTotalPages(Math.ceil(jobsData.length / 10));
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs by industry:', err);
        setError('Không thể tải danh sách việc làm. Vui lòng thử lại.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsByIndustry();
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

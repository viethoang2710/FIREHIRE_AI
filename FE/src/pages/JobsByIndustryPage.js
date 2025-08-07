// src/pages/JobsByIndustryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import jobService from '../services/jobService';
import { filterJobs, getFilterSummary, hasActiveFilters } from '../utils/filterUtils';

function JobsByIndustryPage() {
  const navigate = useNavigate();
  const { industrySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  // Initialize filters from URL params on component mount
  useEffect(() => {
    const initialFilters = {};
    const industry = searchParams.get('industry');
    const location = searchParams.get('location');
    const salaryRange = searchParams.get('salary');
    const page = searchParams.get('page');

    if (industry) initialFilters.industry = industry;
    if (location) initialFilters.location = location;
    if (salaryRange) initialFilters.salaryRange = salaryRange;
    
    setFilters(initialFilters);
    if (page) setCurrentPage(parseInt(page) || 1);
  }, [searchParams]);

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
    
    // Map common slugs to actual database values với nhiều biến thể
    const industryMap = {
      'cong-nghe-thong-tin': ['IT', 'Công nghệ thông tin', 'Technology', 'Information Technology', 'Tech', 'CNTT', 'CÃ´ng nghá» thÃ´ng tin', 'Software', 'Programming'],
      'it': ['IT', 'Công nghệ thông tin', 'Technology', 'Information Technology', 'Tech', 'CNTT', 'CÃ´ng nghá» thÃ´ng tin'], 
      'marketing': ['Marketing', 'Marketing & Truyền thông', 'Truyền thông'],
      'sales': ['Kinh doanh', 'Sales', 'Bán hàng', 'Kinh doanh & Bán hàng'],
      'finance': ['Tài chính', 'Finance', 'Ngân hàng', 'Banking', 'Ngân hàng & Tài chính'], 
      'hr': ['Nhân sự', 'HR', 'Human Resources'],
      'construction': ['Xây dựng', 'Construction'],
      'software-testing': ['Software Testing', 'Testing', 'QA', 'Quality Assurance']
    };
    
    return industryMap[slug] || [slug];
  };

  // Function to apply filters to jobs list
  const applyFilters = (jobs, filters) => {
    return filterJobs(jobs, filters);
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
        let totalElements = 0;
        
        if (industrySlug) {
          // Convert slug to actual industry variations for database query
          const industryVariations = getActualIndustryName(industrySlug);
          console.log(`Using industry variations: ${JSON.stringify(industryVariations)} for slug: ${industrySlug}`);
          
          // Try to get jobs from all variations - use getAllJobs and filter client-side for better results
          console.log('Getting all jobs and filtering by industry variations...');
          const response = await jobService.getAllJobs({ 
            page: 0, 
            size: 1000 // Get more jobs to filter from
          });
          const allJobs = response.content || response || [];
          console.log(`Total jobs in database: ${allJobs.length}`);
          
          // Debug: Log all unique industries in database
          const allIndustries = [...new Set(allJobs.map(job => job.industry).filter(Boolean))];
          console.log('All industries in database:', allIndustries);
          
          // Filter by industry variations with flexible matching
          jobsData = allJobs.filter(job => {
            if (!job.industry) {
              console.log(`Job "${job.title}" has no industry`);
              return false;
            }
            
            const jobIndustry = job.industry.toLowerCase().trim();
            const hasMatch = industryVariations.some(variation => {
              const searchIndustry = variation.toLowerCase().trim();
              const exactMatch = jobIndustry === searchIndustry;
              const containsMatch = jobIndustry.includes(searchIndustry) || searchIndustry.includes(jobIndustry);
              
              if (exactMatch || containsMatch) {
                console.log(`✓ MATCH: "${job.industry}" matches "${variation}"`);
                return true;
              }
              return false;
            });
            
            return hasMatch;
          });
          
          console.log(`Found ${jobsData.length} jobs matching industry variations:`, industryVariations);
          
          // Apply additional filters if sidebar filters are active
          jobsData = applyFilters(jobsData, filters);
          totalElements = jobsData.length;
        } else {
          // Fetch all jobs with filters
          const response = await jobService.getAllJobs({ 
            page: currentPage - 1, 
            size: 10 
          });
          const allJobs = response.content || response || [];
          
          // Apply filters to all jobs
          jobsData = applyFilters(allJobs, filters);
          totalElements = jobsData.length;
        }

        // Apply pagination to filtered results
        const startIndex = (currentPage - 1) * 10;
        const paginatedJobs = jobsData.slice(startIndex, startIndex + 10);
        
        setJobs(paginatedJobs);
        setTotalPages(Math.ceil(totalElements / 10));
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs by industry:', err);
        setError('Không thể tải danh sách việc làm. Vui lòng thử lại.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to avoid rapid API calls when filters change
    const timer = setTimeout(() => {
      fetchJobsByIndustry();
    }, 200);

    return () => clearTimeout(timer);
  }, [industrySlug, currentPage, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params with filter values
    const newSearchParams = new URLSearchParams();
    if (newFilters.industry) newSearchParams.set('industry', newFilters.industry);
    if (newFilters.location) newSearchParams.set('location', newFilters.location);
    if (newFilters.salaryRange) newSearchParams.set('salary', newFilters.salaryRange);
    newSearchParams.set('page', '1');
    
    setSearchParams(newSearchParams);
  }, [setSearchParams]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    
    // Update URL params with new page
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

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
          <FilterSidebar 
            onFilterChange={handleFilterChange} 
            initialFilters={filters}
            loading={loading}
            autoApply={false}
            hideIndustryFilter={!!industrySlug}
            hideLocationFilter={true}
            currentIndustry={industrySlug ? currentIndustryName : null}
          />
        </div>

        <div className="md:w-3/4">
          {/* Filter results summary */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              {!loading && (
                <p className="text-gray-600">
                  {jobs.length > 0 
                    ? `Hiển thị ${jobs.length} việc làm${getFilterSummary(filters, currentIndustryName) ? ` ${getFilterSummary(filters, currentIndustryName)}` : ''}`
                    : 'Không tìm thấy việc làm phù hợp'
                  }
                </p>
              )}
            </div>
            <div>
              {hasActiveFilters(filters) && !loading && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Đã áp dụng bộ lọc
                </span>
              )}
            </div>
          </div>

          {jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.071-2.328C3.125 9.878 2 7.67 2 5.259V4a1 1 0 011-1h3.93a1 1 0 01.832.445L9.828 6H16a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-1.172z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy việc làm</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters(filters)
                  ? 'Thử điều chỉnh bộ lọc để xem thêm kết quả'
                  : 'Hiện tại chưa có việc làm nào trong ngành này'
                }
              </p>
              {hasActiveFilters(filters) && (
                <button
                  onClick={() => setFilters({})}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsByIndustryPage;

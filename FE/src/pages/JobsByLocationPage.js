// src/pages/JobsByLocationPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import jobService from '../services/jobService';
import { filterJobs, getFilterSummary, hasActiveFilters } from '../utils/filterUtils';

function JobsByLocationPage({ showAlert }) {
  const navigate = useNavigate();
  const { locationSlug } = useParams();
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
    const salaryRange = searchParams.get('salary');
    const page = searchParams.get('page');

    if (salaryRange) initialFilters.salaryRange = salaryRange;
    
    setFilters(initialFilters);
    if (page) setCurrentPage(parseInt(page) || 1);
  }, [searchParams]);

  // Danh sách địa điểm phổ biến với mapping slug -> actual name
  const popularLocations = [
    { name: 'Hà Nội', slug: 'ha-noi', actualName: 'HÃ  Ná»i' },
    { name: 'TP. Hồ Chí Minh', slug: 'ho-chi-minh', actualName: 'Há» ChÃ­ Minh' },
    { name: 'Đà Nẵng', slug: 'da-nang', actualName: 'Äà Náºµng' },
    { name: 'Hải Phòng', slug: 'hai-phong', actualName: 'Háº£i PhÃ²ng' },
    { name: 'Cần Thơ', slug: 'can-tho', actualName: 'Cáº§n ThÆ¡' },
  ];

  // Function to get actual location name from slug  
  const getActualLocationName = (slug) => {
    if (!slug) return null;
    
    // Map common slugs to actual database values với nhiều biến thể tên địa điểm
    const locationMap = {
      'ha-noi': ['Ha Noi', 'Hà Nội', 'Hanoi', 'HÃ  Ná»i'],
      'ho-chi-minh': [
        'Ho Chi Minh City', 'TP. Hồ Chí Minh', 'Ho Chi Minh', 'Hồ Chí Minh', 
        'TPHCM', 'HCM', 'Saigon', 'Há» ChÃ­ Minh', 'TP.HCM', 'TP HCM',
        'Thành phố Hồ Chí Minh', 'tp ho chi minh', 'hcmc'
      ],
      'da-nang': ['Da Nang', 'Đà Nẵng', 'Danang', 'Äà Náºµng'],
      'hai-phong': ['Hai Phong', 'Hải Phòng', 'Haiphong', 'Háº£i PhÃ²ng'],
      'can-tho': ['Can Tho', 'Cần Thơ', 'Cantho', 'Cáº§n ThÆ¡']
    };
    
    return locationMap[slug] || [slug];
  };

  const handleNavigate = (routeName, params = {}) => {
    let path = '/jobs-by-location';
    if (routeName === 'jobsByLocation' && params.slug) {
      path += `/${params.slug}`;
    }
    navigate(path);
  };

  // Function to apply filters to jobs list
  const applyFilters = (jobs, filters) => {
    return filterJobs(jobs, filters);
  };

  useEffect(() => {
    const fetchJobsByLocation = async () => {
      try {
        console.log('=== JOBS BY LOCATION DEBUG ===');
        console.log(`Fetching jobs for location: ${locationSlug || 'all'} with filters:`, filters);
        setLoading(true);
        setError(null);
        
        let jobsData = [];
        let totalElements = 0;
        
        if (locationSlug) {
          // Convert slug to actual location variations for database query
          const locationVariations = getActualLocationName(locationSlug);
          console.log(`Using location variations: ${JSON.stringify(locationVariations)} for slug: ${locationSlug}`);
          
          // Fetch jobs by specific location variations
          jobsData = await jobService.getJobsByLocation(locationVariations, { 
            page: currentPage - 1, 
            size: 10 
          });
          
          // Apply additional filters if sidebar filters are active
          jobsData = applyFilters(jobsData, filters);
          totalElements = jobsData.length;
          
          console.log('Jobs data after filtering:', jobsData.length);
        } else {
          // Fetch all jobs and apply filters
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
        
        console.log(`Successfully loaded ${paginatedJobs.length} jobs for location: ${locationSlug || 'all'}`);
        if (paginatedJobs.length > 0) {
          console.log('Sample job locations:', paginatedJobs.slice(0, 3).map(job => job.location));
        }
      } catch (err) {
        console.error('Error fetching jobs by location:', err);
        setError('Không thể tải danh sách việc làm. Vui lòng thử lại.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to avoid rapid API calls when filters change
    const timer = setTimeout(() => {
      fetchJobsByLocation();
    }, 200);

    return () => clearTimeout(timer);
  }, [locationSlug, currentPage, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params with filter values
    const newSearchParams = new URLSearchParams();
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

  const currentLocationName = popularLocations.find(loc => loc.slug === locationSlug)?.name || 'Tất cả địa điểm';

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải việc làm theo địa điểm...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Việc làm tại: {currentLocationName}</h1>

      {/* Popular Location Categories */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {popularLocations.map(location => (
          <button
            key={location.slug}
            onClick={() => handleNavigate('jobsByLocation', { slug: location.slug })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                       ${locationSlug === location.slug ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {location.name}
          </button>
        ))}
        {locationSlug && (
            <button
                onClick={() => handleNavigate('jobsByLocation')}
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
            hideIndustryFilter={true}
            hideLocationFilter={!!locationSlug}
            currentIndustry={null}
            currentLocation={locationSlug ? currentLocationName : null}
          />
        </div>

        <div className="md:w-3/4">
          {/* Filter results summary */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              {!loading && (
                <p className="text-gray-600">
                  {jobs.length > 0 
                    ? `Hiển thị ${jobs.length} việc làm${getFilterSummary(filters, currentLocationName) ? ` ${getFilterSummary(filters, currentLocationName)}` : ''}`
                    : 'Không tìm thấy việc làm phù hợp'
                  }
                </p>
              )}
            </div>
            <div>
              {hasActiveFilters(filters) && !loading && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Đã áp dụng bộ lọc
                </span>
              )}
            </div>
          </div>

          {jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} navigate={navigate} showAlert={showAlert} />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Không tìm thấy việc làm</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters(filters)
                  ? 'Thử điều chỉnh bộ lọc để xem thêm kết quả'
                  : 'Hiện tại chưa có việc làm nào tại địa điểm này'
                }
              </p>
              {hasActiveFilters(filters) && (
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchParams(new URLSearchParams());
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
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

export default JobsByLocationPage;
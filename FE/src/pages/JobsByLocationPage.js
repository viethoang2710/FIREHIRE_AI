// src/pages/JobsByLocationPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import jobService from '../services/jobService';

function JobsByLocationPage() {
  const navigate = useNavigate();
  const { locationSlug } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

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
    
    // Map common slugs to actual database values (dùng values đã test thành công)
    const locationMap = {
      'ha-noi': 'Ha Noi', // Dùng "Ha Noi" vì API đã test thành công 
      'ho-chi-minh': 'Ho Chi Minh City',
      'da-nang': 'Da Nang',
      'hai-phong': 'Hai Phong', 
      'can-tho': 'Can Tho'
    };
    
    return locationMap[slug] || slug;
  };

  const handleNavigate = (routeName, params = {}) => {
    let path = '/jobs-by-location';
    if (routeName === 'jobsByLocation' && params.slug) {
      path += `/${params.slug}`;
    }
    navigate(path);
  };

  useEffect(() => {
    const fetchJobsByLocation = async () => {
      try {
        console.log(`Fetching jobs for location: ${locationSlug || 'all'} with filters:`, filters);
        setLoading(true);
        
        let jobsData = [];
        if (locationSlug) {
          // Convert slug to actual location name for database query
          const actualLocationName = getActualLocationName(locationSlug);
          console.log(`Using actual location name: ${actualLocationName} for slug: ${locationSlug}`);
          
          // Fetch jobs by specific location
          jobsData = await jobService.getJobsByLocation(actualLocationName, { 
            ...filters, 
            page: currentPage - 1, 
            size: 10 
          });
        } else {
          // Fetch all jobs with location filter from sidebar
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
        console.error('Error fetching jobs by location:', err);
        setError('Không thể tải danh sách việc làm. Vui lòng thử lại.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsByLocation();
  }, [locationSlug, currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        <div className="md:w-3/4">
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
            <p className="text-center text-gray-600">Không tìm thấy việc làm nào tại địa điểm này phù hợp với tiêu chí của bạn.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsByLocationPage;
// src/pages/JobsByLocationPage.js
import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';

// Mock data cho ví dụ
const mockJobs = [
  { id: 1, title: 'Lập trình viên Front-end', companyName: 'Tech Solutions', companyLogo: 'https://via.placeholder.com/50/FF0000/FFFFFF?text=TS', salary: '15-25 triệu', location: 'Hà Nội', experience: '3 năm', deadline: '01/07/2025', tags: ['React', 'JavaScript'] },
  { id: 2, title: 'Nhân viên Hành chính', companyName: 'Global Services', companyLogo: 'https://via.placeholder.com/50/0000FF/FFFFFF?text=GS', salary: '7-12 triệu', location: 'TP.HCM', experience: '1 năm', deadline: '29/06/2025', tags: ['Hành chính', 'Văn phòng'] },
  { id: 3, title: 'Kỹ sư cầu nối', companyName: 'Nihon Tech', companyLogo: 'https://via.placeholder.com/50/008000/FFFFFF?text=NT', salary: '25-40 triệu', location: 'Đà Nẵng', experience: '4 năm', deadline: '03/07/2025', tags: ['Cầu nối', 'Nhật Bản'] },
  { id: 4, title: 'Marketing Executive', companyName: 'Creative Agency', companyLogo: 'https://via.placeholder.com/50/FFFF00/000000?text=CA', salary: '9-16 triệu', location: 'Hà Nội', experience: '2 năm', deadline: '08/07/2025', tags: ['Marketing', 'Digital'] },
];


function JobsByLocationPage({ navigate, locationSlug }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [filters, setFilters] = useState({});

  const popularLocations = [
    { name: 'Hà Nội', slug: 'ha-noi' },
    { name: 'TP. Hồ Chí Minh', slug: 'ho-chi-minh' },
    { name: 'Đà Nẵng', slug: 'da-nang' },
    { name: 'Hải Phòng', slug: 'hai-phong' },
    { name: 'Cần Thơ', slug: 'can-tho' },
  ];

  useEffect(() => {
    console.log(`Fetching jobs for location: ${locationSlug || 'all'} with filters:`, filters);

    setLoading(true);
    setTimeout(() => {
      let filteredJobs = mockJobs;
      if (locationSlug) {
        // Giả lập lọc theo địa điểm
        filteredJobs = mockJobs.filter(job => job.location.toLowerCase().includes(locationSlug.replace(/-/g, ' ')));
      }

      // Áp dụng các bộ lọc từ sidebar
      if (filters.industries && filters.industries.length > 0) {
        // Logic lọc theo ngành nghề từ sidebar
      }

      setJobs(filteredJobs);
      setTotalPages(Math.ceil(filteredJobs.length / 5));
      setLoading(false);
    }, 500);
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
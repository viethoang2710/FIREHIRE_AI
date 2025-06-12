// src/pages/JobsByIndustryPage.js
import React, { useState, useEffect } from 'react';
// Nếu bạn muốn dùng slug trong URL như /viec-lam-theo-nganh-nghe/it, bạn cần react-router-dom
// Hiện tại, với hệ thống navigate thủ công, bạn sẽ nhận slug qua props nếu muốn.
// import { useParams } from 'react-router-dom'; // Chỉ dùng nếu có react-router-dom

import JobCard from '../components/JobCard'; // Giả sử đã có
import FilterSidebar from '../components/FilterSidebar'; // Giả sử đã có
import Pagination from '../components/Pagination'; // Giả sử đã có

// Mock data cho ví dụ
const mockJobs = [
  { id: 1, title: 'Lập trình viên Java Senior', companyName: 'FPT Software', companyLogo: 'https://via.placeholder.com/50/FF0000/FFFFFF?text=FPT', salary: '20-35 triệu', location: 'Hà Nội', experience: '5 năm', deadline: '30/06/2025', tags: ['Java', 'Spring Boot', 'Backend', 'Hot'] },
  { id: 2, title: 'Chuyên viên Digital Marketing', companyName: 'VNG Corp', companyLogo: 'https://via.placeholder.com/50/0000FF/FFFFFF?text=VNG', salary: '10-18 triệu', location: 'TP.HCM', experience: '2 năm', deadline: '28/06/2025', tags: ['Marketing', 'SEO', 'Content'] },
  { id: 3, title: 'Kế toán tổng hợp', companyName: 'Viettel', companyLogo: 'https://via.placeholder.com/50/008000/FFFFFF?text=VT', salary: '8-15 triệu', location: 'Đà Nẵng', experience: '3 năm', deadline: '05/07/2025', tags: ['Kế toán', 'Tài chính'] },
  { id: 4, title: 'Thiết kế đồ họa', companyName: 'Game Studio', companyLogo: 'https://via.placeholder.com/50/FFFF00/000000?text=GS', salary: '9-16 triệu', location: 'Hà Nội', experience: '1 năm', deadline: '10/07/2025', tags: ['Thiết kế', 'Graphic Design'] },
];

function JobsByIndustryPage({ navigate, industrySlug }) {
  // const { industrySlug } = useParams(); // Dùng nếu có react-router-dom
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Giả định tổng số trang
  const [filters, setFilters] = useState({});

  // Danh sách ngành nghề phổ biến để hiển thị
  const popularIndustries = [
    { name: 'Công nghệ thông tin', slug: 'it' },
    { name: 'Marketing & Truyền thông', slug: 'marketing' },
    { name: 'Kinh doanh & Bán hàng', slug: 'sales' },
    { name: 'Ngân hàng & Tài chính', slug: 'finance' },
    { name: 'Nhân sự', slug: 'hr' },
    { name: 'Xây dựng', slug: 'construction' },
  ];

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API ở đây để lấy dữ liệu việc làm theo ngành nghề
    // Ví dụ: fetchJobsByIndustry(industrySlug, currentPage, filters);
    console.log(`Fetching jobs for industry: ${industrySlug || 'all'} with filters:`, filters);

    // Mô phỏng API call
    setLoading(true);
    setTimeout(() => {
      let filteredJobs = mockJobs;
      if (industrySlug) {
        // Đây là nơi bạn sẽ lọc dữ liệu thực tế từ API response
        // Mocking: Giả sử industrySlug "it" chỉ lọc một số job cụ thể
        if (industrySlug === 'it') {
            filteredJobs = mockJobs.filter(job => job.tags.includes('Java') || job.tags.includes('Backend'));
        } else if (industrySlug === 'marketing') {
            filteredJobs = mockJobs.filter(job => job.tags.includes('Marketing'));
        }
        // Thêm logic lọc theo các industrySlug khác
      }

      // Áp dụng các bộ lọc từ sidebar
      // Ví dụ: Lọc theo địa điểm
      if (filters.locations && filters.locations.length > 0) {
        filteredJobs = filteredJobs.filter(job => filters.locations.some(loc => job.location.includes(loc)));
      }
      // Thêm các logic lọc khác (mức lương, kinh nghiệm...)

      setJobs(filteredJobs); // Hoặc một phần của filteredJobs dựa trên pagination
      setTotalPages(Math.ceil(filteredJobs.length / 5)); // Ví dụ: 5 việc làm mỗi trang
      setLoading(false);
    }, 500);
  }, [industrySlug, currentPage, filters]); // Phụ thuộc vào slug, trang hiện tại và bộ lọc

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset về trang đầu khi áp dụng bộ lọc mới
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentIndustryName = popularIndustries.find(ind => ind.slug === industrySlug)?.name || 'Tất cả ngành nghề';

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải việc làm theo ngành nghề...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Việc làm ngành nghề: {currentIndustryName}</h1>

      {/* Popular Industry Categories */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {popularIndustries.map(industry => (
          <button
            key={industry.slug}
            onClick={() => handleNavigate('jobsByIndustry', { slug: industry.slug })} // Sử dụng handleNavigate
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                       ${industrySlug === industry.slug ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {industry.name}
          </button>
        ))}
        {industrySlug && ( // Nút "Xem tất cả" nếu đang lọc theo một ngành cụ thể
             <button
                onClick={() => handleNavigate('jobsByIndustry')} // Về trang tất cả ngành nghề
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
                Xem tất cả
            </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="md:w-1/4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Job Listings */}
        <div className="md:w-3/4">
          {jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} navigate={navigate} /> // Truyền navigate xuống JobCard nếu cần
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-center text-gray-600">Không tìm thấy việc làm nào trong ngành nghề này phù hợp với tiêu chí của bạn.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsByIndustryPage;
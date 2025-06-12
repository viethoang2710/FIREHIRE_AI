// src/pages/CompaniesPage.js
import React, { useState, useEffect } from 'react';
import CompanyCard from '../components/CompanyCard'; // Giả sử đã có
import Pagination from '../components/Pagination'; // Giả sử đã có
import SearchBar from '../components/SearchBar'; // Có thể dùng lại SearchBar chung hoặc tạo riêng

// Mock data cho ví dụ
const mockCompanies = [
  { id: 101, name: 'FPT Software', logo: 'https://via.placeholder.com/80/FF0000/FFFFFF?text=FPT', address: 'Hà Nội, TP.HCM, Đà Nẵng', industry: 'Công nghệ thông tin', size: '10,000+ nhân sự', jobsCount: 150 },
  { id: 102, name: 'VNG Corporation', logo: 'https://via.placeholder.com/80/0000FF/FFFFFF?text=VNG', address: 'TP.HCM, Hà Nội', industry: 'Internet, Game, Công nghệ', size: '1,000 - 5,000 nhân sự', jobsCount: 80 },
  { id: 103, name: 'Viettel Group', logo: 'https://via.placeholder.com/80/008000/FFFFFF?text=VT', address: 'Toàn quốc', industry: 'Viễn thông, Công nghệ cao', size: '50,000+ nhân sự', jobsCount: 200 },
  { id: 104, name: 'Techcombank', logo: 'https://via.placeholder.com/80/800080/FFFFFF?text=TCB', address: 'Hà Nội, TP.HCM', industry: 'Ngân hàng, Tài chính', size: '5,000 - 10,000 nhân sự', jobsCount: 50 },
  { id: 105, name: 'VinGroup', logo: 'https://via.placeholder.com/80/FFA500/FFFFFF?text=VG', address: 'Toàn quốc', industry: 'Đa ngành', size: '50,000+ nhân sự', jobsCount: 300 },
];

function CompaniesPage({ navigate }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Giả định
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    // Fetch companies data
    console.log('Fetching companies with params:', searchParams);
    setLoading(true);
    setTimeout(() => {
      let filteredCompanies = mockCompanies;
      if (searchParams.keyword) {
        filteredCompanies = filteredCompanies.filter(company =>
          company.name.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
          company.industry.toLowerCase().includes(searchParams.keyword.toLowerCase())
        );
      }
      setCompanies(filteredCompanies);
      setTotalPages(Math.ceil(filteredCompanies.length / 9)); // Giả sử 9 công ty mỗi trang
      setLoading(false);
    }, 500);
  }, [currentPage, searchParams]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải danh sách công ty...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Công ty tuyển dụng hàng đầu</h1>
      
      {/* Search Bar for Companies */}
      <div className="mb-8">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Tìm kiếm công ty theo tên, ngành nghề..." 
          showIndustry={false} // Ẩn ô chọn ngành nghề nếu không cần
          showLocation={false} // Ẩn ô chọn địa điểm nếu không cần
        />
      </div>

      {companies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => (
              <CompanyCard key={company.id} company={company} navigate={navigate} /> // Truyền navigate xuống
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center text-gray-600">Không tìm thấy công ty nào phù hợp.</p>
      )}
    </div>
  );
}

export default CompaniesPage;
// src/components/FilterSidebar.js
import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({ industry, location, salaryRange });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold mb-4">Bộ lọc</h3>
      <div className="mb-4">
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Ngành nghề</label>
        <select
          id="industry"
          name="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Tất cả ngành nghề</option>
          <option value="IT">Công nghệ thông tin</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Tài chính</option>
          {/* Thêm các option khác */}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Nhập địa điểm"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Mức lương</label>
        <select
          id="salary"
          name="salary"
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Bất kỳ</option>
          <option value="under_5m">Dưới 5 triệu</option>
          <option value="5m_10m">5 - 10 triệu</option>
          <option value="10m_20m">10 - 20 triệu</option>
          <option value="over_20m">Trên 20 triệu</option>
          {/* Thêm các option khác */}
        </select>
      </div>

      <button
        onClick={handleApplyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  );
};

export default FilterSidebar;
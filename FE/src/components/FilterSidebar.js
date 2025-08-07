// src/components/FilterSidebar.js
import React, { useState, useEffect, useCallback } from 'react';

const FilterSidebar = ({ onFilterChange, initialFilters = {}, loading = false, autoApply = false, hideIndustryFilter = false, hideLocationFilter = false, currentIndustry = null, currentLocation = null }) => {
  const [industry, setIndustry] = useState(initialFilters.industry || '');
  const [location, setLocation] = useState(initialFilters.location || '');
  const [salaryRange, setSalaryRange] = useState(initialFilters.salaryRange || '');
  const [isApplying, setIsApplying] = useState(false);

  // Update local state when initialFilters change
  useEffect(() => {
    setIndustry(initialFilters.industry || '');
    setLocation(initialFilters.location || '');
    setSalaryRange(initialFilters.salaryRange || '');
  }, [initialFilters]);

  // Industries list matching the ones in JobsByIndustryPage
  const industries = [
    { value: 'IT', label: 'Công nghệ thông tin' },
    { value: 'Marketing', label: 'Marketing & Truyền thông' },
    { value: 'Kinh doanh', label: 'Kinh doanh & Bán hàng' },
    { value: 'Tài chính', label: 'Ngân hàng & Tài chính' },
    { value: 'Nhân sự', label: 'Nhân sự' },
    { value: 'Xây dựng', label: 'Xây dựng' },
    { value: 'Software Testing', label: 'Software Testing' },
    { value: 'Thiết kế', label: 'Thiết kế' },
    { value: 'Kế toán', label: 'Kế toán' },
    { value: 'Y tế', label: 'Y tế' },
    { value: 'Giáo dục', label: 'Giáo dục' },
    { value: 'Du lịch', label: 'Du lịch & Khách sạn' }
  ];

  // Popular locations in Vietnam
  const popularLocations = [
    'Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Biên Hòa',
    'Nha Trang',
    'Huế',
    'Vũng Tàu'
  ];

  // Auto-apply filters when any value changes (with debounce and dependency optimization)
  useEffect(() => {
    // Only auto-apply if autoApply is enabled
    if (!autoApply) return;
    
    // Don't trigger on initial load if all values are empty
    if ((!industry || hideIndustryFilter) && (!location || hideLocationFilter) && !salaryRange) return;

    const timer = setTimeout(() => {
      const filters = {};
      // Only include industry filter if it's not hidden
      if (industry && !hideIndustryFilter) filters.industry = industry;
      // Only include location filter if it's not hidden
      if (location && !hideLocationFilter) filters.location = location;
      if (salaryRange) filters.salaryRange = salaryRange;
      
      if (onFilterChange) {
        setIsApplying(true);
        onFilterChange(filters);
        setTimeout(() => setIsApplying(false), 300);
      }
    }, 800); // Increase debounce time more to reduce flickering

    return () => clearTimeout(timer);
  }, [industry, location, salaryRange, autoApply, hideIndustryFilter, hideLocationFilter]); // Add hideLocationFilter to dependencies

  const handleApplyFilters = useCallback(() => {
    const filters = {};
    // Only include industry filter if it's not hidden
    if (industry && !hideIndustryFilter) filters.industry = industry;
    // Only include location filter if it's not hidden
    if (location && !hideLocationFilter) filters.location = location;
    if (salaryRange) filters.salaryRange = salaryRange;
    
    if (onFilterChange) {
      setIsApplying(true);
      onFilterChange(filters);
      setTimeout(() => setIsApplying(false), 300);
    }
  }, [industry, location, salaryRange, onFilterChange, hideIndustryFilter, hideLocationFilter]);

  const handleResetFilters = useCallback(() => {
    setIndustry('');
    setLocation('');
    setSalaryRange('');
    
    // Trigger filter change với empty filters
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Bộ lọc</h3>
      
      {/* Show current industry if filtering by industry */}
      {hideIndustryFilter && currentIndustry && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Đang lọc theo ngành nghề:</p>
              <p className="text-sm text-blue-700">{currentIndustry}</p>
            </div>
          </div>
        </div>
      )}

      {/* Show current location if filtering by location */}
      {hideLocationFilter && currentLocation && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800">Đang lọc theo địa điểm:</p>
              <p className="text-sm text-green-700">{currentLocation}</p>
            </div>
          </div>
        </div>
      )}
      
      {!hideIndustryFilter && (
        <div className="mb-4">
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            Ngành nghề
          </label>
          <select
            id="industry"
            name="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả ngành nghề</option>
            {industries.map(ind => (
              <option key={ind.value} value={ind.value}>
                {ind.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {!hideLocationFilter && (
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Địa điểm
          </label>
          <div className="relative">
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nhập địa điểm..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              list="locations"
            />
            <datalist id="locations">
              {popularLocations.map(loc => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
          Mức lương
        </label>
        <select
          id="salary"
          name="salary"
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Bất kỳ</option>
          <option value="under_5m">Dưới 5 triệu</option>
          <option value="5m_10m">5 - 10 triệu</option>
          <option value="10m_20m">10 - 20 triệu</option>
          <option value="over_20m">Trên 20 triệu</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleApplyFilters}
          disabled={loading || isApplying}
          className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center ${
            loading || isApplying 
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading || isApplying ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang áp dụng...
            </>
          ) : (
            'Áp dụng bộ lọc'
          )}
        </button>
        
        {((!hideIndustryFilter && industry) || (!hideLocationFilter && location) || salaryRange) && (
          <button
            onClick={handleResetFilters}
            disabled={loading || isApplying}
            className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
              loading || isApplying
                ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Filter summary */}
      {((!hideIndustryFilter && industry) || (!hideLocationFilter && location) || salaryRange) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Bộ lọc đang áp dụng:</h4>
          <div className="space-y-1">
            {!hideIndustryFilter && industry && (
              <div className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-1">
                Ngành: {industries.find(ind => ind.value === industry)?.label}
                <button
                  onClick={() => setIndustry('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {!hideLocationFilter && location && (
              <div className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-1">
                Nơi: {location}
                <button
                  onClick={() => setLocation('')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            )}
            {salaryRange && (
              <div className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2 mb-1">
                Lương: {salaryRange === 'under_5m' ? 'Dưới 5 triệu' : 
                        salaryRange === '5m_10m' ? '5-10 triệu' :
                        salaryRange === '10m_20m' ? '10-20 triệu' : 'Trên 20 triệu'}
                <button
                  onClick={() => setSalaryRange('')}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
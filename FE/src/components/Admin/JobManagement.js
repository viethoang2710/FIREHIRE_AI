import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả vai trò');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 items per page to demonstrate pagination
  
  // Dropdown menu state
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Job details modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  
  // Applications modal state
  const [showApplications, setShowApplications] = useState(false);
  const [selectedJobApplications, setSelectedJobApplications] = useState(null);
  const [applicationsData, setApplicationsData] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filterJobs = () => {
    let filtered = [...jobs];
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'Tất cả vai trò') {
      filtered = filtered.filter(job => {
        if (statusFilter === 'ACTIVE') return job.status === 'ACTIVE';
        if (statusFilter === 'INACTIVE') return job.status === 'INACTIVE';
        if (statusFilter === 'PENDING') return job.status === 'PENDING';
        return true;
      });
    }
    
    setFilteredJobs(filtered);
  };

  // Load applications for a specific job
  const loadApplications = async (jobId) => {
    setLoadingApplications(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/applications/job/${jobId}`);
      console.log('Applications API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        setApplicationsData(response.data.data);
      } else {
        setApplicationsData([]);
        console.log('No applications found or API error:', response.data.message);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplicationsData([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  const loadJobs = async () => {
    console.log('🔄 Starting to load jobs...');
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:8080/api/jobs');
      console.log('✅ API Response:', response.data);
      
      // Handle response format: {"success":true,"message":null,"data":[...]}
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setJobs(response.data.data);
        console.log('✅ Jobs loaded successfully:', response.data.data.length, 'jobs');
      } else if (Array.isArray(response.data)) {
        setJobs(response.data);
        console.log('✅ Jobs loaded as direct array:', response.data.length, 'jobs');
      } else {
        console.log('❌ Unexpected response format:', response.data);
        setJobs([]);
      }
    } catch (error) {
      console.error('❌ Error loading jobs:', error);
      setError(error.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">ACTIVE</span>;
      case 'INACTIVE':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">INACTIVE</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">PENDING</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{status}</span>;
    }
  };

  const getApplicationStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Chờ xét</span>;
      case 'viewed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Đã xem</span>;
      case 'accepted':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Đã duyệt</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Từ chối</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{status}</span>;
    }
  };

  // Calculate status counts from applications data
  const getStatusCounts = () => {
    const counts = {
      accepted: 0,
      pending: 0,
      rejected: 0,
      viewed: 0,
      total: applicationsData.length
    };

    applicationsData.forEach(app => {
      if (counts.hasOwnProperty(app.status)) {
        counts[app.status]++;
      }
    });

    return counts;
  };

  // Pagination calculations
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Dropdown functions
  const toggleDropdown = (jobId) => {
    setOpenDropdown(openDropdown === jobId ? null : jobId);
  };

  // Admin actions
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
    setOpenDropdown(null);
  };

  const closeJobDetails = () => {
    setShowJobDetails(false);
    setSelectedJob(null);
  };

  const handleViewApplications = (job) => {
    setSelectedJobApplications(job);
    setShowApplications(true);
    setOpenDropdown(null);
    // Load applications data from database
    loadApplications(job.jobId || job.id);
  };

  const closeApplications = () => {
    setShowApplications(false);
    setSelectedJobApplications(null);
    setApplicationsData([]); // Clear applications data
  };

  const handleChangeStatus = (job, newStatus) => {
    const confirmMessage = `Bạn có chắc chắn muốn ${newStatus === 'ACTIVE' ? 'kích hoạt' : newStatus === 'INACTIVE' ? 'tạm dừng' : 'thay đổi trạng thái'} công việc "${job.title}"?`;
    
    if (window.confirm(confirmMessage)) {
      // Update job status
      setJobs(prevJobs => 
        prevJobs.map(j => 
          j.jobId === job.jobId ? { ...j, status: newStatus } : j
        )
      );
      // Remove alert and just update silently
    }
    setOpenDropdown(null);
  };

  const handleDeleteJob = (job) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa công việc "${job.title}"? Hành động này không thể hoàn tác.`)) {
      setJobs(prevJobs => prevJobs.filter(j => j.jobId !== job.jobId));
      // Remove alert and just update silently
    }
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Lỗi: {error}
          </div>
          <button 
            onClick={loadJobs}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Quản lý công việc</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={loadJobs}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm mới
              </button>
              <div className="text-sm text-gray-600">
                Tổng: {jobs.length} công việc
                <span className="ml-2 text-green-600">Từ Database</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Search and Filter Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Quản lý công việc</h2>
            </div>
            
            <div className="mt-4 flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên công việc, công ty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Tất cả vai trò">Tất cả trạng thái</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CÔNG VIỆC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CÔNG TY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TRẠNG THÁI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LƯƠNG
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NGÀY TẠO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Không có công việc nào
                    </td>
                  </tr>
                ) : (
                  currentJobs.map((job) => (
                    <tr key={job.jobId || job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.location}</div>
                          <div className="text-sm text-gray-500">{job.jobType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{job.companyName || 'Không có tên'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(job.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{job.salary || 'Thỏa thuận'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'Invalid Date'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-1 bg-blue-500 rounded"></div>
                          <span className="text-sm text-gray-500">%</span>
                          <div className="relative">
                            <button 
                              className="text-gray-400 hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(job.jobId || job.id);
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openDropdown === (job.jobId || job.id) && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleViewDetails(job)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Xem chi tiết
                                  </button>
                                  
                                  <button
                                    onClick={() => handleViewApplications(job)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Xem ứng viên ({job.applicationCount || 0})
                                  </button>
                                  
                                  <hr className="my-1" />
                                  
                                  {job.status !== 'ACTIVE' && (
                                    <button
                                      onClick={() => handleChangeStatus(job, 'ACTIVE')}
                                      className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 w-full text-left"
                                    >
                                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      Kích hoạt
                                    </button>
                                  )}
                                  
                                  {job.status !== 'INACTIVE' && (
                                    <button
                                      onClick={() => handleChangeStatus(job, 'INACTIVE')}
                                      className="flex items-center px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 w-full text-left"
                                    >
                                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      Tạm dừng
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => handleDeleteJob(job)}
                                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                  >
                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Xóa công việc
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination - Always show when there are jobs */}
          {totalItems > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Hiển thị {startIndex + 1} - {Math.min(endIndex, totalItems)} của {totalItems} kết quả
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Trước
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-8 h-8 text-sm rounded ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Chi tiết công việc</h2>
              <button
                onClick={closeJobDetails}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ID công việc</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.jobId || selectedJob.id || 'Không có ID'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tên công việc</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.title || 'Không có tiêu đề'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Công ty</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.companyName || 'Không có tên công ty'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.location || 'Không có địa điểm'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Loại công việc</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.jobType || 'Không có loại công việc'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mức lương</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.salary || 'Thỏa thuận'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <div className="mt-1">
                          {getStatusBadge(selectedJob.status)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Kinh nghiệm yêu cầu</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.experienceLevel || 'Không có yêu cầu kinh nghiệm'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cấp độ công việc</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.jobLevel || 'Không có cấp độ'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Additional Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin chi tiết</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày đăng</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString('vi-VN') : 'Không có thông tin'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày cập nhật</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedJob.updatedAt ? new Date(selectedJob.updatedAt).toLocaleDateString('vi-VN') : 'Không có thông tin'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Hạn ứng tuyển</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedJob.applicationDeadline ? new Date(selectedJob.applicationDeadline).toLocaleDateString('vi-VN') : 'Không có hạn chót'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng ứng viên</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.applicationCount || 0} ứng viên</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng cần tuyển</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.numberOfPositions || 'Không giới hạn'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngành nghề</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.industry || selectedJob.category || 'Không có thông tin ngành'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Kỹ năng yêu cầu</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.requiredSkills || 'Không có kỹ năng cụ thể'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Giới tính yêu cầu</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedJob.genderRequirement || 'Không yêu cầu'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Mô tả công việc</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedJob.description || selectedJob.jobDescription || 'Không có mô tả công việc'}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yêu cầu công việc</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedJob.requirements || selectedJob.jobRequirements || 'Không có yêu cầu cụ thể'}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quyền lợi</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedJob.benefits || selectedJob.jobBenefits || 'Không có thông tin về quyền lợi'}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin bổ sung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <p className="text-sm text-gray-900">{selectedJob.contactEmail || 'Không có email liên hệ'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <p className="text-sm text-gray-900">{selectedJob.contactPhone || 'Không có số điện thoại'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website công ty</label>
                    <p className="text-sm text-gray-900">{selectedJob.companyWebsite || 'Không có website'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ công ty</label>
                    <p className="text-sm text-gray-900">{selectedJob.companyAddress || selectedJob.address || 'Không có địa chỉ'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeJobDetails}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đóng
              </button>
              <button
                onClick={() => handleViewApplications(selectedJob)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Xem ứng viên ({selectedJob.applicationCount || 0})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {showApplications && selectedJobApplications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Danh sách ứng viên</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Công việc: {selectedJobApplications.title} - {selectedJobApplications.companyName}
                </p>
              </div>
              <button
                onClick={closeApplications}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Applications Content */}
            <div className="px-6 py-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-gray-900">
                    Tổng số ứng viên: {getStatusCounts().total}
                  </span>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Đã duyệt: {getStatusCounts().accepted}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                      Chờ xét: {getStatusCounts().pending}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      Từ chối: {getStatusCounts().rejected}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Đã xem: {getStatusCounts().viewed}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Xuất Excel
                </button>
              </div>

              {/* Applications Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ứng viên
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Điện thoại
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ngày ứng tuyển
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingApplications ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          <div className="flex justify-center items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tải danh sách ứng viên...
                          </div>
                        </td>
                      </tr>
                    ) : applicationsData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          Chưa có ứng viên nào ứng tuyển cho công việc này
                        </td>
                      </tr>
                    ) : (
                      applicationsData.map((application) => (
                        <tr key={application.applicationId} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {(application.candidateName || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {application.candidateName || 'Ứng viên ẩn danh'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  CV: {application.cvTitle || 'Không có tiêu đề'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {application.candidateEmail || 'Không có email'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {application.candidatePhone || 'Không có SĐT'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString('vi-VN') : 'Không có ngày'}
                          </td>
                          <td className="px-4 py-4">
                            {getApplicationStatusBadge(application.status)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                Xem CV
                              </button>
                              {application.status !== 'accepted' && (
                                <button className="text-green-600 hover:text-green-800 text-sm">
                                  Phê duyệt
                                </button>
                              )}
                              {application.status !== 'rejected' && (
                                <button className="text-red-600 hover:text-red-800 text-sm">
                                  Từ chối
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeApplications}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đóng
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Thông báo ứng viên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;

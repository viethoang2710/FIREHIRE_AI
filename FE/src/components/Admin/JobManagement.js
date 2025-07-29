import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Building, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import api from '../../services/api';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Mock data for development
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Vietnam',
      companyLogo: 'https://via.placeholder.com/50',
      location: 'Hà Nội',
      salary: '20-35 triệu',
      jobType: 'FULL_TIME',
      experience: '3-5 năm',
      category: 'Công nghệ thông tin',
      status: 'PENDING',
      description: 'Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm với React, Vue.js để tham gia đội ngũ phát triển sản phẩm.',
      requirements: ['React.js, Vue.js', 'JavaScript ES6+', 'CSS/SCSS', 'Git'],
      benefits: ['Lương thưởng hấp dẫn', 'Bảo hiểm y tế', 'Du lịch công ty'],
      deadline: '2024-02-15',
      createdAt: '2024-01-15',
      applicantCount: 25,
      views: 150
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'Global Marketing Solutions',
      companyLogo: 'https://via.placeholder.com/50',
      location: 'TP.HCM',
      salary: '15-25 triệu',
      jobType: 'FULL_TIME',
      experience: '2-4 năm',
      category: 'Marketing',
      status: 'APPROVED',
      description: 'Tìm kiếm Marketing Manager để quản lý các chiến dịch marketing tổng thể của công ty.',
      requirements: ['Kinh nghiệm Digital Marketing', 'Google Ads, Facebook Ads', 'Phân tích dữ liệu'],
      benefits: ['Môi trường năng động', 'Thưởng theo KPI', 'Đào tạo chuyên sâu'],
      deadline: '2024-02-20',
      createdAt: '2024-01-10',
      applicantCount: 18,
      views: 89
    },
    {
      id: 3,
      title: 'Data Analyst',
      company: 'Analytics Pro',
      companyLogo: 'https://via.placeholder.com/50',
      location: 'Đà Nẵng',
      salary: '12-18 triệu',
      jobType: 'FULL_TIME',
      experience: '1-3 năm',
      category: 'Công nghệ thông tin',
      status: 'REJECTED',
      description: 'Vị trí Data Analyst phân tích dữ liệu kinh doanh và tạo báo cáo cho ban lãnh đạo.',
      requirements: ['SQL, Python', 'Excel nâng cao', 'Power BI hoặc Tableau'],
      benefits: ['Lương cạnh tranh', 'Làm việc hybrid', 'Học hỏi công nghệ mới'],
      deadline: '2024-02-10',
      createdAt: '2024-01-08',
      applicantCount: 12,
      views: 76,
      rejectionReason: 'Thông tin công ty không đầy đủ'
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'Creative Studio',
      companyLogo: 'https://via.placeholder.com/50',
      location: 'Hà Nội',
      salary: '10-20 triệu',
      jobType: 'PART_TIME',
      experience: '1-2 năm',
      category: 'Thiết kế',
      status: 'PENDING',
      description: 'Thiết kế giao diện người dùng cho các ứng dụng web và mobile.',
      requirements: ['Figma, Adobe XD', 'Hiểu về UX principles', 'Portfolio mạnh'],
      benefits: ['Flexible working hours', 'Creative environment', 'Modern tools'],
      deadline: '2024-02-25',
      createdAt: '2024-01-20',
      applicantCount: 8,
      views: 45
    },
    {
      id: 5,
      title: 'Sales Executive',
      company: 'Sales Solutions Inc',
      companyLogo: 'https://via.placeholder.com/50',
      location: 'TP.HCM',
      salary: '8-15 triệu + hoa hồng',
      jobType: 'FULL_TIME',
      experience: 'Không yêu cầu',
      category: 'Kinh doanh',
      status: 'APPROVED',
      description: 'Nhân viên kinh doanh phụ trách tìm kiếm và chăm sóc khách hàng.',
      requirements: ['Kỹ năng giao tiếp tốt', 'Chăm chỉ, năng động', 'Tiếng Anh cơ bản'],
      benefits: ['Hoa hồng không giới hạn', 'Đào tạo miễn phí', 'Cơ hội thăng tiến'],
      deadline: '2024-03-01',
      createdAt: '2024-01-18',
      applicantCount: 32,
      views: 198
    }
  ];

  useEffect(() => {
    loadJobs();
    loadStats();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.get('/admin/jobs');
      // setJobs(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setJobs(mockJobs);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs(mockJobs);
      setLoading(false);
    }
  };

  const loadStats = () => {
    const stats = mockJobs.reduce((acc, job) => {
      acc.total++;
      acc[job.status.toLowerCase()]++;
      return acc;
    }, { total: 0, pending: 0, approved: 0, rejected: 0 });
    
    setStats(stats);
  };

  const handleJobAction = async (jobId, action, reason = '') => {
    try {
      const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
      // await api.put(`/admin/jobs/${jobId}/status`, { status: newStatus, reason });
      
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, status: newStatus, ...(reason && { rejectionReason: reason }) }
          : job
      ));
      
      loadStats();
      setShowJobModal(false);
      // Show success notification
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  // Filter and search logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || job.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const getStatusLabel = (status) => {
    const statusLabels = {
      'PENDING': 'Chờ duyệt',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Từ chối',
      'EXPIRED': 'Hết hạn'
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'EXPIRED': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={16} className="text-yellow-600" />;
      case 'APPROVED':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'REJECTED':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng công việc</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Từ chối</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Management Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý công việc</h2>
          <div className="text-sm text-gray-600">
            Tổng: {filteredJobs.length} công việc
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên công việc hoặc công ty..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Công nghệ thông tin">Công nghệ thông tin</option>
            <option value="Marketing">Marketing</option>
            <option value="Thiết kế">Thiết kế</option>
            <option value="Kinh doanh">Kinh doanh</option>
          </select>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công việc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công ty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ứng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạn nộp
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin size={14} className="mr-1" />
                        {job.location}
                        <span className="ml-2 text-green-600 font-medium">{job.salary}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {job.category} • {job.jobType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={job.companyLogo} alt="" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{job.company}</div>
                        <div className="text-sm text-gray-500">{job.views} lượt xem</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(job.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users size={16} className="mr-1" />
                      {job.applicantCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {new Date(job.deadline).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowJobModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Eye size={16} className="mr-1" />
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị {indexOfFirstJob + 1} - {Math.min(indexOfLastJob, filteredJobs.length)} của {filteredJobs.length} kết quả
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Chi tiết công việc</h3>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Details */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedJob.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span className="flex items-center">
                      <Building size={16} className="mr-1" />
                      {selectedJob.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      {selectedJob.salary}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Mô tả công việc:</h5>
                  <p className="text-gray-600">{selectedJob.description}</p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Yêu cầu:</h5>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Quyền lợi:</h5>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                {selectedJob.status === 'REJECTED' && selectedJob.rejectionReason && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-2">Lý do từ chối:</h5>
                    <p className="text-red-600">{selectedJob.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Job Meta Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-3">Thông tin chung</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedJob.status)}`}>
                        {getStatusLabel(selectedJob.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-medium">{selectedJob.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại công việc:</span>
                      <span className="font-medium">{selectedJob.jobType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kinh nghiệm:</span>
                      <span className="font-medium">{selectedJob.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hạn nộp:</span>
                      <span className="font-medium">{new Date(selectedJob.deadline).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đăng:</span>
                      <span className="font-medium">{new Date(selectedJob.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-3">Số liệu</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Lượt xem:</span>
                      <span className="font-medium text-blue-800">{selectedJob.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Ứng viên:</span>
                      <span className="font-medium text-blue-800">{selectedJob.applicantCount}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedJob.status === 'PENDING' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleJobAction(selectedJob.id, 'approve')}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Duyệt công việc
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Nhập lý do từ chối:');
                        if (reason) {
                          handleJobAction(selectedJob.id, 'reject', reason);
                        }
                      }}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
                    >
                      <XCircle size={18} className="mr-2" />
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowJobModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;

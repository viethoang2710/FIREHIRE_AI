// src/pages/JobManagementPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, MapPin, DollarSign, Eye, Edit, Trash2, Plus, Search } from 'lucide-react';

const JobManagementPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data cho demo
  const mockJobs = [
    {
      id: 1,
      title: "Kỹ sư dữ liệu (Junior Data Engineer)",
      companyName: "Tech Solutions Vietnam",
      location: "Hà Nội",
      salary: "15-25 triệu VNĐ",
      postDate: "2025-08-01",
      deadline: "2025-08-30",
      status: "ACTIVE",
      applicationsCount: 3,
      viewsCount: 45,
      description: "Tìm kiếm kỹ sư dữ liệu junior có kinh nghiệm với Python, SQL..."
    },
    {
      id: 2,
      title: "Frontend Developer (React)",
      companyName: "Tech Solutions Vietnam", 
      location: "TP.HCM",
      salary: "18-30 triệu VNĐ",
      postDate: "2025-07-28",
      deadline: "2025-08-25",
      status: "ACTIVE",
      applicationsCount: 7,
      viewsCount: 82,
      description: "Cần developer React có kinh nghiệm từ 2 năm trở lên..."
    },
    {
      id: 3,
      title: "Marketing Specialist",
      companyName: "Tech Solutions Vietnam",
      location: "Đà Nẵng", 
      salary: "12-20 triệu VNĐ",
      postDate: "2025-07-20",
      deadline: "2025-08-15",
      status: "EXPIRED",
      applicationsCount: 12,
      viewsCount: 156,
      description: "Tìm kiếm chuyên viên marketing digital có kinh nghiệm..."
    },
    {
      id: 4,
      title: "DevOps Engineer",
      companyName: "Tech Solutions Vietnam",
      location: "Hà Nội",
      salary: "25-40 triệu VNĐ", 
      postDate: "2025-08-03",
      deadline: "2025-09-03",
      status: "DRAFT",
      applicationsCount: 0,
      viewsCount: 12,
      description: "Cần DevOps Engineer có kinh nghiệm với AWS, Docker, Kubernetes..."
    }
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Lấy thông tin user hiện tại để có employerId
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const employerId = currentUser.id;

      if (!employerId) {
        // Fallback với mock data nếu không có user ID
        setTimeout(() => {
          setJobs(mockJobs);
          setLoading(false);
        }, 500);
        return;
      }

      // Gọi API để lấy danh sách jobs của employer
      const response = await fetch(`http://localhost:8080/api/jobs/employer/${employerId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        // Chuyển đổi data từ API về format mong muốn
        const jobsWithCounts = await Promise.all(
          (data.data || []).map(async (job) => {
            // Gọi API để lấy số lượng applications cho mỗi job
            try {
              const appResponse = await fetch(`http://localhost:8080/api/applications/job/${job.id}`);
              const appData = await appResponse.json();
              const applications = appData.success ? appData.data : [];
              
              return {
                id: job.id,
                title: job.title,
                companyName: job.companyName || "Tech Solutions Vietnam",
                location: job.location,
                salary: job.salaryRange || "Thỏa thuận",
                postDate: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                deadline: job.applicationDeadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
                status: job.status || "ACTIVE",
                applicationsCount: applications.length,
                viewsCount: job.viewCount || 0,
                description: job.description || job.title
              };
            } catch (err) {
              console.error(`Error fetching applications for job ${job.id}:`, err);
              return {
                id: job.id,
                title: job.title,
                companyName: job.companyName || "Tech Solutions Vietnam",
                location: job.location,
                salary: job.salaryRange || "Thỏa thuận",
                postDate: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                deadline: job.applicationDeadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
                status: job.status || "ACTIVE",
                applicationsCount: 0,
                viewsCount: job.viewCount || 0,
                description: job.description || job.title
              };
            }
          })
        );
        
        setJobs(jobsWithCounts);
      } else {
        console.error('Failed to fetch jobs:', data.message);
        // Fallback với mock data
        setJobs(mockJobs);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      // Fallback với mock data nếu có lỗi
      setJobs(mockJobs);
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800'; 
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'PAUSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Đang tuyển';
      case 'EXPIRED': return 'Hết hạn';
      case 'DRAFT': return 'Bản nháp';
      case 'PAUSED': return 'Tạm dừng';
      default: return status;
    }
  };

  const handleViewApplications = (jobId) => {
    navigate(`/employer-cv-list/${jobId}`);
  };

  const handleEditJob = (jobId) => {
    alert(`Chỉnh sửa công việc ID: ${jobId}`);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      setJobs(prev => prev.filter(job => job.id !== jobId));
    }
  };

  const handleCreateJob = () => {
    alert('Tạo công việc mới');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách công việc...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Quản lý công việc
              </h1>
              <p className="text-gray-600">
                Quản lý các vị trí tuyển dụng và xem CV ứng tuyển
              </p>
            </div>
            <button
              onClick={handleCreateJob}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Tạo công việc mới
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên công việc hoặc địa điểm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang tuyển</option>
                <option value="EXPIRED">Hết hạn</option>
                <option value="DRAFT">Bản nháp</option>
                <option value="PAUSED">Tạm dừng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
            <div className="text-sm text-gray-600">Tổng công việc</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter(job => job.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-gray-600">Đang tuyển</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-orange-600">
              {jobs.reduce((sum, job) => sum + job.applicationsCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Tổng ứng viên</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {jobs.reduce((sum, job) => sum + job.viewsCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Lượt xem</div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách công việc ({filteredJobs.length})
            </h3>
          </div>
          
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' ? '🔍' : '📋'}
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Không tìm thấy công việc nào'
                  : 'Chưa có công việc nào'
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  : 'Tạo công việc đầu tiên để bắt đầu tuyển dụng'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Công việc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thống kê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {job.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-blue-600">
                            <Users size={14} />
                            <span>{job.applicationsCount} ứng viên</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Eye size={14} />
                            <span>{job.viewsCount} lượt xem</span>
                          </div>
                          <div className="text-gray-500">
                            Đăng: {new Date(job.postDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusText(job.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewApplications(job.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title="Xem CV ứng tuyển"
                          >
                            <Users size={16} />
                            CV ({job.applicationsCount})
                          </button>
                          <button
                            onClick={() => handleEditJob(job.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobManagementPage;

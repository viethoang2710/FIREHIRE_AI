// src/components/Admin/ApplicationManagement.js
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';
import applicationService from '../../services/applicationService';

const ApplicationManagement = ({ showAlert }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jobFilter, setJobFilter] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // For admin, fetch all applications. For employer, fetch by employer ID
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      let response;
      
      if (currentUser.role === 'ADMIN') {
        // Admin can see all applications - we'll need to create this endpoint
        response = await applicationService.getAllApplications();
      } else if (currentUser.role === 'EMPLOYER') {
        response = await applicationService.getApplicationsByEmployer(currentUser.id);
      }
      
      if (response?.success) {
        setApplications(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      showAlert('Không thể tải danh sách CV ứng tuyển', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await applicationService.updateApplicationStatus(applicationId, newStatus);
      if (response.success) {
        showAlert('Cập nhật trạng thái thành công', 'success');
        fetchApplications(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('Không thể cập nhật trạng thái', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800';
      case 'SHORTLISTED': return 'bg-green-100 text-green-800';
      case 'INTERVIEW_SCHEDULED': return 'bg-purple-100 text-purple-800';
      case 'HIRED': return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xem xét';
      case 'REVIEWED': return 'Đã xem';
      case 'SHORTLISTED': return 'Đã lọc';
      case 'INTERVIEW_SCHEDULED': return 'Lên lịch PV';
      case 'HIRED': return 'Đã tuyển';
      case 'REJECTED': return 'Từ chối';
      default: return status;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesJob = jobFilter === 'ALL' || app.jobId?.toString() === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý CV ứng tuyển</h2>
        <div className="flex space-x-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {filteredApplications.length} CV
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm theo tên ứng viên, vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xem xét</option>
          <option value="REVIEWED">Đã xem</option>
          <option value="SHORTLISTED">Đã lọc</option>
          <option value="INTERVIEW_SCHEDULED">Lên lịch PV</option>
          <option value="HIRED">Đã tuyển</option>
          <option value="REJECTED">Từ chối</option>
        </select>

        <button
          onClick={fetchApplications}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Làm mới
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có CV ứng tuyển nào</h3>
            <p className="text-gray-500">Khi có ứng viên nộp CV, danh sách sẽ hiển thị tại đây</p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application.applicationId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {application.candidateName || 'Ứng viên'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Vị trí: {application.jobTitle}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Nộp: {new Date(application.appliedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {application.companyName && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Công ty: {application.companyName}</span>
                          </div>
                        )}
                        {application.coverLetter && (
                          <div className="col-span-2 mt-2">
                            <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">
                              <strong>Thư giới thiệu:</strong> {application.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
                  {application.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(application.applicationId, 'SHORTLISTED')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Lọc CV</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application.applicationId, 'REJECTED')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Từ chối</span>
                      </button>
                    </>
                  )}
                  
                  {application.status === 'SHORTLISTED' && (
                    <button
                      onClick={() => handleStatusUpdate(application.applicationId, 'INTERVIEW_SCHEDULED')}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors flex items-center space-x-1"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Lên lịch PV</span>
                    </button>
                  )}

                  {application.status === 'INTERVIEW_SCHEDULED' && (
                    <button
                      onClick={() => handleStatusUpdate(application.applicationId, 'HIRED')}
                      className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Tuyển dụng</span>
                    </button>
                  )}

                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    onClick={() => showAlert('Tính năng xem/tải CV sẽ được triển khai sớm', 'info')}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Xem CV</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {applications.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(app => app.status === 'PENDING').length}
            </div>
            <div className="text-yellow-700 text-sm">Chờ xem xét</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'SHORTLISTED').length}
            </div>
            <div className="text-green-700 text-sm">Đã lọc</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {applications.filter(app => app.status === 'INTERVIEW_SCHEDULED').length}
            </div>
            <div className="text-purple-700 text-sm">Lên lịch PV</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {applications.filter(app => app.status === 'HIRED').length}
            </div>
            <div className="text-emerald-700 text-sm">Đã tuyển</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;

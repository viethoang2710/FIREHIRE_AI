// src/pages/EmployerCVListPage.js
/**
 * Trang hiển thị danh sách ứng viên (CVs) đã ứng tuyển cho một job cụ thể.
 * 
 * Cách hoạt động:
 * 1. Lấy jobId từ URL params
 * 2. Gọi API để lấy thông tin job từ bảng job_postings
 * 3. Gọi API để lấy danh sách applications từ bảng Applications 
 *    - Applications table liên kết CVs với Jobs thông qua CVID và JobID
 *    - Mỗi application chứa thông tin về CV, candidate và job
 * 4. Hiển thị danh sách ứng viên với khả năng xem, tải CV và cập nhật trạng thái
 * 
 * Database schema:
 * - CVs: CVID, UserID, JobID, Title, FileName, FileData, etc.
 * - Applications: ApplicationID, CVID, JobID, Status, AppliedAt
 * - Users: UserID, FullName, Email, PhoneNumber, etc.
 * - job_postings: id, title, companyName, location, etc.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Download, Mail, Phone, Calendar, User, FileText, MapPin, DollarSign } from 'lucide-react';

const EmployerCVListPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);

  // Mock job info for testing
  const getJobInfo = (jobId) => {
    const jobs = {
      1: {
        id: 1,
        title: "Kỹ sư dữ liệu (Junior Data Engineer)",
        companyName: "Tech Solutions Vietnam",
        location: "Hà Nội",
        salary: "15-25 triệu VNĐ",
        postDate: "2025-08-01",
        deadline: "2025-08-30"
      },
      2: {
        id: 2,
        title: "Frontend Developer (React)",
        companyName: "Tech Solutions Vietnam",
        location: "TP.HCM",
        salary: "18-30 triệu VNĐ",
        postDate: "2025-07-28",
        deadline: "2025-08-25"
      },
      3: {
        id: 3,
        title: "Marketing Specialist",
        companyName: "Tech Solutions Vietnam",
        location: "Đà Nẵng",
        salary: "12-20 triệu VNĐ",
        postDate: "2025-07-20",
        deadline: "2025-08-15"
      },
      4: {
        id: 4,
        title: "DevOps Engineer",
        companyName: "Tech Solutions Vietnam",
        location: "Hà Nội",
        salary: "25-40 triệu VNĐ",
        postDate: "2025-08-03",
        deadline: "2025-09-03"
      }
    };
    return jobs[jobId] || jobs[1];
  };

  useEffect(() => {
    fetchApplicationsByJobId();
  }, [jobId]);

  const fetchApplicationsByJobId = async () => {
    setLoading(true);
    try {
      console.log(`Fetching applications for job ID: ${jobId}`);
      
      // Gọi API để lấy thông tin job
      const jobResponse = await fetch(`http://localhost:8080/api/jobs/${jobId}`);
      const jobData = await jobResponse.json();
      
      let currentJobInfo = null;
      if (jobResponse.ok && jobData.success) {
        const job = jobData.data;
        currentJobInfo = {
          id: job.id,
          title: job.title,
          companyName: job.companyName || "Tech Solutions Vietnam",
          location: job.location,
          salary: job.salaryRange || "Thỏa thuận",
          postDate: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          deadline: job.applicationDeadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
        };
      } else {
        console.warn('Failed to fetch job info, using fallback data');
        // Fallback với mock data nếu không lấy được job info
        currentJobInfo = getJobInfo(parseInt(jobId));
      }
      
      // Gọi API để lấy danh sách ứng viên đã nộp CV cho job này từ bảng Applications
      // API này sẽ trả về các applications liên kết với CVs có JobID tương ứng
      const response = await fetch(`http://localhost:8080/api/applications/job/${jobId}`);
      const data = await response.json();
      
      console.log('API Response for applications:', data);
      
      if (response.ok && data.success) {
        // Chuyển đổi data từ API về format cho frontend
        // Mỗi application sẽ chứa thông tin CV, candidate và job
        const applications = (data.data || []).map(app => ({
          applicationId: app.applicationId,
          cvId: app.cvId,
          cvTitle: app.cvTitle || `CV ứng tuyển ${currentJobInfo?.title || 'vị trí này'}`,
          jobId: parseInt(jobId),
          jobTitle: currentJobInfo?.title || 'Unknown Position',
          companyName: currentJobInfo?.companyName || "Tech Solutions Vietnam",
          appliedAt: app.appliedAt || new Date().toISOString(),
          status: app.status?.toUpperCase() || 'PENDING', // Chuẩn hóa status về uppercase
          candidateName: app.candidateName || 'Ứng viên không xác định',
          candidateEmail: app.candidateEmail || '',
          candidatePhone: app.candidatePhone || ''
        }));
        
        console.log(`Found ${applications.length} applications for job ${jobId}`);
        
        // Nếu không có dữ liệu thực, sử dụng mock data để demo
        if (applications.length === 0) {
          console.log('No real data found, using mock data for demo');
          const mockApplications = [
            {
              applicationId: 'mock-1',
              cvId: 'mock-cv-1',
              cvTitle: `CV ứng tuyển ${currentJobInfo?.title || 'vị trí này'}`,
              jobId: parseInt(jobId),
              jobTitle: currentJobInfo?.title || 'Unknown Position',
              companyName: currentJobInfo?.companyName || "Tech Solutions Vietnam",
              appliedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(), // 2 ngày trước
              status: 'PENDING',
              candidateName: 'Nguyễn Văn A',
              candidateEmail: 'nguyenvana@email.com',
              candidatePhone: '0123456789'
            },
            {
              applicationId: 'mock-2', 
              cvId: 'mock-cv-2',
              cvTitle: `CV ứng tuyển ${currentJobInfo?.title || 'vị trí này'}`,
              jobId: parseInt(jobId),
              jobTitle: currentJobInfo?.title || 'Unknown Position',
              companyName: currentJobInfo?.companyName || "Tech Solutions Vietnam",
              appliedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(), // 1 ngày trước
              status: 'VIEWED',
              candidateName: 'Trần Thị B',
              candidateEmail: 'tranthib@email.com',
              candidatePhone: '0987654321'
            },
            {
              applicationId: 'mock-3',
              cvId: 'mock-cv-3', 
              cvTitle: `CV ứng tuyển ${currentJobInfo?.title || 'vị trí này'}`,
              jobId: parseInt(jobId),
              jobTitle: currentJobInfo?.title || 'Unknown Position',
              companyName: currentJobInfo?.companyName || "Tech Solutions Vietnam",
              appliedAt: new Date().toISOString(), // Hôm nay
              status: 'ACCEPTED',
              candidateName: 'Lê Văn C',
              candidateEmail: 'levanc@email.com',
              candidatePhone: '0369852147'
            }
          ];
          setApplications(mockApplications);
        } else {
          setApplications(applications);
        }
      } else {
        console.error('Failed to fetch applications:', data.message || 'Unknown error');
        // Sử dụng mock data khi API fail
        console.log('API failed, using mock data for demo');
        const mockApplications = [
          {
            applicationId: 'mock-1',
            cvId: 'mock-cv-1',
            cvTitle: `CV ứng tuyển ${currentJobInfo?.title || 'vị trí này'}`,
            jobId: parseInt(jobId),
            jobTitle: currentJobInfo?.title || 'Unknown Position',
            companyName: currentJobInfo?.companyName || "Tech Solutions Vietnam",
            appliedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
            status: 'PENDING',
            candidateName: 'Nguyễn Văn A',
            candidateEmail: 'nguyenvana@email.com',
            candidatePhone: '0123456789'
          },
          {
            applicationId: 'mock-2',
            cvId: 'mock-cv-2',
            cvTitle: `CV ứng tuyển ${currentJobInfo?.title || 'vị trí này'}`,
            jobId: parseInt(jobId),
            jobTitle: currentJobInfo?.title || 'Unknown Position',
            companyName: currentJobInfo?.companyName || "Tech Solutions Vietnam",
            appliedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
            status: 'VIEWED',
            candidateName: 'Trần Thị B',
            candidateEmail: 'tranthib@email.com',
            candidatePhone: '0987654321'
          }
        ];
        setApplications(mockApplications);
      }
      
      setJobInfo(currentJobInfo);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err);
      setLoading(false);
    }
  };

  const handleViewCV = (application) => {
    setSelectedCV(application);
    setShowCVModal(true);
  };

  const handleDownloadCV = (application) => {
    // Kiểm tra nếu là mock data
    if (application.applicationId.toString().startsWith('mock-')) {
      alert(`[DEMO] Tải CV của ${application.candidateName} (CV ID: ${application.cvId})`);
      return;
    }
    
    // In thực tế sẽ call API download CV cho real data
    alert(`Tải CV của ${application.candidateName} (CV ID: ${application.cvId})`);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      console.log(`Updating application ${applicationId} status to ${newStatus}`);
      
      // Kiểm tra nếu là mock data (applicationId có prefix 'mock-')
      if (applicationId.toString().startsWith('mock-')) {
        // Chỉ cập nhật local state cho mock data
        setApplications(prev => 
          prev.map(app => 
            app.applicationId === applicationId 
              ? { ...app, status: newStatus.toUpperCase() }
              : app
          )
        );
        alert(`[DEMO] Đã cập nhật trạng thái thành ${getStatusText(newStatus.toUpperCase())}`);
        console.log(`Mock data: Successfully updated application ${applicationId} status`);
        return;
      }
      
      // Gọi API để cập nhật status trong database cho real data
      // Status cần được chuyển về lowercase để phù hợp với enum trong backend
      const statusForAPI = newStatus.toLowerCase();
      const response = await fetch(
        `http://localhost:8080/api/applications/${applicationId}/status?status=${statusForAPI}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Cập nhật state local với status uppercase để hiển thị
        setApplications(prev => 
          prev.map(app => 
            app.applicationId === applicationId 
              ? { ...app, status: newStatus.toUpperCase() }
              : app
          )
        );
        alert(`Đã cập nhật trạng thái thành ${getStatusText(newStatus.toUpperCase())}`);
        console.log(`Successfully updated application ${applicationId} status`);
      } else {
        console.error('Failed to update status:', data);
        alert(`Không thể cập nhật trạng thái: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'VIEWED': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      // Backward compatibility với status cũ
      case 'REVIEWED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xem xét';
      case 'VIEWED': return 'Đã xem xét';
      case 'ACCEPTED': return 'Chấp nhận';
      case 'REJECTED': return 'Từ chối';
      // Backward compatibility với status cũ
      case 'REVIEWED': return 'Đã xem xét';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách ứng viên...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-red-600">{error.message}</p>
            <button 
              onClick={fetchApplicationsByJobId}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Thử lại
            </button>
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Danh sách ứng viên
              </h1>
              {jobInfo && (
                <div className="space-y-2">
                  <h2 className="text-xl text-blue-600 font-semibold">{jobInfo.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{jobInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span>{jobInfo.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Hạn nộp: {new Date(jobInfo.deadline).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/job-management')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
            <div className="text-sm text-gray-600">Tổng ứng viên</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(app => app.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600">Chờ xem xét</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(app => ['VIEWED', 'REVIEWED'].includes(app.status)).length}
            </div>
            <div className="text-sm text-gray-600">Đã xem xét</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'ACCEPTED').length}
            </div>
            <div className="text-sm text-gray-600">Đã chấp nhận</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">
              {applications.filter(app => app.status === 'REJECTED').length}
            </div>
            <div className="text-sm text-gray-600">Đã từ chối</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách CV ứng tuyển ({applications.length})
            </h3>
          </div>
          
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Chưa có ứng viên nào
              </h3>
              <p className="text-gray-500">
                Hiện tại chưa có ứng viên nào nộp CV cho vị trí này.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ứng viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CV
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày nộp
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
                  {applications.map((application) => (
                    <tr key={application.applicationId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <User size={20} className="text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.candidateName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Mail size={14} />
                                {application.candidateEmail}
                              </span>
                              {application.candidatePhone && (
                                <span className="flex items-center gap-1">
                                  <Phone size={14} />
                                  {application.candidatePhone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.cvTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          CV ID: {application.cvId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.appliedAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewCV(application)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title="Xem CV"
                          >
                            <Eye size={16} />
                            Xem
                          </button>
                          <button
                            onClick={() => handleDownloadCV(application)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            title="Tải CV"
                          >
                            <Download size={16} />
                            Tải
                          </button>
                          <select
                            value={application.status}
                            onChange={(e) => handleUpdateStatus(application.applicationId, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="PENDING">Chờ xem xét</option>
                            <option value="VIEWED">Đã xem xét</option>
                            <option value="ACCEPTED">Chấp nhận</option>
                            <option value="REJECTED">Từ chối</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CV Modal */}
        {showCVModal && selectedCV && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    CV của {selectedCV.candidateName}
                  </h2>
                  <button
                    onClick={() => setShowCVModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Xem trước CV
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCV.cvTitle}
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>CV ID: {selectedCV.cvId}</p>
                    <p>Ngày nộp: {new Date(selectedCV.appliedAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      onClick={() => handleDownloadCV(selectedCV)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Download size={16} />
                      Tải xuống CV
                    </button>
                    <button
                      onClick={() => setShowCVModal(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerCVListPage;

// src/components/Admin/CVViewModal.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Download, FileText, User, Calendar, MapPin, Eye, Loader } from 'lucide-react';
import applicationService from '../../services/applicationService';
import { cvService } from '../../services/cvService';
import './CVViewModal.css';

const CVViewModal = ({ isOpen, onClose, application }) => {
  const [loading, setLoading] = useState(false);
  const [cvUrl, setCvUrl] = useState(null);
  const [error, setError] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState(application);

  useEffect(() => {
    if (isOpen && application?.applicationId) {
      loadApplicationData();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, application]);

  const loadApplicationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const applicationId = application.applicationId;
      console.log('Loading application data for ID:', applicationId, 'Application object:', application);
      
      // Lấy thông tin chi tiết application nếu chưa có
      if (!applicationDetails || !applicationDetails.cvData) {
        try {
          const detailsResponse = await applicationService.getApplicationDetails(applicationId);
          if (detailsResponse.success) {
            console.log('Application details loaded:', detailsResponse.data);
            setApplicationDetails({...application, ...detailsResponse.data});
          }
        } catch (detailsError) {
          console.warn('Failed to load application details:', detailsError);
          // Tiếp tục với dữ liệu application hiện tại
        }
      }

      // Tải CV để preview
      await loadCVPreview(applicationId);
    } catch (error) {
      console.error('Error loading application data:', error);
      setError(`Không thể tải dữ liệu CV: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCVPreview = async (applicationId) => {
    try {
      console.log('Loading CV preview for application ID:', applicationId);
      
      // Thử lấy thông tin CV từ cvService trước
      try {
        const cvResponse = await cvService.getCVById(applicationId);
        if (cvResponse && cvResponse.success && cvResponse.data) {
          console.log('CV details loaded successfully:', cvResponse.data);
          setApplicationDetails(prev => ({
            ...prev,
            ...cvResponse.data,
            cvDetails: cvResponse.data
          }));
        }
      } catch (dbError) {
        console.warn('Failed to load CV details from cvService:', dbError);
      }

      // Thử lấy thông tin application details nếu chưa có đầy đủ
      try {
        const appResponse = await applicationService.getApplicationById(applicationId);
        if (appResponse && appResponse.success && appResponse.data) {
          console.log('Application details loaded:', appResponse.data);
          setApplicationDetails(prev => ({
            ...prev,
            ...appResponse.data
          }));
        }
      } catch (appError) {
        console.warn('Failed to load application details:', appError);
      }

      // Thử lấy CV file để preview - sử dụng nhiều endpoint khác nhau
      let cvFileLoaded = false;
      
      // 1. Thử với CV ID để lấy file gốc (ưu tiên cao nhất)
      if (applicationDetails?.cvId || applicationDetails?.id) {
        try {
          const cvId = applicationDetails.cvId || applicationDetails.id;
          // Thử endpoint file gốc trước
          const response = await fetch(`/api/cv/${cvId}/file`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setCvUrl(url);
            console.log('Original CV file loaded successfully from CV API with ID:', cvId);
            cvFileLoaded = true;
          }
        } catch (cvIdError) {
          console.warn('Failed to load original CV with CV ID:', cvIdError);
        }
      }

      // 2. Fallback: thử với format=original
      if (!cvFileLoaded && (applicationDetails?.cvId || applicationDetails?.id)) {
        try {
          const cvId = applicationDetails.cvId || applicationDetails.id;
          const response = await fetch(`/api/cv/${cvId}/download?format=original`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setCvUrl(url);
            console.log('Original CV file loaded successfully with format=original');
            cvFileLoaded = true;
          }
        } catch (originalError) {
          console.warn('Failed to load CV with format=original:', originalError);
        }
      }
      
      // 3. Thử từ cvService nếu chưa load được
      if (!cvFileLoaded) {
        try {
          const response = await cvService.viewCVFromDatabase(applicationId);
          if (response && response.data) {
            const url = URL.createObjectURL(response.data);
            setCvUrl(url);
            console.log('CV file loaded successfully from cvService database');
            cvFileLoaded = true;
          }
        } catch (dbError) {
          console.warn('Failed to load CV file from cvService:', dbError);
        }
      }

      // 4. Thử với applicationService
      if (!cvFileLoaded) {
        try {
          const response = await applicationService.viewCV(applicationId);
          if (response && response.data) {
            const url = URL.createObjectURL(response.data);
            setCvUrl(url);
            console.log('CV file loaded successfully from applicationService');
            cvFileLoaded = true;
          }
        } catch (appError) {
          console.warn('Failed to load CV file from applicationService:', appError);
        }
      }

      // 5. Thử endpoint application CV
      if (!cvFileLoaded) {
        try {
          const response = await fetch(`/api/applications/cv/${applicationId}/download`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setCvUrl(url);
            console.log('CV file loaded successfully from application CV API');
            cvFileLoaded = true;
          }
        } catch (directError) {
          console.warn('Failed to load CV file from application API:', directError);
        }
      }

      // Nếu không load được file CV nhưng có thông tin CV thì vẫn tiếp tục hiển thị
      if (!cvFileLoaded) {
        console.log('CV file not available for preview, but CV details may be loaded');
      }
      
    } catch (error) {
      console.error('Error loading CV preview:', error);
      setError(`Không thể tải xem trước CV: ${error.message || error}`);
    }
  };

  const handleDownloadCV = async () => {
    try {
      setLoading(true);
      const applicationId = application.applicationId;
      console.log('Downloading CV for application ID:', applicationId);
      
      let response = null;
      let fileName = applicationDetails?.fileName || applicationDetails?.cvDetails?.fileName || `CV_${applicationDetails?.candidateName || applicationDetails?.userFullName || 'UngVien'}_${Date.now()}.pdf`;
      
      // Thử với các endpoint khác nhau theo thứ tự ưu tiên
      const downloadAttempts = [
        // 1. Sử dụng CV ID để lấy file gốc (ưu tiên cao nhất)
        async () => {
          if (applicationDetails?.cvId || applicationDetails?.id) {
            const cvId = applicationDetails.cvId || applicationDetails.id;
            // Thử endpoint file gốc trước
            const directResponse = await fetch(`/api/cv/${cvId}/file`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (directResponse.ok) {
              const blob = await directResponse.blob();
              
              // Lấy tên file từ response headers
              const contentDisposition = directResponse.headers.get('content-disposition');
              if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (fileNameMatch && fileNameMatch[1]) {
                  fileName = fileNameMatch[1].replace(/['"]/g, '');
                }
              }
              
              console.log('Original CV downloaded successfully from /api/cv/file endpoint with ID:', cvId);
              return { data: blob };
            }
          }
          throw new Error('No CV ID available for file download');
        },

        // 2. Sử dụng CV ID với format=original  
        async () => {
          if (applicationDetails?.cvId || applicationDetails?.id) {
            const cvId = applicationDetails.cvId || applicationDetails.id;
            const directResponse = await fetch(`/api/cv/${cvId}/download?format=original`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (directResponse.ok) {
              const blob = await directResponse.blob();
              
              // Lấy tên file từ response headers
              const contentDisposition = directResponse.headers.get('content-disposition');
              if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (fileNameMatch && fileNameMatch[1]) {
                  fileName = fileNameMatch[1].replace(/['"]/g, '');
                }
              }
              
              console.log('Original CV downloaded successfully with format=original, ID:', cvId);
              return { data: blob };
            }
          }
          throw new Error('No CV ID available for original format download');
        },
        
        // 3. Sử dụng application endpoint
        async () => {
          const directResponse = await fetch(`/api/applications/cv/${applicationId}/download`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (directResponse.ok) {
            const blob = await directResponse.blob();
            
            const contentDisposition = directResponse.headers.get('content-disposition');
            if (contentDisposition) {
              const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (fileNameMatch && fileNameMatch[1]) {
                fileName = fileNameMatch[1].replace(/['"]/g, '');
              }
            }
            
            console.log('CV downloaded successfully from Application API');
            return { data: blob };
          }
          throw new Error(`HTTP ${directResponse.status}: ${directResponse.statusText}`);
        },
        
        // 4. Fallback to service methods
        async () => {
          try {
            const serviceResponse = await cvService.downloadCVFromDatabase(applicationId);
            if (serviceResponse && serviceResponse.data) {
              console.log('CV downloaded successfully from cvService');
              return serviceResponse;
            }
          } catch (error) {
            const appServiceResponse = await applicationService.downloadCV(applicationId);
            if (appServiceResponse && appServiceResponse.data) {
              console.log('CV downloaded successfully from applicationService');
              return appServiceResponse;
            }
            throw error;
          }
        }
      ];
      
      // Thử từng phương pháp cho đến khi thành công
      let lastError = null;
      for (const attempt of downloadAttempts) {
        try {
          response = await attempt();
          if (response && response.data) {
            break;
          }
        } catch (error) {
          console.warn('Download attempt failed:', error);
          lastError = error;
          continue;
        }
      }
      
      if (response && response.data) {
        const url = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
        
        console.log('CV downloaded successfully:', fileName);
        
        // Clear any previous errors
        setError(null);
        
      } else {
        throw lastError || new Error('Không có dữ liệu CV để tải xuống');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      const errorMessage = `Không thể tải xuống CV: ${error.message || 'Lỗi không xác định'}`;
      setError(errorMessage);
      
      // Hiển thị thông báo lỗi chi tiết hơn cho user
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (cvUrl) {
      URL.revokeObjectURL(cvUrl);
    }
    setCvUrl(null);
    setError(null);
    setApplicationDetails(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="cv-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      isolation: 'isolate'
    }}>
      <div className="cv-modal-container" style={{
        position: 'relative',
        left: 'auto',
        right: 'auto',
        margin: 'auto',
        zIndex: 1000000,
        isolation: 'isolate'
      }}>
        {/* Header */}
        <div className="cv-modal-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                CV - {applicationDetails?.candidateName || 'Ứng viên'}
              </h2>
              <p className="text-sm text-gray-600">
                {applicationDetails?.jobTitle} • Nộp ngày {applicationDetails?.appliedAt ? new Date(applicationDetails.appliedAt).toLocaleDateString('vi-VN') : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCV}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Tải xuống</span>
            </button>
            
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Application Info */}
        {applicationDetails && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  <strong>Ứng viên:</strong> {applicationDetails.candidateName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  <strong>Vị trí:</strong> {applicationDetails.jobTitle}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  <strong>Ngày nộp:</strong> {new Date(applicationDetails.appliedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
            
            {applicationDetails.coverLetter && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm text-gray-600">
                  <strong>Thư giới thiệu:</strong>
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {applicationDetails.coverLetter}
                </p>
              </div>
            )}
          </div>
        )}

        {/* CV Content */}
        <div className="cv-modal-content">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-gray-600">Đang tải CV...</p>
              </div>
            </div>
          )}

          {/* Hiển thị thông tin CV chi tiết */}
          {applicationDetails && !loading && (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin CV
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Tiêu đề CV:</span>
                    <p className="text-gray-800">{applicationDetails.title || applicationDetails.cvTitle || 'Chưa có tiêu đề'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Ứng viên:</span>
                    <p className="text-gray-800">{applicationDetails.candidateName || applicationDetails.userFullName || applicationDetails.fullName || 'Chưa có tên'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-800">{applicationDetails.candidateEmail || applicationDetails.userEmail || applicationDetails.email || 'Chưa có email'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Số điện thoại:</span>
                    <p className="text-gray-800">{applicationDetails.candidatePhone || applicationDetails.userPhone || applicationDetails.phone || 'Chưa có SĐT'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Ngày tạo CV:</span>
                    <p className="text-gray-800">
                      {applicationDetails.createdAt 
                        ? new Date(applicationDetails.createdAt).toLocaleDateString('vi-VN')
                        : applicationDetails.cvCreatedAt 
                        ? new Date(applicationDetails.cvCreatedAt).toLocaleDateString('vi-VN')
                        : 'Chưa xác định'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Trạng thái:</span>
                    <p className="text-gray-800">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (applicationDetails.status === 'APPROVED' || applicationDetails.status === 'approved') 
                          ? 'bg-green-100 text-green-800'
                          : (applicationDetails.status === 'REJECTED' || applicationDetails.status === 'rejected')
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {applicationDetails.status === 'PENDING' || !applicationDetails.status ? 'Đang chờ xử lý' :
                         applicationDetails.status === 'APPROVED' ? 'Đã duyệt' :
                         applicationDetails.status === 'REJECTED' ? 'Từ chối' :
                         applicationDetails.status || 'Mới'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin file CV */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-green-600" />
                  File CV
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Tên file:</span>
                    <p className="text-gray-800">{applicationDetails.fileName || applicationDetails.cvDetails?.fileName || 'CV_File.pdf'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Kích thước:</span>
                    <p className="text-gray-800">
                      {applicationDetails.fileSize 
                        ? `${(applicationDetails.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : 'Chưa xác định'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Định dạng:</span>
                    <p className="text-gray-800">{applicationDetails.fileType || 'PDF'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Trạng thái:</span>
                    <p className="text-gray-800">
                      {cvUrl ? (
                        <span className="text-green-600 font-medium">Có thể xem trước</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Chỉ có thể tải xuống</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Nút tải xuống file CV */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleDownloadCV}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Đang tải...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Tải xuống CV</span>
                      </>
                    )}
                  </button>
                  
                  {cvUrl && (
                    <button
                      onClick={() => window.open(cvUrl, '_blank')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Xem trong tab mới</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Thư giới thiệu */}
              {applicationDetails.coverLetter && (
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2 text-purple-600" />
                    Thư giới thiệu
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {applicationDetails.coverLetter}
                  </p>
                </div>
              )}

              {/* Thông tin công việc ứng tuyển */}
              {applicationDetails.job && (
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                    Vị trí ứng tuyển
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Công ty:</span>
                      <p className="text-gray-800">{applicationDetails.job.companyName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Vị trí:</span>
                      <p className="text-gray-800">{applicationDetails.job.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Địa điểm:</span>
                      <p className="text-gray-800">{applicationDetails.job.location}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Mức lương:</span>
                      <p className="text-gray-800">{applicationDetails.job.salary}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Các kỹ năng */}
              {applicationDetails.skillTags && applicationDetails.skillTags.length > 0 && (
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-indigo-600" />
                    Kỹ năng
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {applicationDetails.skillTags.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview CV file nếu có */}
              {cvUrl && (
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-red-600" />
                    Preview CV
                  </h3>
                  <div className="cv-iframe-container">
                    <iframe
                      src={cvUrl}
                      className="cv-iframe"
                      title="CV Preview"
                    />
                  </div>
                </div>
              )}

              {/* Thông báo nếu không có file CV */}
              {!cvUrl && !loading && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">Lưu ý:</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    File CV không thể preview online, nhưng bạn có thể tải xuống để xem chi tiết.
                  </p>
                </div>
              )}
            </div>
          )}

          {error && !applicationDetails && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Không thể hiển thị CV</p>
                <p className="text-sm text-gray-500">{error}</p>
                <button
                  onClick={handleDownloadCV}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thử tải xuống CV
                </button>
              </div>
            </div>
          )}

          {!applicationDetails && !loading && !error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Chưa có thông tin CV để hiển thị</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cv-modal-footer">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal using portal to ensure it's not affected by parent container styles
  return ReactDOM.createPortal(modalContent, document.body);
};

export default CVViewModal;

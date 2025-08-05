import React, { useState, useEffect } from 'react';
import ProfileEditModal from '../components/ProfileEditModal';

const ProfilePage = ({ showAlert }) => {
  const [userProfile, set      console.log('📊 CV Data length:', cvData.length);
      console.log('📊 Application Data length:', applicationData.length);
      
      // Merge dữ liệu từ cả CV và Application để có trạng thái mới nhất
      const mergedData = [...cvData];
      
      // Cập nhật trạng thái từ Applications table nếu có
      applicationData.forEach(app => {
        const cvIndex = mergedData.findIndex(cv => cv.cvId === app.cvId || cv.id === app.cvId);
        if (cvIndex !== -1) {
          // Cập nhật trạng thái từ Applications table (mới nhất)
          mergedData[cvIndex] = {
            ...mergedData[cvIndex],
            status: app.status || mergedData[cvIndex].status,
            applicationId: app.id || app.applicationId,
            updatedAt: app.updatedAt || mergedData[cvIndex].updatedAt
          };
          console.log(`🔄 Updated CV ${mergedData[cvIndex].cvId} status to: ${app.status}`);
        }
      });

      if (mergedData && Array.isArray(mergedData) && mergedData.length > 0) {useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, successRate: 0 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [nextRefreshIn, setNextRefreshIn] = useState(30);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  // Mock data cho profile - sẽ thay thế bằng API calls thật
  const mockProfile = {
    fullName: "Nguyễn Như Phúc",
    email: "nguyennhuphuc@email.com",
    phone: "+84 123 456 789",
    address: "Hồ Chí Minh, Việt Nam",
    title: "Frontend Developer & Data Engineer",
    experience: "3 năm kinh nghiệm",
    skills: "React, Node.js, Python, MySQL, MongoDB",
    bio: "Passionate developer với kinh nghiệm phát triển web và phân tích dữ liệu. Luôn học hỏi công nghệ mới.",
    linkedin: "",
    github: "",
    website: "",
    workPreference: "FULL_TIME",
    salaryExpectation: "15 - 30 triệu VNĐ"
  };

  useEffect(() => {
    // Kiểm tra thông tin đăng nhập
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    // Load user preferences
    const savedAutoRefresh = localStorage.getItem('cv_auto_refresh');
    const savedRefreshInterval = localStorage.getItem('cv_refresh_interval');
    
    if (savedAutoRefresh !== null) {
      setAutoRefresh(savedAutoRefresh === 'true');
    }
    if (savedRefreshInterval) {
      const interval = parseInt(savedRefreshInterval);
      setRefreshInterval(interval);
      setNextRefreshIn(interval);
    }
    
    console.log('=== THÔNG TIN ĐĂNG NHẬP ===');
    console.log('UserId từ localStorage:', userId);
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('==========================');
    
    if (!userId) {
      showAlert && showAlert('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.', 'warning');
    }
    
    loadUserProfile();
    loadApplications();
  }, []);

  // Auto refresh effect - tự động làm mới dữ liệu CV
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto refreshing CV data...');
      loadApplications(true); // showNotification = true
      setLastRefresh(new Date());
      setNextRefreshIn(refreshInterval); // Reset counter with current interval
    }, refreshInterval * 1000); // Convert to milliseconds

    return () => clearInterval(interval);
  }, [autoRefresh, applications, refreshInterval]); // Thêm refreshInterval vào dependency

  // Countdown effect cho next refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const countdown = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) return refreshInterval;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [autoRefresh, refreshInterval]);

  // Helper function để transform status từ backend
  const transformStatus = (apiStatus) => {
    if (!apiStatus) return 'pending';
    
    const statusMap = {
      'PENDING': 'pending',
      'REVIEWING': 'pending', 
      'REVIEWED': 'reviewed',
      'ACCEPTED': 'accepted',
      'APPROVED': 'accepted',
      'REJECTED': 'rejected',
      'DECLINED': 'rejected',
      // Thêm các trạng thái mới từ enum ApplicationStatus
      'pending': 'pending',
      'viewed': 'reviewed',
      'interview': 'interview',
      'rejected': 'rejected',
      'accepted': 'accepted'
    };
    
    return statusMap[apiStatus.toUpperCase()] || statusMap[apiStatus.toLowerCase()] || apiStatus.toLowerCase();
  };

  // Helper function để format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (typeof bytes === 'string') return bytes; // Already formatted
    
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const loadApplications = async (showNotification = false) => {
    try {
      setApplicationsLoading(true);
      const userId = localStorage.getItem('userId') || 19; // Default to 19 for testing
      
      console.log('🔍 Bắt đầu tải CV cho user ID:', userId);
      console.log('🔍 Type của userId:', typeof userId);
      console.log('🔍 localStorage userId:', localStorage.getItem('userId'));
      
      // Call cả 2 API để lấy CV data và Application data
      const [cvResponse, applicationResponse] = await Promise.allSettled([
        fetch(`http://localhost:8080/api/cv/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        }),
        fetch(`http://localhost:8080/api/applications/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        })
      ]);

      console.log('📡 CV Response status:', cvResponse.status === 'fulfilled' ? cvResponse.value.status : 'Failed');
      console.log('📡 Application Response status:', applicationResponse.status === 'fulfilled' ? applicationResponse.value.status : 'Failed');
      
      // Xử lý CV data
      let cvData = [];
      if (cvResponse.status === 'fulfilled' && cvResponse.value.ok) {
        const cvResponseData = await cvResponse.value.json();
        console.log('📋 CV API Response:', cvResponseData);
        
        if (cvResponseData.success !== undefined) {
          cvData = cvResponseData.data || [];
        } else if (Array.isArray(cvResponseData)) {
          cvData = cvResponseData;
        }
      }
      
      // Xử lý Application data  
      let applicationData = [];
      if (applicationResponse.status === 'fulfilled' && applicationResponse.value.ok) {
        const appResponseData = await applicationResponse.value.json();
        console.log('📋 Application API Response:', appResponseData);
        
        if (appResponseData.success !== undefined) {
          applicationData = appResponseData.data || [];
        } else if (Array.isArray(appResponseData)) {
          applicationData = appResponseData;
        }
      }
      
      console.log('� CV Data length:', cvData.length);
      console.log('📊 Application Data length:', applicationData.length);
      } else if (Array.isArray(data)) {
        cvData = data;
        console.log('📋 Response is array, using directly:', cvData);
      } else {
        cvData = [];
        console.log('📋 Unknown response format, defaulting to empty array');
      }
      
      console.log('📊 Processed CV Data:', cvData);
      console.log('📊 CV Data length:', cvData ? cvData.length : 0);
      console.log('📊 CV Data type:', typeof cvData);
      
      if (cvData && Array.isArray(cvData) && cvData.length > 0) {
        console.log('✅ Tìm thấy', mergedData.length, 'CV đã nộp');
        console.log('✅ First CV sample:', mergedData[0]);
        
        // Chuyển đổi dữ liệu CV đã merge với trạng thái mới nhất
        const cvList = mergedData.map((cv, index) => {
          console.log(`🔄 Processing CV ${index + 1}:`, cv);
          console.log(`🔄 CV ID: ${cv.cvId || cv.id || cv.CVID}`);
          console.log(`🔄 CV Title: ${cv.title || cv.Title}`);
          console.log(`🔄 CV FileName: ${cv.fileName || cv.FileName}`);
          console.log(`🔄 CV Job: ${cv.job}`);
          
          // CV có thể có liên kết với job hoặc là CV độc lập
          const hasJob = cv.job && Object.keys(cv.job).length > 0;
          console.log(`💼 CV ${cv.cvId || cv.id || cv.CVID} has job:`, hasJob, cv.job);
          
          const processedCV = {
            id: cv.cvId || cv.id || cv.CVID,
            cvId: cv.cvId || cv.id || cv.CVID,
            applicationId: cv.applicationId, // Nếu CV được nộp qua application
            jobTitle: hasJob ? cv.job.title : (cv.title || cv.Title || 'CV đã tải lên'),
            company: hasJob ? (cv.job.companyName || cv.job.company?.name || 'Công ty') : 'Sẵn sàng ứng tuyển',
            location: hasJob ? cv.job.location : 'Linh hoạt',
            salary: hasJob ? (cv.job.salary || cv.job.salaryRange || 'Thỏa thuận') : 'Thỏa thuận',
            status: hasJob ? transformStatus(cv.status || 'PENDING') : 'uploaded',
            appliedDate: cv.createdAt || cv.CreatedAt || cv.updatedAt || cv.UpdatedAt || new Date().toISOString(),
            cvFileName: cv.fileName || cv.FileName || 'CV.pdf',
            coverLetter: cv.coverLetter || hasJob ? 'Đã nộp đơn ứng tuyển' : 'CV đã được tải lên thành công',
            fileSize: formatFileSize(cv.fileSize || cv.FileSize),
            skillTags: cv.skillTags || (hasJob ? cv.job.skillsRequired?.split(',') : []) || []
          };
          
          console.log(`✅ Processed CV ${index + 1}:`, processedCV);
          return processedCV;
        });
        
        console.log('🎯 Final CV List:', cvList);
        
        // Kiểm tra có thay đổi trạng thái không nếu đây là auto refresh
        if (showNotification && applications.length > 0) {
          const statusChanges = cvList.filter(newCV => {
            const oldCV = applications.find(app => app.id === newCV.id);
            return oldCV && oldCV.status !== newCV.status;
          });
          
          if (statusChanges.length > 0) {
            const changeMessages = statusChanges.map(cv => 
              `${cv.jobTitle}: ${getStatusText(cv.status)}`
            ).join(', ');
            
            // Hiển thị thông báo
            showAlert && showAlert(`🔔 Cập nhật trạng thái CV: ${changeMessages}`, 'info');
            
            // Phát âm thanh thông báo đơn giản
            try {
              // Tạo âm thanh beep đơn giản
              const audioContext = new (window.AudioContext || window.webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.value = 800;
              oscillator.type = 'sine';
              
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
              
              oscillator.start(audioContext.currentTime);
              oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
              console.log('Không thể phát âm thanh thông báo');
            }
          }
        }
        
        setApplications(cvList);
        calculateStats(cvList);
      } else {
        console.log('❌ Không có CV nào trong response');
        setApplications([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error('� Error loading CVs:', error.message);
      console.error('🔍 Error details:', error);
      console.error('🔍 Error stack:', error.stack);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.log('💡 Backend không chạy - hãy khởi động backend tại http://localhost:8080');
        showAlert && showAlert('Backend không chạy. Hãy khởi động backend trước khi sử dụng.', 'error');
      } else {
        console.log('💡 Lỗi API:', error.message);
        showAlert && showAlert(`Lỗi tải CV: ${error.message}`, 'error');
      }
      
      setApplications([]);
      calculateStats([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const userId = localStorage.getItem('userId') || 1; // Mock userId nếu chưa có
      
      const response = await fetch(`http://localhost:8080/api/profile/${userId}/full`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (response.ok) {
        const profileData = await response.json();
        
        // Transform API data to component format
        const transformedProfile = {
          fullName: profileData.fullName || mockProfile.fullName,
          email: profileData.email || mockProfile.email,
          phone: profileData.phoneNumber || mockProfile.phone,
          address: profileData.address || mockProfile.address,
          title: profileData.title || mockProfile.title,
          experience: profileData.experience || mockProfile.experience,
          skills: profileData.skills || mockProfile.skills,
          bio: profileData.bio || mockProfile.bio,
          linkedin: profileData.linkedinUrl || mockProfile.linkedin,
          github: profileData.githubUrl || mockProfile.github,
          website: profileData.websiteUrl || mockProfile.website,
          workPreference: profileData.workPreference || mockProfile.workPreference,
          salaryExpectation: profileData.salaryExpectation || mockProfile.salaryExpectation,
          profileImage: profileData.hasProfileImage ? 
            `http://localhost:8080/api/profile/${userId}/image?t=${Date.now()}` : null
        };
        
        setUserProfile(transformedProfile);
        setEditedProfile(transformedProfile);
      } else {
        // Fallback to mock data if API fails
        setUserProfile(mockProfile);
        setEditedProfile(mockProfile);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to mock data
      setUserProfile(mockProfile);
      setEditedProfile(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const total = apps.length;
    const pending = apps.filter(app => ['pending', 'reviewing'].includes(app.status)).length;
    const reviewed = apps.filter(app => app.status === 'reviewed').length;
    const accepted = apps.filter(app => ['accepted', 'approved'].includes(app.status)).length;
    const uploaded = apps.filter(app => app.status === 'uploaded').length;
    
    // Tính success rate cho các CV đã nộp vào jobs (không bao gồm uploaded)
    const appliedCVs = apps.filter(app => app.status !== 'uploaded');
    const successRate = appliedCVs.length > 0 ? Math.round((accepted / appliedCVs.length) * 100) : 0;

    setStats({ total, pending, reviewed, successRate });
  };

  const getFilteredApplications = () => {
    if (activeFilter === 'all') return applications;
    return applications.filter(app => app.status === activeFilter);
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Đang xử lý',
      'reviewing': 'Đang xem xét',
      'reviewed': 'Đã xem xét',
      'interview': 'Phỏng vấn',
      'accepted': 'Được chấp nhận',
      'approved': 'Được duyệt',
      'rejected': 'Từ chối',
      'declined': 'Bị từ chối',
      'uploaded': 'Đã tải lên'
    };
    return statusMap[status] || status;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { text: 'Đang xử lý', className: 'bg-yellow-100 text-yellow-800' },
      'reviewing': { text: 'Đang xem xét', className: 'bg-blue-100 text-blue-800' },
      'reviewed': { text: 'Đã xem xét', className: 'bg-blue-100 text-blue-800' },
      'interview': { text: 'Phỏng vấn', className: 'bg-purple-100 text-purple-800' },
      'accepted': { text: 'Được chấp nhận', className: 'bg-green-100 text-green-800' },
      'approved': { text: 'Được duyệt', className: 'bg-green-100 text-green-800' },
      'rejected': { text: 'Từ chối', className: 'bg-red-100 text-red-800' },
      'declined': { text: 'Bị từ chối', className: 'bg-red-100 text-red-800' },
      'uploaded': { text: 'Đã tải lên', className: 'bg-indigo-100 text-indigo-800' }
    };
    
    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleViewCoverLetter = (app) => {
    showAlert(`Thư xin việc cho ${app.jobTitle}:\n\n${app.coverLetter}`, 'info');
  };

  const handleDownloadCV = async (app) => {
    try {
      if (app.cvId) {
        // Use CV API endpoint for download from CVs table
        const response = await fetch(`http://localhost:8080/api/cv/${app.cvId}/download`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = app.cvFileName || 'CV.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          showAlert(`Đã tải xuống: ${app.cvFileName}`, 'success');
        } else {
          showAlert('Không thể tải xuống CV', 'error');
        }
      } else if (app.applicationId) {
        // Try using application API endpoint
        const response = await fetch(`http://localhost:8080/api/applications/${app.applicationId}/cv`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = app.cvFileName || 'CV.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          showAlert(`Đã tải xuống: ${app.cvFileName}`, 'success');
        } else {
          showAlert('Không thể tải xuống CV từ đơn ứng tuyển', 'error');
        }
      } else {
        showAlert(`Mock download: ${app.cvFileName} (${app.fileSize})`, 'info');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      showAlert('Có lỗi xảy ra khi tải CV', 'error');
    }
  };

  // Xử lý chỉnh sửa profile
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (updatedProfile, image) => {
    try {
      setLoading(true);
      
      // Lấy userId từ localStorage hoặc context
      const userId = localStorage.getItem('userId') || 1; // Mock userId nếu chưa có
      
      const formData = new FormData();
      
      // Nếu có ảnh mới
      if (image) {
        formData.append('profileImage', image);
      }
      
      // Thêm profile data
      formData.append('profile', new Blob([JSON.stringify({
        fullName: updatedProfile.fullName,
        phoneNumber: updatedProfile.phone,
        address: updatedProfile.address,
        bio: updatedProfile.bio,
        linkedinUrl: updatedProfile.linkedin,
        githubUrl: updatedProfile.github,
        websiteUrl: updatedProfile.website,
        skills: updatedProfile.skills,
        workPreference: updatedProfile.workPreference,
        salaryExpectation: updatedProfile.salaryExpectation,
        title: updatedProfile.title,
        experience: updatedProfile.experience
      })], {
        type: 'application/json'
      }));
      
      const response = await fetch(`http://localhost:8080/api/profile/${userId}/with-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        setUserProfile({ ...userProfile, ...updatedProfile });
        setShowEditModal(false);
        showAlert('Cập nhật thông tin thành công!', 'success');
        
        // Reload để lấy ảnh mới nếu có
        if (image) {
          setTimeout(() => {
            loadUserProfile(); // Reload profile
          }, 1000);
        }
      } else {
        const error = await response.json();
        showAlert(error.error || 'Có lỗi xảy ra khi cập nhật thông tin', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showAlert('Có lỗi xảy ra khi cập nhật thông tin', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
                {userProfile?.profileImage ? (
                  <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userProfile?.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                )}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile?.fullName}</h1>
                  <p className="text-xl text-indigo-600 mb-4">{userProfile?.title}</p>
                </div>
                
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  ✏️ Chỉnh sửa
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{userProfile?.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{userProfile?.phone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{userProfile?.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{userProfile?.experience}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Kỹ năng:</h3>
                <p className="text-gray-600">{userProfile?.skills}</p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Giới thiệu:</h3>
                <p className="text-gray-600">{userProfile?.bio}</p>
              </div>

              {/* Social Links */}
              {(userProfile?.linkedin || userProfile?.github || userProfile?.website) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Liên kết:</h3>
                  <div className="flex gap-4">
                    {userProfile?.linkedin && (
                      <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        LinkedIn
                      </a>
                    )}
                    {userProfile?.github && (
                      <a href={userProfile.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
                        GitHub
                      </a>
                    )}
                    {userProfile?.website && (
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.total}</div>
            <div className="text-gray-600">CV đã nộp</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
            <div className="text-gray-600">Đang xử lý</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.reviewed}</div>
            <div className="text-gray-600">Đã xem xét</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.successRate}%</div>
            <div className="text-gray-600">Tỷ lệ thành công</div>
          </div>
        </div>

        {/* CV History Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">Lịch Sử CV Đã Nộp</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Auto Refresh Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setAutoRefresh(newValue);
                    localStorage.setItem('cv_auto_refresh', newValue.toString());
                  }}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-600 flex items-center gap-1">
                  {autoRefresh && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  Tự động làm mới
                </label>
                
                {/* Refresh Interval Selector */}
                {autoRefresh && (
                  <select
                    value={refreshInterval}
                    onChange={(e) => {
                      const newInterval = parseInt(e.target.value);
                      setRefreshInterval(newInterval);
                      setNextRefreshIn(newInterval);
                      localStorage.setItem('cv_refresh_interval', newInterval.toString());
                    }}
                    className="ml-2 text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value={15}>15s</option>
                    <option value={30}>30s</option>
                    <option value={60}>1 phút</option>
                    <option value={120}>2 phút</option>
                    <option value={300}>5 phút</option>
                  </select>
                )}
              </div>
              
              {/* Last Refresh Time */}
              {lastRefresh && (
                <div className="text-xs text-gray-500 flex flex-col">
                  <span>Cập nhật lúc: {lastRefresh.toLocaleTimeString('vi-VN')}</span>
                  {autoRefresh && (
                    <span className="text-indigo-600">
                      Làm mới sau: {nextRefreshIn}s
                    </span>
                  )}
                </div>
              )}
              
              {/* Manual Refresh Button */}
              <button
                onClick={() => loadApplications(false)}
                disabled={applicationsLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {applicationsLoading ? '⏳ Đang tải...' : '🔄 Làm mới CV'}
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'uploaded', label: 'Đã tải lên' },
              { key: 'pending', label: 'Đang xử lý' },
              { key: 'reviewed', label: 'Đã xem xét' },
              { key: 'interview', label: 'Phỏng vấn' },
              { key: 'accepted', label: 'Được chấp nhận' },
              { key: 'rejected', label: 'Từ chối' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* CV List */}
          <div className="space-y-6">
            {applicationsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải danh sách CV đã nộp...</p>
              </div>
            ) : getFilteredApplications().length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có CV nào được tải lên</h3>
                <p className="text-gray-500">Hãy tải lên CV để xem lịch sử tại đây!</p>
              </div>
            ) : (
              getFilteredApplications().map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.jobTitle}</h3>
                      <p className="text-indigo-600 font-medium">{app.company}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{app.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>{app.salary}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(app.appliedDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{app.cvFileName} ({app.fileSize})</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleViewCoverLetter(app)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      👁️ Xem thư xin việc
                    </button>
                    
                    <button
                      onClick={() => handleDownloadCV(app)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      ⬇️ Tải CV
                    </button>
                    
                    <button
                      onClick={() => showAlert(`Chi tiết công việc:\n\nVị trí: ${app.jobTitle}\nCông ty: ${app.company}\nĐịa điểm: ${app.location}\nMức lương: ${app.salary}`, 'info')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      🔍 Chi tiết công việc
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        profile={userProfile}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;

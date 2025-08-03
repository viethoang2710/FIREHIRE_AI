import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Plus, Briefcase, Users, Edit, Trash2, Eye, X, AlertTriangle, Loader } from 'lucide-react';
import recruiterService from '../services/recruiterService';

// Dữ liệu giả lập sẽ chỉ dùng nếu API không hoạt động
const mockJobs = [
  { id: 1, title: 'Senior Frontend Developer (ReactJS)', location: 'Hà Nội', applicants: 25, status: 'Đang hiển thị', salary: '2000 - 3000 USD', type: 'Full-time' },
  { id: 2, title: 'UI/UX Designer', location: 'TP. Hồ Chí Minh', applicants: 18, status: 'Đang hiển thị', salary: '1500 - 2500 USD', type: 'Full-time' },
  { id: 3, title: 'Project Manager', location: 'Từ xa', applicants: 32, status: 'Đã hết hạn', salary: '2500 - 3500 USD', type: 'Contract' },
];

// --- Component: Form đăng tin tuyển dụng (Modal) ---
const PostJobModal = ({ isOpen, onClose, jobData, isEdit = false }) => {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    type: 'Full-time',
    industry: 'Công nghệ thông tin',
    experienceLevel: 'Junior',
    companyName: '',
    companyLogo: null
  });
  
  // Nếu đang chỉnh sửa, điền dữ liệu vào form
  useEffect(() => {
    if (isEdit && jobData) {
      setFormData({
        jobTitle: jobData.title || '',
        location: jobData.location || '',
        salary: jobData.salary || '',
        description: jobData.description || 'Mô tả công việc...',
        requirements: jobData.requirements || jobData.skillsRequired || 'Yêu cầu công việc...', // Handle both fields
        benefits: jobData.benefits || '',
        type: jobData.type || jobData.jobType || 'Full-time', // Handle both fields
        industry: jobData.industry || 'Công nghệ thông tin',
        experienceLevel: jobData.experienceLevel || 'Junior',
        companyName: jobData.companyName || '',
        companyLogo: jobData.companyLogo || null
      });
      
      // Set logo preview nếu có
      if (jobData.companyLogo) {
        // Nếu logo là URL thì set trực tiếp
        if (typeof jobData.companyLogo === 'string') {
          setLogoPreview(jobData.companyLogo);
        }
      } else {
        setLogoPreview(null);
      }
    } else {
      // Reset khi không edit
      setLogoPreview(null);
    }
  }, [isEdit, jobData]);

  // Reset form khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        jobTitle: '',
        location: '',
        salary: '',
        description: '',
        requirements: '',
        benefits: '',
        type: 'Full-time',
        industry: 'Công nghệ thông tin',
        experienceLevel: 'Junior',
        companyName: '',
        companyLogo: null
      });
      setLogoPreview(null);
      setShowSuccess(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Function để handle upload logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Vui lòng chọn file ảnh (JPG, PNG, GIF)');
        return;
      }
      
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }
      
      // Cập nhật formData
      setFormData(prev => ({
        ...prev,
        companyLogo: file
      }));
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function để xóa logo
  const handleRemoveLogo = () => {
    setFormData(prev => ({
      ...prev,
      companyLogo: null
    }));
    setLogoPreview(null);
    // Reset input file
    const fileInput = document.getElementById('companyLogo');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lấy employerId từ localStorage với fallback values
    let employerId = parseInt(localStorage.getItem('current_employer_id')) || 
                     parseInt(localStorage.getItem('user_id')) || 
                     parseInt(localStorage.getItem('employerId')) || 1; // Default fallback
    
    // Ensure employerId is not null/undefined/NaN
    if (!employerId || isNaN(employerId)) {
      employerId = 1; // Force default value
    }
    
    console.log('Using employerId:', employerId);
    console.log('localStorage debug:', {
      current_employer_id: localStorage.getItem('current_employer_id'),
      user_id: localStorage.getItem('user_id'),
      employerId_storage: localStorage.getItem('employerId')
    });
    
    // Tạo đối tượng dữ liệu tin tuyển dụng với đầy đủ field cho database
    const jobDataToSend = {
      title: formData.jobTitle,
      location: formData.location,
      salary: formData.salary,
      description: formData.description,
      requirements: formData.requirements,
      benefits: formData.benefits || "Môi trường làm việc chuyên nghiệp, thân thiện",
      type: formData.type,
      industry: formData.industry,
      experienceLevel: formData.experienceLevel,
      companyName: formData.companyName,
      companyLogo: formData.companyLogo, // Thêm logo vào dữ liệu
      status: isEdit ? (jobData?.status || "ACTIVE") : "ACTIVE", // Use ACTIVE for database
      employerId: employerId
    };
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      let responseData;
      
      if (isEdit && jobData?.id) {
        // Cập nhật tin tuyển dụng
        responseData = await recruiterService.updateJob(jobData.id, jobDataToSend);
        console.log('Đã cập nhật tin tuyển dụng:', responseData);
      } else {
        // Tạo tin tuyển dụng mới
        responseData = await recruiterService.createJob(jobDataToSend);
        console.log('Đã đăng tin tuyển dụng mới:', responseData);
      }
      
      // Hiển thị thông báo thành công
      setShowSuccess(true);
      
      // Sau 2 giây, đóng modal và truyền dữ liệu tin mới về component cha
      setTimeout(() => {
        setShowSuccess(false);
        // Truyền thông tin về tin mới/đã cập nhật để component cha có thể cập nhật danh sách
        onClose(true, responseData);
      }, 2000);
      
    } catch (err) {
      console.error("Lỗi khi lưu tin tuyển dụng:", err);
      
      // Kiểm tra xem lỗi có phải từ session hết hạn không
      if (err.message && err.message.includes('Authentication session expired')) {
        setSubmitError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        
        // Chuyển hướng về trang đăng nhập sau 2 giây
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setSubmitError("Không thể lưu tin tuyển dụng. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Tên việc làm</label>
            <input 
              type="text" 
              id="jobTitle" 
              className="mt-1 input-field w-full p-2 border rounded" 
              placeholder="VD: Lập trình viên ReactJS"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Địa điểm làm việc</label>
              <input 
                type="text" 
                id="location" 
                className="mt-1 input-field w-full p-2 border rounded" 
                placeholder="VD: Hà Nội, Việt Nam"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Mức lương</label>
              <input 
                type="text" 
                id="salary" 
                className="mt-1 input-field w-full p-2 border rounded" 
                placeholder="VD: 20-30 triệu hoặc 'Thương lượng'"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Loại hình công việc</label>
            <select 
              id="type" 
              className="mt-1 input-field w-full p-2 border rounded"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Full-time">Toàn thời gian</option>
              <option value="Part-time">Bán thời gian</option>
              <option value="Contract">Hợp đồng</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Thực tập</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Ngành nghề</label>
              <select 
                id="industry" 
                className="mt-1 input-field w-full p-2 border rounded"
                value={formData.industry}
                onChange={handleChange}
                required
              >
                <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                <option value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</option>
                <option value="Marketing - Truyền thông">Marketing - Truyền thông</option>
                <option value="Giáo dục - Đào tạo">Giáo dục - Đào tạo</option>
                <option value="Y tế - Sức khỏe">Y tế - Sức khỏe</option>
                <option value="Xây dựng - Kiến trúc">Xây dựng - Kiến trúc</option>
                <option value="Bán lẻ - Thương mại">Bán lẻ - Thương mại</option>
                <option value="Du lịch - Khách sạn">Du lịch - Khách sạn</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">Kinh nghiệm yêu cầu</label>
              <select 
                id="experienceLevel" 
                className="mt-1 input-field w-full p-2 border rounded"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
              >
                <option value="Không yêu cầu">Không yêu cầu kinh nghiệm</option>
                <option value="Fresher">Fresher (0-1 năm)</option>
                <option value="Junior">Junior (1-3 năm)</option>
                <option value="Middle">Middle (3-5 năm)</option>
                <option value="Senior">Senior (5+ năm)</option>
                <option value="Lead/Manager">Lead/Manager</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Tên công ty</label>
            <input 
              type="text" 
              id="companyName" 
              className="mt-1 input-field w-full p-2 border rounded" 
              placeholder="Nhập tên công ty của bạn"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Logo công ty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo công ty</label>
            <div className="mt-1 flex items-center space-x-4">
              {/* Preview area */}
              <div className="flex-shrink-0">
                {logoPreview ? (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-20 h-20 object-cover border-2 border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center">Logo<br/>công ty</span>
                  </div>
                )}
              </div>
              
              {/* Upload button */}
              <div className="flex-grow">
                <input
                  type="file"
                  id="companyLogo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="companyLogo"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {logoPreview ? 'Thay đổi logo' : 'Chọn logo'}
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF. Tối đa 5MB</p>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả công việc</label>
            <textarea 
              id="description" 
              rows="5" 
              className="mt-1 input-field w-full p-2 border rounded" 
              placeholder="Mô tả chi tiết về công việc..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Yêu cầu ứng viên</label>
            <textarea 
              id="requirements" 
              rows="5" 
              className="mt-1 input-field w-full p-2 border rounded" 
              placeholder="Các kỹ năng, kinh nghiệm cần có..."
              value={formData.requirements}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Quyền lợi</label>
            <textarea 
              id="benefits" 
              rows="4" 
              className="mt-1 input-field w-full p-2 border rounded" 
              placeholder="Các quyền lợi, phúc lợi cho ứng viên..."
              value={formData.benefits}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="p-4 border-t flex justify-end gap-3 relative">
            {showSuccess && (
              <div className="absolute top-0 left-0 right-0 -mt-12 bg-green-100 text-green-800 px-4 py-3 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>
                  {isEdit ? 'Đã cập nhật tin tuyển dụng thành công!' : 'Đã đăng tin tuyển dụng thành công!'}
                  <br/>
                  <span className="text-xs">Tin tuyển dụng đã được {isEdit ? 'cập nhật' : 'đăng'} và hiển thị cho ứng viên</span>
                </span>
              </div>
            )}
            {submitError && (
              <div className="absolute top-0 left-0 right-0 -mt-12 bg-red-100 text-red-800 px-4 py-3 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{submitError}</span>
              </div>
            )}
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              {isSubmitting && <Loader className="animate-spin mr-2" size={16} />}
              {isEdit ? 'Cập nhật' : 'Đăng tin'}
            </button>
          </div>
        </form>
        <style jsx>{`
          .input-field {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
          }
        `}</style>
      </div>
    </div>
  );
};


// --- Component: Modal xác nhận xóa tin tuyển dụng ---
const DeleteConfirmModal = ({ isOpen, onClose, jobToDelete, onConfirmDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  
  if (!isOpen || !jobToDelete) return null;
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // Gọi hàm xóa từ component cha
      await onConfirmDelete(jobToDelete.id);
      
      // Đóng modal sau khi xóa thành công
      onClose();
    } catch (err) {
      console.error("Lỗi khi xóa tin tuyển dụng:", err);
      
      // Hiển thị lỗi phù hợp
      if (err.message && err.message.includes('Authentication session expired')) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        
        // Chuyển hướng về trang đăng nhập sau 2 giây
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError("Không thể xóa tin tuyển dụng. Vui lòng thử lại sau.");
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-600">
            <AlertTriangle size={48} />
          </div>
          <h3 className="text-lg font-bold text-center mb-2">Xác nhận xóa</h3>
          <p className="text-gray-700 text-center mb-6">
            Bạn có chắc chắn muốn xóa tin tuyển dụng "{jobToDelete.title}"? 
            <br />Hành động này không thể hoàn tác.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              disabled={isDeleting}
            >
              Hủy
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center min-w-[80px]"
            >
              {isDeleting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  <span>Đang xóa...</span>
                </>
              ) : (
                <span>Xóa</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component: Danh sách CV ứng viên ---
const ApplicantListModal = ({ isOpen, onClose, job }) => {
  // Đặt tất cả hooks ở cấp cao nhất của component
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dữ liệu giả lập để sử dụng nếu API không hoạt động
  const mockApplicants = [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", phone: "0901234567", appliedDate: "15/07/2025", status: "Mới", cv: "https://example.com/cv1.pdf" },
    { id: 2, name: "Trần Thị B", email: "tranthib@example.com", phone: "0912345678", appliedDate: "16/07/2025", status: "Đã xem", cv: "https://example.com/cv2.pdf" },
    { id: 3, name: "Lê Văn C", email: "levanc@example.com", phone: "0923456789", appliedDate: "17/07/2025", status: "Phỏng vấn", cv: "https://example.com/cv3.pdf" },
    { id: 4, name: "Phạm Thị D", email: "phamthid@example.com", phone: "0934567890", appliedDate: "18/07/2025", status: "Từ chối", cv: "https://example.com/cv4.pdf" },
    { id: 5, name: "Hoàng Văn E", email: "hoangvane@example.com", phone: "0945678901", appliedDate: "19/07/2025", status: "Mới", cv: "https://example.com/cv5.pdf" },
  ];
  
  // Lấy danh sách ứng viên từ API khi mở modal
  useEffect(() => {
    if (isOpen && job) {
      const fetchApplicants = async () => {
        try {
          setLoading(true);
          const data = await recruiterService.getApplicants(job.id);
          
          // Kiểm tra dữ liệu trả về
          console.log("Applicants data:", data);
          console.log("Type of applicants data:", typeof data);
          console.log("Is Array?", Array.isArray(data));
          
          // Kiểm tra và xử lý dữ liệu
          if (Array.isArray(data)) {
            setApplicants(data);
          } else if (data && data.data && Array.isArray(data.data)) {
            // Nếu API trả về dữ liệu trong thuộc tính data
            setApplicants(data.data);
          } else {
            console.error("API did not return an array for applicants:", data);
            setError("Dữ liệu ứng viên không đúng định dạng. Sử dụng dữ liệu mẫu.");
            setApplicants(mockApplicants);
          }
          
          setError(null);
        } catch (err) {
          console.error("Lỗi khi lấy danh sách ứng viên:", err);
          setError("Không thể lấy danh sách ứng viên. Sử dụng dữ liệu mẫu.");
          setApplicants(mockApplicants); // Sử dụng dữ liệu mẫu nếu API lỗi
        } finally {
          setLoading(false);
        }
      };
      
      fetchApplicants();
    }
  }, [isOpen, job]);
  
  // Kiểm tra nếu modal không mở hoặc không có thông tin job, trả về null
  if (!isOpen || !job) return null;
  
  // Hàm xử lý khi thay đổi trạng thái ứng viên
  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      await recruiterService.updateApplicantStatus(job.id, applicantId, newStatus);
      
      // Cập nhật state sau khi cập nhật thành công
      setApplicants(prevApplicants => 
        prevApplicants.map(applicant => 
          applicant.id === applicantId 
            ? { ...applicant, status: newStatus } 
            : applicant
        )
      );
      
      console.log(`Đã thay đổi trạng thái của ứng viên ${applicantId} thành ${newStatus}`);
    } catch (err) {
      console.error(`Lỗi khi cập nhật trạng thái của ứng viên ${applicantId}:`, err);
      alert("Không thể cập nhật trạng thái ứng viên. Vui lòng thử lại sau.");
    }
  };
  
  // Hàm xử lý tải CV
  const handleDownloadCV = async (applicant) => {
    try {
      console.log(`Đang tải CV của ứng viên: ${applicant.name}`);
      await recruiterService.downloadCV(job.id, applicant.id);
      // URL sẽ được tạo và download tự động trong service
    } catch (err) {
      console.error(`Lỗi khi tải CV của ứng viên ${applicant.name}:`, err);
      alert("Không thể tải CV. Vui lòng thử lại sau.");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Danh sách ứng viên - {job.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader className="animate-spin mr-2" size={24} />
              <span>Đang tải danh sách ứng viên...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-red-700 bg-red-100 rounded-md">
              <p className="font-medium">Có lỗi xảy ra:</p>
              <p>{error}</p>
            </div>
          ) : (!Array.isArray(applicants) || applicants.length === 0) ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                {!Array.isArray(applicants) 
                  ? "Có lỗi khi hiển thị danh sách ứng viên."
                  : "Chưa có ứng viên nào ứng tuyển vào vị trí này."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-4 py-3">Tên ứng viên</th>
                    <th scope="col" className="px-4 py-3">Email</th>
                    <th scope="col" className="px-4 py-3">Số điện thoại</th>
                    <th scope="col" className="px-4 py-3">Ngày nộp</th>
                    <th scope="col" className="px-4 py-3">Trạng thái</th>
                    <th scope="col" className="px-4 py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(applicants) && applicants.map(applicant => (
                  <tr key={applicant.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{applicant.name}</td>
                    <td className="px-4 py-3">{applicant.email}</td>
                    <td className="px-4 py-3">{applicant.phone}</td>
                    <td className="px-4 py-3">{applicant.appliedDate}</td>
                    <td className="px-4 py-3">
                      <select 
                        value={applicant.status} 
                        onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      >
                        <option value="Mới">Mới</option>
                        <option value="Đã xem">Đã xem</option>
                        <option value="Phỏng vấn">Phỏng vấn</option>
                        <option value="Từ chối">Từ chối</option>
                        <option value="Đã chọn">Đã chọn</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleDownloadCV(applicant)} 
                        className="text-blue-600 hover:text-blue-900 underline font-medium"
                      >
                        Xem CV
                      </button>
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

// --- Component: Xem chi tiết ứng viên ---
const ViewJobDetailModal = ({ isOpen, onClose, job }) => {
  // Debug: log job data structure
  useEffect(() => {
    if (isOpen && job) {
      console.log('ViewJobDetailModal - Job data:', job);
      console.log('- description:', job.description);
      console.log('- requirements:', job.requirements);
      console.log('- skillsRequired:', job.skillsRequired);
      console.log('- benefits:', job.benefits);
    }
  }, [isOpen, job]);
  
  if (!isOpen || !job) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Chi tiết tin tuyển dụng</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            {/* Header với logo và thông tin công ty */}
            <div className="flex items-start space-x-4 mb-4">
              {/* Logo công ty */}
              <div className="flex-shrink-0">
                {job.companyLogo ? (
                  <img 
                    src={job.companyLogo} 
                    alt={`${job.companyName || 'Company'} logo`}
                    className="w-16 h-16 object-cover border-2 border-gray-200 rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Fallback nếu không có logo */}
                <div 
                  className={`w-16 h-16 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center ${job.companyLogo ? 'hidden' : 'flex'}`}
                >
                  <span className="text-gray-400 text-xs text-center">
                    {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                  </span>
                </div>
              </div>
              
              {/* Thông tin chính */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{job.title}</h3>
                {job.companyName && (
                  <p className="text-lg font-medium text-gray-700 mb-1">{job.companyName}</p>
                )}
                <p className="text-gray-600">{job.location} • {job.type}</p>
                <p className="text-blue-600 font-semibold mt-2">Mức lương: {job.salary}</p>
              </div>
            </div>
            
            {/* Thông tin ngành nghề và kinh nghiệm */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {job.industry && (
                  <div>
                    <span className="font-medium text-gray-700">Ngành nghề:</span>
                    <p className="text-gray-600">{job.industry}</p>
                  </div>
                )}
                {job.experienceLevel && (
                  <div>
                    <span className="font-medium text-gray-700">Kinh nghiệm:</span>
                    <p className="text-gray-600">{job.experienceLevel}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Loại hình:</span>
                  <p className="text-gray-600">{job.type}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Đang hiển thị' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {job.status}
              </span>
              <span className="ml-3 text-gray-600 text-sm">
                <Users size={16} className="inline mr-1" /> {job.applicants} ứng viên
              </span>
              {job.publishedAt && (
                <span className="ml-3 text-gray-600 text-sm">
                  Đăng ngày: {new Date(job.publishedAt).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Mô tả công việc</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {job.description || `Mô tả chi tiết về vị trí ${job.title}...`}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Yêu cầu</h4>
            <div className="text-gray-700">
              {job.requirements ? (
                <div className="whitespace-pre-line">{job.requirements}</div>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Có kinh nghiệm làm việc với {job.title}</li>
                  <li>Thành thạo các công nghệ liên quan</li>
                  <li>Kỹ năng làm việc nhóm tốt</li>
                </ul>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Quyền lợi</h4>
            <div className="text-gray-700">
              {job.benefits ? (
                <div className="whitespace-pre-line">{job.benefits}</div>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Mức lương cạnh tranh: {job.salary}</li>
                  <li>Bảo hiểm đầy đủ theo quy định</li>
                  <li>Môi trường làm việc chuyên nghiệp</li>
                  <li>Cơ hội học hỏi và phát triển</li>
                </ul>
              )}
            </div>
          </div>
          
          {/* Footer với thông tin bổ sung */}
          <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Mã tin:</span> #{job.id}
              </div>
              {job.createdAt && (
                <div>
                  <span className="font-medium">Ngày đăng:</span>{' '}
                  {new Date(job.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              {job.updatedAt && job.updatedAt !== job.createdAt && (
                <div>
                  <span className="font-medium">Cập nhật lần cuối:</span>{' '}
                  {new Date(job.updatedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              <div>
                <span className="font-medium">Trạng thái:</span>{' '}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  job.status === 'Đang hiển thị' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component chính của trang ---
const RecruiterDashboardPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState(false);
  const [isApplicantListOpen, setIsApplicantListOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách tin tuyển dụng từ API hoặc localStorage
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Bắt đầu lấy danh sách tin tuyển dụng...");
      const jobsData = await recruiterService.getRecruiterJobs();
      
      // Tin tuyển dụng đã được xử lý trong service, chỉ cần kiểm tra cuối cùng
      if (Array.isArray(jobsData)) {
        if (jobsData.length > 0) {
          console.log(`Đã lấy ${jobsData.length} tin tuyển dụng thành công`);
          setJobs(jobsData);
        } else {
          console.log("Không có tin tuyển dụng nào");
          setJobs([]);
        }
      } else {
        console.error("Lỗi: Dữ liệu không phải là mảng", jobsData);
        setError("Có lỗi khi hiển thị danh sách tin tuyển dụng. Định dạng dữ liệu không hợp lệ.");
        setJobs([]);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tin tuyển dụng:", err);
      
      // Nếu lỗi liên quan đến xác thực
      if (err.message && (
          err.message.includes('Authentication session expired') || 
          err.message.includes('Unauthorized') || 
          err.message.includes('Invalid token')
        )) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          console.log("Chuyển hướng về trang đăng nhập do phiên hết hạn");
          window.location.href = '/login';
        }, 3000);
      } else {
        setError("Không thể lấy danh sách tin tuyển dụng. Sử dụng dữ liệu mẫu.");
        setJobs(mockJobs);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi xóa tin
  const handleDeleteJob = async (jobId) => {
    try {
      // Log thông tin xóa tin
      console.log(`Đang xóa tin tuyển dụng ID: ${jobId}`);
      
      const response = await recruiterService.deleteJob(jobId);
      
      // Kiểm tra xem phản hồi có thành công không
      if (response && response.success !== false) {
        // Cập nhật lại state sau khi xóa thành công
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        // Log thông báo thành công
        console.log(`Đã xóa tin tuyển dụng ID: ${jobId} thành công`);
        
        // Không hiển thị alert ở đây vì sẽ được xử lý trong DeleteConfirmModal
        return true;
      } else {
        // Nếu API trả về thành công = false
        console.error(`API trả về lỗi khi xóa tin ID: ${jobId}`, response);
        throw new Error(response?.message || "Không thể xóa tin tuyển dụng");
      }
    } catch (err) {
      console.error(`Lỗi khi xóa tin tuyển dụng ID: ${jobId}`, err);
      
      // Chuyển lỗi lên để xử lý ở DeleteConfirmModal
      if (err.message && err.message.includes('Authentication session expired')) {
        throw new Error("Authentication session expired");
      } else {
        throw err; // Đẩy lại lỗi để xử lý ở component DeleteConfirmModal
      }
    }
  };

  useEffect(() => {
    // Kiểm tra xác thực
    if (!auth.isAuthenticated()) {
      console.log("RecruiterDashboardPage - User not authenticated, redirecting to login");
      navigate('/login');
      return;
    }

    // Kiểm tra quyền người dùng
    const rawRole = auth.getRole ? auth.getRole() : (auth.role || localStorage.getItem('role'));
    const userRole = auth.normalizeRole(rawRole);
    console.log("RecruiterDashboardPage - Raw role:", rawRole);
    console.log("RecruiterDashboardPage - Normalized role:", userRole);
    
    if (userRole !== 'EMPLOYER') {
      console.log("RecruiterDashboardPage - User is not an employer, redirecting to appropriate page");
      // Chuyển hướng về trang phù hợp với vai trò
      if (userRole === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
      return;
    }

    // Lấy danh sách tin tuyển dụng nếu người dùng đã xác thực và có quyền EMPLOYER
    fetchJobs();
  }, [auth, navigate]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header riêng cho nhà tuyển dụng (có thể tạo component riêng) */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <Briefcase className="inline-block mr-2" />
            Trang Nhà Tuyển Dụng
          </h1>
          <nav>
            {/* Các link điều hướng riêng cho NTD */}
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} className="mr-2" />
            Đăng tin mới
          </button>
        </div>

        {/* Danh sách các bài đăng */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Quản lý tin tuyển dụng</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader className="animate-spin mr-2" size={24} />
              <span>Đang tải dữ liệu...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-red-700 bg-red-100 rounded-md">
              <p className="font-medium">Có lỗi xảy ra:</p>
              <p>{error}</p>
            </div>
          ) : (!Array.isArray(jobs) || jobs.length === 0) ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">
                {!Array.isArray(jobs) 
                  ? "Có lỗi khi hiển thị danh sách tin tuyển dụng."
                  : "Bạn chưa có tin tuyển dụng nào."}
              </p>
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <Briefcase size={48} className="text-gray-400" />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Đăng tin tuyển dụng đầu tiên
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3">Tên việc làm</th>
                    <th scope="col" className="px-6 py-3">Ứng viên</th>
                    <th scope="col" className="px-6 py-3">Trạng thái</th>
                    <th scope="col" className="px-6 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(jobs) && jobs.map(job => (
                  <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {job.title}
                      <p className="text-xs text-gray-500">{job.location}</p>
                    </th>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          setSelectedJob(job);
                          setIsApplicantListOpen(true);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Xem danh sách ứng viên"
                      >
                        <Users size={16} className="mr-1" /> {job.applicants}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Đang hiển thị' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedJob(job);
                          setIsViewDetailModalOpen(true);
                        }} 
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" 
                        title="Xem chi tiết tin tuyển dụng"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedJob(job);
                          setIsEditModalOpen(true);
                        }} 
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full" 
                        title="Sửa tin tuyển dụng"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDeleteModalOpen(true);
                        }} 
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full" 
                        title="Xóa tin tuyển dụng"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>      {/* Các modal */}
      <PostJobModal 
        isOpen={isModalOpen} 
        onClose={(shouldRefresh, newJobData) => {
          setIsModalOpen(false);
          if (shouldRefresh) {
            if (newJobData) {
              try {
                // Log dữ liệu mới để kiểm tra
                console.log("Thêm tin tuyển dụng mới vào danh sách:", newJobData);
                
                // Kiểm tra xem newJobData có phải là object hợp lệ không
                if (typeof newJobData !== 'object' || newJobData === null) {
                  console.error("Dữ liệu không hợp lệ:", newJobData);
                  fetchJobs(); // Lấy lại danh sách nếu dữ liệu không hợp lệ
                  return;
                }
                
                // Đảm bảo applicants có giá trị để hiển thị
                if (newJobData.applicants === undefined) {
                  newJobData.applicants = 0;
                }
                
                // Thêm tin mới vào đầu danh sách nếu có dữ liệu trả về
                setJobs(prevJobs => [newJobData, ...prevJobs]);
              } catch (error) {
                console.error("Lỗi khi xử lý dữ liệu tin tuyển dụng mới:", error);
                fetchJobs(); // Lấy lại danh sách nếu xảy ra lỗi
              }
            } else {
              // Nếu không có dữ liệu trả về, gọi API để lấy danh sách mới
              fetchJobs();
            }
          }
        }}
      />
      
      <PostJobModal 
        isOpen={isEditModalOpen} 
        onClose={(shouldRefresh, updatedJobData) => {
          setIsEditModalOpen(false);
          if (shouldRefresh) {
            if (updatedJobData) {
              try {
                // Log dữ liệu đã cập nhật để kiểm tra
                console.log("Cập nhật tin tuyển dụng trong danh sách:", updatedJobData);
                
                // Kiểm tra xem updatedJobData có phải là object hợp lệ không
                if (typeof updatedJobData !== 'object' || updatedJobData === null) {
                  console.error("Dữ liệu cập nhật không hợp lệ:", updatedJobData);
                  fetchJobs(); // Lấy lại danh sách nếu dữ liệu không hợp lệ
                  return;
                }
                
                // Đảm bảo giữ lại giá trị applicants nếu không có trong dữ liệu cập nhật
                if (updatedJobData.applicants === undefined && selectedJob) {
                  updatedJobData.applicants = selectedJob.applicants || 0;
                }
                
                // Cập nhật tin đã chỉnh sửa trong danh sách
                setJobs(prevJobs => 
                  prevJobs.map(job => job.id === updatedJobData.id ? updatedJobData : job)
                );
              } catch (error) {
                console.error("Lỗi khi xử lý dữ liệu cập nhật tin tuyển dụng:", error);
                fetchJobs(); // Lấy lại danh sách nếu xảy ra lỗi
              }
            } else {
              // Nếu không có dữ liệu trả về, gọi API để lấy danh sách mới
              fetchJobs();
            }
          }
        }}
        jobData={selectedJob}
        isEdit={true} 
      />
      
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        jobToDelete={selectedJob}
        onConfirmDelete={async (jobId) => {
          // Trả về Promise để DeleteConfirmModal có thể xử lý loading state và lỗi
          return await handleDeleteJob(jobId);
        }}
      />
      
      <ViewJobDetailModal 
        isOpen={isViewDetailModalOpen}
        onClose={() => setIsViewDetailModalOpen(false)}
        job={selectedJob}
      />
      
      <ApplicantListModal
        isOpen={isApplicantListOpen}
        onClose={() => setIsApplicantListOpen(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default RecruiterDashboardPage;
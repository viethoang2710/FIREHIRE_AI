import axios from 'axios';
import * as dataStorageUtils from '../utils/dataStorageUtils';

const API_URL = 'http://localhost:8080/api';

// Hàm helper để lấy token từ localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Hàm helper để cập nhật dữ liệu tin tuyển dụng trong localStorage
 * @param {String} storageKey - Key của localStorage cần cập nhật
 * @param {Object} jobData - Dữ liệu tin tuyển dụng mới (null nếu là xóa)
 * @param {String} action - Hành động: 'add', 'update', 'delete'
 * @param {Number} jobId - ID của tin tuyển dụng (cần thiết cho update và delete)
 */
const updateLocalStorageJobs = (storageKey, jobData, action, jobId = null) => {
  try {
    console.log(`Cập nhật localStorage [${storageKey}] với action: ${action}`);
    
    // Lấy dữ liệu hiện tại từ localStorage
    const cachedData = localStorage.getItem(storageKey);
    let jobs = [];
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed)) {
          jobs = parsed;
        } else {
          console.warn(`Dữ liệu trong key ${storageKey} không phải là mảng, sẽ khởi tạo mảng mới`);
        }
      } catch (parseError) {
        console.error(`Lỗi khi phân tích dữ liệu từ ${storageKey}:`, parseError);
      }
    }
    
    // Thực hiện các hành động tương ứng
    switch (action) {
      case 'add':
        // Thêm tin tuyển dụng mới vào đầu mảng
        if (jobData) {
          // Kiểm tra xem job đã tồn tại chưa (dựa vào ID)
          const existingIndex = jobs.findIndex(job => job.id === jobData.id);
          if (existingIndex >= 0) {
            jobs[existingIndex] = { ...jobData };
            console.log(`Cập nhật tin tuyển dụng đã tồn tại với ID: ${jobData.id}`);
          } else {
            jobs.unshift(jobData);
            console.log(`Thêm tin tuyển dụng mới với ID: ${jobData.id}`);
          }
        }
        break;
        
      case 'update':
        // Cập nhật tin tuyển dụng hiện có
        if (jobData && jobId) {
          const index = jobs.findIndex(job => job.id === jobId);
          if (index >= 0) {
            jobs[index] = { ...jobData };
            console.log(`Đã cập nhật tin tuyển dụng ID: ${jobId} trong localStorage`);
          } else {
            console.warn(`Không tìm thấy tin tuyển dụng ID: ${jobId} để cập nhật`);
            // Thêm mới nếu không tìm thấy
            jobs.unshift(jobData);
            console.log(`Đã thêm tin tuyển dụng mới với ID: ${jobData.id}`);
          }
        }
        break;
        
      case 'delete':
        // Xóa tin tuyển dụng
        if (jobId) {
          const initialLength = jobs.length;
          jobs = jobs.filter(job => job.id !== jobId);
          
          if (jobs.length < initialLength) {
            console.log(`Đã xóa tin tuyển dụng ID: ${jobId} khỏi localStorage`);
          } else {
            console.warn(`Không tìm thấy tin tuyển dụng ID: ${jobId} để xóa`);
          }
        }
        break;
        
      default:
        console.error(`Không hỗ trợ hành động: ${action}`);
        return;
    }
    
    // Lưu mảng đã cập nhật vào localStorage
    localStorage.setItem(storageKey, JSON.stringify(jobs));
    console.log(`Đã cập nhật ${storageKey} thành công với ${jobs.length} tin tuyển dụng`);
    
  } catch (error) {
    console.error(`Lỗi khi cập nhật ${storageKey}:`, error);
    throw error;
  }
};

// ===== QUẢN LÝ TIN TUYỂN DỤNG =====
/**
 * Lấy danh sách tin tuyển dụng của nhà tuyển dụng hiện tại
 */
const getRecruiterJobs = async () => {
  try {
    // Lấy user ID hiện tại để tạo key lưu trữ riêng
    const currentUserId = localStorage.getItem('current_employer_id');
    const storageKey = currentUserId ? `recruiterJobs_${currentUserId}` : 'recruiterJobs';
    
    console.log('Đang lấy danh sách tin tuyển dụng từ API...');
    console.log(`Sử dụng key lưu trữ: ${storageKey} cho user ID: ${currentUserId || 'không xác định'}`);
    
    // Đảm bảo dữ liệu đã được di chuyển sang key riêng của user (cho tương thích ngược)
    if (currentUserId) {
      dataStorageUtils.migrateJobsToUserStorage(currentUserId);
    }
    
    // Gọi API để lấy dữ liệu từ database
    const apiUrl = currentUserId ? 
      `${API_URL}/jobs?employerId=${currentUserId}` : 
      `${API_URL}/jobs`;
    
    console.log(`Gọi API: ${apiUrl}`);
    const response = await axios.get(apiUrl, getAuthHeader());
    
    // Kiểm tra định dạng phản hồi
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Nhận được HTML thay vì JSON. Có thể phiên đăng nhập đã hết hạn.');
      throw new Error('Authentication session expired');
    }
    
    console.log('API response:', response.data);
    
    // Kiểm tra và xử lý dữ liệu
    if (response.data) {
      let apiData = response.data;
      let jobsData;
      
      // Xử lý cấu trúc phản hồi của API
      if (apiData.data && Array.isArray(apiData.data)) {
        // Nếu API trả về {success, message, data}
        jobsData = apiData.data;
        console.log('Đã tìm thấy dữ liệu trong thuộc tính data của API response');
      } else if (!Array.isArray(apiData) && apiData.content && Array.isArray(apiData.content)) {
        jobsData = apiData.content; // Nếu dữ liệu nằm trong thuộc tính content
        console.log('Đã tìm thấy dữ liệu trong thuộc tính content');
      } else if (Array.isArray(apiData)) {
        jobsData = apiData; // Nếu API trả về mảng trực tiếp
        console.log('API trả về mảng trực tiếp');
      } else {
        console.error('Không thể xác định cấu trúc dữ liệu từ API:', apiData);
        throw new Error('Định dạng dữ liệu API không được hỗ trợ');
      }
      
      // Chuyển đổi dữ liệu từ API sang định dạng frontend cần
      const frontendJobs = jobsData.map(job => ({
        id: job.id,
        title: job.title,
        location: job.location,
        salary: job.salary,
        type: job.jobType || job.type,
        status: job.status === "ACTIVE" ? "Đang hiển thị" : job.status,
        applicants: job.applicationCount || 0,
        description: job.description,
        requirements: job.skillsRequired,
        benefits: job.benefits,
        publishedAt: job.createdDate,
        createdAt: job.createdDate,
        industry: job.industry,
        experienceLevel: job.experienceLevel,
        employerId: job.employerId
      }));
      
      console.log(`Đã lấy thành công ${frontendJobs.length} tin tuyển dụng từ database`);
      
      // Lưu vào localStorage để cải thiện hiệu suất và hỗ trợ offline
      if (currentUserId) {
        // Lưu vào key riêng theo user ID
        localStorage.setItem(storageKey, JSON.stringify(frontendJobs));
        
        // Lưu vào key chung cho tương thích ngược
        localStorage.setItem('recruiterJobs', JSON.stringify(frontendJobs));
        
        // Đảm bảo lưu ID user vào danh sách đã biết
        try {
          const knownUsers = JSON.parse(localStorage.getItem('known_employer_ids') || '[]');
          if (!knownUsers.includes(currentUserId)) {
            knownUsers.push(currentUserId);
            localStorage.setItem('known_employer_ids', JSON.stringify(knownUsers));
          }
        } catch (e) {
          console.error('Lỗi khi cập nhật danh sách user đã biết:', e);
        }
      } else {
        // Nếu không có user ID, chỉ lưu vào key chung
        localStorage.setItem('recruiterJobs', JSON.stringify(frontendJobs));
      }
      
      console.log(`Đã lưu dữ liệu vào localStorage với key: ${storageKey}`);
      return frontendJobs;
    } else {
      console.error('Không có dữ liệu từ API');
      throw new Error('Không có dữ liệu');
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin tuyển dụng:', error);
    
    // Lấy user ID hiện tại để tìm key lưu trữ riêng
    const currentUserId = localStorage.getItem('current_employer_id');
    const storageKey = currentUserId ? `recruiterJobs_${currentUserId}` : 'recruiterJobs';
    
    console.log(`Đang thử khôi phục dữ liệu từ localStorage cho user ${currentUserId || 'không xác định'}`);
    
    let jobsData = null;
    
    // Sử dụng hàm từ dataStorageUtils nếu có user ID
    if (currentUserId) {
      try {
        // Đảm bảo dữ liệu đã được chuyển đổi từ key chung sang key riêng
        dataStorageUtils.migrateJobsToUserStorage(currentUserId);
        
        // Lấy dữ liệu từ key riêng
        if (dataStorageUtils.hasUserJobData(currentUserId)) {
          jobsData = dataStorageUtils.getUserJobData(currentUserId);
          console.log(`Đã khôi phục ${jobsData.length} tin tuyển dụng từ key riêng cho user ID ${currentUserId}`);
          return jobsData;
        }
      } catch (utilError) {
        console.error('Lỗi khi sử dụng dataStorageUtils:', utilError);
      }
    }
    
    // Xử lý dự phòng nếu không dùng được dataStorageUtils hoặc không có user ID
    
    // Ưu tiên lấy từ key riêng của user trước
    let cachedJobs = null;
    if (currentUserId) {
      cachedJobs = localStorage.getItem(storageKey);
      if (cachedJobs) {
        console.log(`Khôi phục dữ liệu tin tuyển dụng cho user ID ${currentUserId} từ localStorage`);
      }
    }
    
    // Nếu không có dữ liệu ở key riêng, thử lấy từ key chung
    if (!cachedJobs) {
      cachedJobs = localStorage.getItem('recruiterJobs');
      if (cachedJobs) {
        console.log('Khôi phục dữ liệu tin tuyển dụng từ key chung trong localStorage');
      }
    }
    
    if (cachedJobs) {
      try {
        const parsedJobs = JSON.parse(cachedJobs);
        if (Array.isArray(parsedJobs)) {
          console.log(`Đã khôi phục ${parsedJobs.length} tin tuyển dụng từ cache`);
          
          // Nếu có user ID, lưu vào key riêng để đảm bảo dữ liệu không bị mất
          if (currentUserId && cachedJobs === localStorage.getItem('recruiterJobs')) {
            localStorage.setItem(storageKey, cachedJobs);
            console.log(`Đã sao chép dữ liệu từ key chung sang key riêng cho user ${currentUserId}`);
          }
          
          return parsedJobs;
        }
      } catch (parseError) {
        console.error('Lỗi khi phân tích dữ liệu cached:', parseError);
      }
    }
    
    // Nếu không có cache hoặc cache không hợp lệ, sử dụng dữ liệu mẫu
    if (process.env.NODE_ENV === 'development') {
      console.log('Trả về dữ liệu mẫu cho môi trường phát triển');
      const mockData = [
        { id: 1, title: 'Senior Frontend Developer (ReactJS)', location: 'Hà Nội', applicants: 25, status: 'Đang hiển thị', salary: '2000 - 3000 USD', type: 'Full-time' },
        { id: 2, title: 'UI/UX Designer', location: 'TP. Hồ Chí Minh', applicants: 18, status: 'Đang hiển thị', salary: '1500 - 2500 USD', type: 'Full-time' },
        { id: 3, title: 'Project Manager', location: 'Từ xa', applicants: 32, status: 'Đã hết hạn', salary: '2500 - 3500 USD', type: 'Contract' },
      ];
      return mockData;
    }
    
    throw error;
  }
};

/**
 * Đăng tin tuyển dụng mới
 * @param {Object} jobData - Dữ liệu tin tuyển dụng
 */
const createJob = async (jobData) => {
  try {
    // Lấy user ID hiện tại để tạo key lưu trữ riêng
    const currentUserId = localStorage.getItem('current_employer_id');
    const storageKey = currentUserId ? `recruiterJobs_${currentUserId}` : 'recruiterJobs';
    
    // Đảm bảo rằng trạng thái mặc định là "Đang hiển thị"
    const jobDataToSubmit = { 
      ...jobData,
      status: jobData.status || "ACTIVE", // Sử dụng ACTIVE để phù hợp với backend
      employerId: parseInt(currentUserId) || null // Đảm bảo ID đúng định dạng số nguyên
    };
    
    // Chuyển đổi các trường để phù hợp với backend API
    const apiJobData = {
      employerId: jobDataToSubmit.employerId,
      title: jobDataToSubmit.title,
      description: jobDataToSubmit.description,
      location: jobDataToSubmit.location,
      salary: jobDataToSubmit.salary,
      jobType: jobDataToSubmit.type || "Full-time",
      industry: jobDataToSubmit.industry || "Công nghệ thông tin",
      experienceLevel: jobDataToSubmit.experienceLevel || "Không yêu cầu kinh nghiệm",
      skillsRequired: jobDataToSubmit.requirements || "",
      benefits: jobDataToSubmit.benefits || "",
      status: jobDataToSubmit.status
    };
    
    console.log('Đang đăng tin tuyển dụng mới lên API:', apiJobData);
    let response;
    try {
      response = await axios.post(`${API_URL}/jobs`, apiJobData, getAuthHeader());
    } catch (err) {
      // Nếu backend trả về lỗi, log chi tiết và ném lỗi rõ ràng
      if (err.response && err.response.data) {
        console.error('Lỗi từ backend khi đăng tin:', err.response.data);
        throw new Error(err.response.data.message || JSON.stringify(err.response.data));
      } else {
        console.error('Lỗi không xác định khi đăng tin:', err);
        throw new Error('Không thể kết nối tới máy chủ hoặc lỗi không xác định.');
      }
    }

    // Kiểm tra xem phản hồi có phải là HTML không (đăng nhập hoặc lỗi)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Received HTML response instead of JSON. Session may have expired.');
      throw new Error('Authentication session expired. Please login again.');
    }

    console.log('API response:', response.data);

    // Kiểm tra cấu trúc dữ liệu từ API
    let savedJob;
    if (response.data.data) {
      // Nếu API trả về cấu trúc {success, message, data}
      savedJob = response.data.data;
      if (response.data.success === false) {
        // Nếu backend trả về success=false, báo lỗi rõ ràng
        throw new Error(response.data.message || 'Đăng tin thất bại.');
      }
      console.log('Tin tuyển dụng đã được đăng thành công:', savedJob);
    } else if (response.data.success === false) {
      // Nếu backend trả về success=false mà không có data
      throw new Error(response.data.message || 'Đăng tin thất bại.');
    } else {
      // Nếu API trả về trực tiếp đối tượng job
      savedJob = response.data;
      console.log('Tin tuyển dụng đã được đăng thành công:', savedJob);
    }

    // Chuyển đổi dữ liệu từ API sang định dạng frontend cần
    const frontendJob = {
      id: savedJob.id,
      title: savedJob.title,
      location: savedJob.location,
      salary: savedJob.salary,
      type: savedJob.jobType || savedJob.type,
      status: savedJob.status === "ACTIVE" ? "Đang hiển thị" : savedJob.status,
      applicants: savedJob.applicationCount || 0,
      description: savedJob.description,
      requirements: savedJob.skillsRequired,
      benefits: savedJob.benefits,
      publishedAt: savedJob.createdDate,
      createdAt: savedJob.createdDate,
      industry: savedJob.industry,
      experienceLevel: savedJob.experienceLevel
    };

    // Cập nhật localStorage để UI hiển thị ngay lập tức (cache)
    try {
      // Cập nhật key chính
      updateLocalStorageJobs(storageKey, frontendJob, 'add');

      // Cập nhật cả key chung cho tương thích ngược
      if (storageKey !== 'recruiterJobs') {
        updateLocalStorageJobs('recruiterJobs', frontendJob, 'add');
      }

      console.log(`Đã cập nhật tin tuyển dụng mới vào localStorage với key: ${storageKey}`);
    } catch (e) {
      console.error('Lỗi khi cập nhật localStorage sau khi thêm tin mới:', e);
    }

    return frontendJob;
  } catch (error) {
    console.error('Error creating job posting:', error);
    
    // Trong trường hợp API gặp lỗi, tạm thời lưu vào localStorage
    if (process.env.NODE_ENV === 'development') {
      console.log('API error, saving to localStorage only for development');
      // Tạo ID ngẫu nhiên cho tin tuyển dụng mới
      const newJobId = Date.now();
      
      // Tạo đối tượng mới với chính xác cùng cấu trúc như mockJobs
      const mockData = {
        id: newJobId,
        title: jobData.title || "",
        location: jobData.location || "",
        salary: jobData.salary || "",
        type: jobData.type || "Full-time",
        status: jobData.status || "Đang hiển thị",
        applicants: 0, // Tin mới chưa có ứng viên
        description: jobData.description || "",
        requirements: jobData.requirements || "",
        benefits: jobData.benefits || "",
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      // Lưu vào localStorage
      const currentUserId = localStorage.getItem('current_employer_id');
      if (currentUserId) {
        const storageKey = `recruiterJobs_${currentUserId}`;
        updateLocalStorageJobs(storageKey, mockData, 'add');
      }
      
      console.log('Lưu vào localStorage thành công:', mockData);
      return mockData;
    }
    
    throw error;
  }
};

/**
 * Cập nhật tin tuyển dụng
 * @param {Number} jobId - ID của tin tuyển dụng
 * @param {Object} jobData - Dữ liệu cập nhật
 */
const updateJob = async (jobId, jobData) => {
  try {
    // Lấy user ID hiện tại để tạo key lưu trữ riêng
    const currentUserId = localStorage.getItem('current_employer_id');
    const storageKey = currentUserId ? `recruiterJobs_${currentUserId}` : 'recruiterJobs';
    
    // Chuyển đổi dữ liệu sang định dạng API cần
    const apiJobData = {
      employerId: parseInt(currentUserId),
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      salary: jobData.salary,
      jobType: jobData.type || jobData.jobType,
      industry: jobData.industry || "Công nghệ thông tin",
      experienceLevel: jobData.experienceLevel || "Không yêu cầu kinh nghiệm",
      skillsRequired: jobData.requirements || jobData.skillsRequired,
      benefits: jobData.benefits,
      status: jobData.status === "Đang hiển thị" ? "ACTIVE" : jobData.status
    };
    
    console.log(`Gửi request cập nhật tin tuyển dụng ID: ${jobId}`, apiJobData);
    const response = await axios.put(`${API_URL}/jobs/${jobId}`, apiJobData, getAuthHeader());
    
    // Kiểm tra xem phản hồi có phải là HTML không (đăng nhập hoặc lỗi)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Received HTML response instead of JSON. Session may have expired.');
      throw new Error('Authentication session expired. Please login again.');
    }
    
    console.log('API response:', response.data);
    
    // Xử lý phản hồi từ API
    let savedJob;
    if (response.data.data) {
      // Nếu API trả về cấu trúc {success, message, data}
      savedJob = response.data.data;
    } else {
      // Nếu API trả về trực tiếp đối tượng job
      savedJob = response.data;
    }
    
    // Chuyển đổi dữ liệu từ API sang định dạng frontend cần
    const frontendJob = {
      id: savedJob.id,
      title: savedJob.title,
      location: savedJob.location,
      salary: savedJob.salary,
      type: savedJob.jobType || savedJob.type,
      status: savedJob.status === "ACTIVE" ? "Đang hiển thị" : savedJob.status,
      applicants: savedJob.applicationCount || 0,
      description: savedJob.description,
      requirements: savedJob.skillsRequired || savedJob.requirements,
      benefits: savedJob.benefits,
      updatedAt: savedJob.updatedDate || new Date().toISOString(),
      industry: savedJob.industry,
      experienceLevel: savedJob.experienceLevel
    };
    
    // Cập nhật localStorage sau khi cập nhật tin tuyển dụng
    try {
      // Cập nhật key chính
      updateLocalStorageJobs(storageKey, frontendJob, 'update', jobId);
      
      // Cập nhật cả key chung cho tương thích ngược
      if (storageKey !== 'recruiterJobs') {
        updateLocalStorageJobs('recruiterJobs', frontendJob, 'update', jobId);
      }
      
      console.log(`Đã cập nhật tin tuyển dụng ID: ${jobId} trong localStorage`);
    } catch (e) {
      console.error('Lỗi khi cập nhật localStorage sau khi sửa tin:', e);
    }
    
    return frontendJob;
  } catch (error) {
    console.error(`Error updating job #${jobId}:`, error);
    
    // Trong trường hợp API gặp lỗi, cố gắng cập nhật localStorage
    if (process.env.NODE_ENV === 'development') {
      console.log('API error, updating localStorage only');
      
      const updatedJob = {
        id: jobId,
        title: jobData.title || "",
        location: jobData.location || "",
        salary: jobData.salary || "",
        type: jobData.type || "Full-time",
        status: jobData.status || "Đang hiển thị",
        applicants: jobData.applicants || 0,
        description: jobData.description || "",
        requirements: jobData.requirements || "",
        benefits: jobData.benefits || "",
        updatedAt: new Date().toISOString()
      };
      
      // Lưu vào localStorage
      try {
        const currentUserId = localStorage.getItem('current_employer_id');
        if (currentUserId) {
          const storageKey = `recruiterJobs_${currentUserId}`;
          updateLocalStorageJobs(storageKey, updatedJob, 'update', jobId);
        }
      } catch (e) {
        console.error('Lỗi khi cập nhật localStorage:', e);
      }
      
      return updatedJob;
    }
    
    throw error;
  }
};

/**
 * Xóa tin tuyển dụng
 * @param {Number} jobId - ID của tin tuyển dụng
 */
const deleteJob = async (jobId) => {
  try {
    // Lấy user ID hiện tại để tạo key lưu trữ riêng
    const currentUserId = localStorage.getItem('current_employer_id');
    const storageKey = currentUserId ? `recruiterJobs_${currentUserId}` : 'recruiterJobs';
    
    console.log(`Gửi request xóa tin tuyển dụng ID: ${jobId}`);
    const response = await axios.delete(`${API_URL}/jobs/${jobId}`, getAuthHeader());
    
    // Kiểm tra xem phản hồi có phải là HTML không (đăng nhập hoặc lỗi)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Received HTML response instead of JSON. Session may have expired.');
      throw new Error('Authentication session expired. Please login again.');
    }
    
    console.log('API response:', response.data);
    
    // Kiểm tra trạng thái phản hồi
    if (response.data && response.data.success === false) {
      console.error(`API trả về lỗi khi xóa tin ID: ${jobId}`, response.data);
      throw new Error(response.data.message || "Không thể xóa tin tuyển dụng");
    }
    
    console.log(`Xóa thành công tin tuyển dụng ID: ${jobId} từ database`);
    
    // Cập nhật localStorage sau khi xóa tin tuyển dụng
    try {
      // Xóa từ key chính
      updateLocalStorageJobs(storageKey, null, 'delete', jobId);
      
      // Xóa từ key chung cho tương thích ngược
      if (storageKey !== 'recruiterJobs') {
        updateLocalStorageJobs('recruiterJobs', null, 'delete', jobId);
      }
      
      console.log(`Đã xóa tin tuyển dụng ID: ${jobId} khỏi localStorage`);
    } catch (e) {
      console.error('Lỗi khi cập nhật localStorage sau khi xóa:', e);
    }
    
    return response.data || { success: true, message: "Xóa tin tuyển dụng thành công" };
  } catch (error) {
    console.error(`Error deleting job #${jobId}:`, error);
    
    // Kiểm tra lỗi từ API (có thể là do ràng buộc CSDL hoặc quyền)
    if (error.response && error.response.data) {
      console.error('API error response:', error.response.data);
      throw new Error(error.response.data.message || "Không thể xóa tin tuyển dụng");
    }
    
    // Kiểm tra nếu đang trong môi trường development và API_URL là localhost
    // và lỗi là network-related, thử thực hiện xóa trên localStorage
    if (process.env.NODE_ENV === 'development' && API_URL.includes('localhost') && 
        (error.message.includes('Network Error') || error.message.includes('timeout'))) {
      console.warn('Không thể kết nối đến backend API. Đang xóa từ localStorage...');
      
      // Thực hiện xóa từ localStorage
      const currentUserId = localStorage.getItem('current_employer_id');
      const storageKey = currentUserId ? `recruiterJobs_${currentUserId}` : 'recruiterJobs';
      
      try {
        updateLocalStorageJobs(storageKey, null, 'delete', jobId);
        
        if (storageKey !== 'recruiterJobs') {
          updateLocalStorageJobs('recruiterJobs', null, 'delete', jobId);
        }
        
        console.log(`[FALLBACK] Xóa tin tuyển dụng ID: ${jobId} từ localStorage thành công`);
        return { success: true, message: "Xóa tin tuyển dụng thành công (dữ liệu cục bộ)", deletedJobId: jobId };
      } catch (e) {
        console.error('Lỗi khi xóa từ localStorage (fallback):', e);
        throw new Error("Không thể xóa tin tuyển dụng, cả API và localStorage đều thất bại");
      }
    }
    
    throw error;
  }
};

/**
 * Lấy chi tiết tin tuyển dụng
 * @param {Number} jobId - ID của tin tuyển dụng
 */
const getJobDetails = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${jobId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error fetching job details #${jobId}:`, error);
    throw error;
  }
};

// ===== QUẢN LÝ ỨNG VIÊN =====
/**
 * Lấy danh sách ứng viên cho một tin tuyển dụng
 * @param {Number} jobId - ID của tin tuyển dụng
 */
const getApplicants = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${jobId}/applicants`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error fetching applicants for job #${jobId}:`, error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái của ứng viên
 * @param {Number} jobId - ID của tin tuyển dụng
 * @param {Number} applicantId - ID của ứng viên
 * @param {String} newStatus - Trạng thái mới
 */
const updateApplicantStatus = async (jobId, applicantId, newStatus) => {
  try {
    const response = await axios.patch(
      `${API_URL}/jobs/${jobId}/applicants/${applicantId}`, 
      { status: newStatus }, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating applicant #${applicantId} status:`, error);
    throw error;
  }
};

/**
 * Tải CV của ứng viên
 * @param {Number} jobId - ID của tin tuyển dụng
 * @param {Number} applicantId - ID của ứng viên
 */
const downloadCV = async (jobId, applicantId) => {
  try {
    // Trong trường hợp thực tế, bạn sẽ cần xử lý việc tải file
    // Đây là một mẫu đơn giản để lấy URL của CV
    const response = await axios.get(
      `${API_URL}/jobs/${jobId}/applicants/${applicantId}/cv`, 
      {
        ...getAuthHeader(),
        responseType: 'blob' // Quan trọng: để xử lý tải file
      }
    );
    
    // Tạo URL để tải xuống file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Tạo link tải xuống và click vào link đó
    const link = document.createElement('a');
    link.href = url;
    
    // Lấy tên file từ header hoặc sử dụng tên mặc định
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'cv.pdf'; // Mặc định
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return url; // Trả về URL nếu cần
  } catch (error) {
    console.error(`Error downloading CV for applicant #${applicantId}:`, error);
    throw error;
  }
};

const recruiterService = {
  getRecruiterJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobDetails,
  getApplicants,
  updateApplicantStatus,
  downloadCV
};

export default recruiterService;

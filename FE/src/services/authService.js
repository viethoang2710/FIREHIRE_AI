import api from './api';
import { AUTH_ENDPOINT } from './constants';
import * as dataStorageUtils from '../utils/dataStorageUtils';
// Helper: Lấy employerId từ userId (dùng cho EMPLOYER)
const getEmployerIdByUserId = async (userId) => {
  try {
    const res = await api.get(`/employers/user/${userId}`);
    if (res.data && res.data.data && res.data.data.employerId) {
      return res.data.data.employerId;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const AuthService = {
  getEmployerIdByUserId,
  register: async (userData) => {
    try {
      const endpoint = userData.role === 'employer'
        ? `${AUTH_ENDPOINT}/register/employer`
        : `${AUTH_ENDPOINT}/register/candidate`;

      console.log(`Sending registration data to ${endpoint}:`, { ...userData, password: '[REDACTED]' });
      console.log('Full API URL:', api.defaults.baseURL + endpoint);

      try {
        const response = await api.post(endpoint, userData);
        console.log('Registration response:', response.data);
        return response.data;
      } catch (networkError) {
        console.error('NETWORK ERROR DETAILS:');
        console.error('- Error name:', networkError.name);
        console.error('- Error message:', networkError.message);
        console.error('- Request URL:', networkError.config?.url);
        console.error('- Request method:', networkError.config?.method);
        console.error('- Request headers:', networkError.config?.headers);
        console.error('- Request data:', networkError.config?.data);
        console.error('- Response status:', networkError.response?.status);
        console.error('- Response data:', networkError.response?.data);
        console.error('- Is network error:', networkError.isAxiosError && !networkError.response);

        console.log('Attempting direct fetch to diagnose connection issues...');
        try {
          const testFetch = await fetch(api.defaults.baseURL + '/health', {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Direct fetch test result:', {
            ok: testFetch.ok,
            status: testFetch.status,
            statusText: testFetch.statusText
          });
        } catch (fetchError) {
          console.error('Direct fetch test failed:', fetchError.message);
        }

        throw networkError;
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: error.config?.url
      });
      throw error?.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post(`${AUTH_ENDPOINT}/login`, {
        email: credentials.email,
        password: credentials.password
      });

      // Xác định role từ nhiều nơi có thể
      let roleValue = null;
      if (response.data.role) {
        roleValue = response.data.role;
      } else if (response.data.user && response.data.user.role) {
        roleValue = response.data.user.role;
      } else if (response.data.authorities) {
        roleValue = response.data.authorities;
      } else if (typeof response.data === 'string' && response.data.includes('ROLE_')) {
        roleValue = response.data;
      }
      if (Array.isArray(roleValue) && roleValue.length > 0) {
        roleValue = roleValue[0].authority || roleValue[0];
      }
      if (!roleValue) {
        if (credentials.email.includes('admin')) {
          roleValue = 'ADMIN';
        } else if (credentials.email.includes('hr') || 
                  credentials.email.includes('recruit') || 
                  credentials.email.includes('company') || 
                  credentials.email.includes('employer')) {
          roleValue = 'EMPLOYER';
        } else {
          roleValue = 'CANDIDATE';
        }
      }

      // Lấy employerId nếu có (ưu tiên từ response, nếu không có thì fetch từ API riêng)
      let employerId = null;
      if (response.data.employerId) {
        employerId = response.data.employerId;
      } else if (response.data.user && response.data.user.employerId) {
        employerId = response.data.user.employerId;
      } else if (roleValue === 'EMPLOYER' && (response.data.userId || response.data.user?.id)) {
        // Nếu là employer, fetch employerId từ API
        try {
          const userId = response.data.userId || response.data.user?.id;
          const employerRes = await api.get(`/employers/user/${userId}`);
          if (employerRes.data && employerRes.data.data && employerRes.data.data.employerId) {
            employerId = employerRes.data.data.employerId;
          }
        } catch (e) {
          // Không tìm thấy employerId
        }
      }

      const userData = {
        email: credentials.email,
        role: roleValue,
        fullName: response.data.fullName || response.data.user?.fullName || 'User',
        employerId: employerId,
        id: response.data.userId || response.data.user?.id || null
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token || 'temp-token');
      localStorage.setItem('role', roleValue);
      if (employerId) {
        localStorage.setItem('current_employer_id', employerId);
      } else {
        localStorage.removeItem('current_employer_id');
      }
      try {
        localStorage.setItem('debug_response', JSON.stringify(response.data));
      } catch (e) {}
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    // Lưu user ID trước khi đăng xuất
    const currentUserId = localStorage.getItem('current_employer_id');
    
    // Đảm bảo sao lưu dữ liệu tin tuyển dụng trước khi đăng xuất
    if (currentUserId) {
      console.log(`Đang sao lưu dữ liệu cho user ${currentUserId} trước khi đăng xuất...`);
      
      try {
        // Sử dụng hàm tiện ích dataStorageUtils
        const migrated = dataStorageUtils.migrateJobsToUserStorage(currentUserId);
        console.log(`Kết quả sao lưu dữ liệu: ${migrated ? 'thành công' : 'không có thay đổi'}`);
        
        // Kiểm tra lại dữ liệu sau khi sao lưu
        if (dataStorageUtils.hasUserJobData(currentUserId)) {
          const userJobs = dataStorageUtils.getUserJobData(currentUserId);
          console.log(`Đã sao lưu ${userJobs.length} tin tuyển dụng cho user ID ${currentUserId}`);
        }
      } catch (e) {
        console.error('Lỗi khi sao lưu dữ liệu tin tuyển dụng:', e);
        
        // Xử lý dự phòng nếu có lỗi
        const userJobsKey = `recruiterJobs_${currentUserId}`;
        const recruiterJobs = localStorage.getItem('recruiterJobs');
        const userSpecificJobs = localStorage.getItem(userJobsKey);
        
        // Nếu có dữ liệu ở key chung mà chưa có ở key riêng, sao chép sang
        if (recruiterJobs && !userSpecificJobs) {
          localStorage.setItem(userJobsKey, recruiterJobs);
          console.log(`Sao lưu dữ liệu tin tuyển dụng cho user ${currentUserId} trước khi đăng xuất`);
        }
      }
      
      // Lưu ID người dùng vào danh sách đã đăng nhập
      const knownUsers = localStorage.getItem('known_employer_ids') || '[]';
      try {
        const userList = JSON.parse(knownUsers);
        if (!userList.includes(currentUserId)) {
          userList.push(currentUserId);
          localStorage.setItem('known_employer_ids', JSON.stringify(userList));
          console.log(`Đã thêm userId ${currentUserId} vào danh sách người dùng đã biết`);
        }
      } catch (e) {
        console.error('Lỗi khi lưu danh sách người dùng:', e);
      }
    }
    
    // Xóa các thông tin xác thực
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('current_employer_id');
    
    // Không xóa dữ liệu tin tuyển dụng đã lưu trong localStorage
    // Để đảm bảo bài đăng không bị mất sau khi đăng xuất
    console.log('Đăng xuất thành công, giữ nguyên dữ liệu tin tuyển dụng');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  setupAxiosInterceptors: () => {
    api.interceptors.request.use(
      config => {
        const token = AuthService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
};

export default AuthService;

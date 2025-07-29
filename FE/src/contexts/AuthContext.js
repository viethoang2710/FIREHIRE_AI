import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import * as dataStorageUtils from '../utils/dataStorageUtils';

// Create the Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = authService.getCurrentUser();
    const role = localStorage.getItem('role');
    if (user) {
      setCurrentUser(user);
      setUserRole(role);
    }
    setIsLoading(false);
  }, []);

  // ✅ Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API login
      const response = await authService.login(credentials); // { token, role }

      const user = authService.getCurrentUser(); // lấy lại user đã lưu
      let role = null;
      if (response && response.role) {
        role = response.role;
      }
      if (!role && user && user.role) {
        role = user.role;
      }
      if (!role) {
        const storageRole = localStorage.getItem('role');
        if (storageRole) {
          role = storageRole;
        }
      }
      setCurrentUser(user);
      setUserRole(role);
      const normalizedRole = normalizeRole(role);
      localStorage.setItem('normalized_role', normalizedRole);

      // Đảm bảo employerId luôn được lưu vào localStorage nếu có
      if (normalizedRole === 'EMPLOYER') {
        let employerId = null;
        if (user && user.employerId) {
          employerId = user.employerId;
        } else if (user && user.id) {
          // Nếu chưa có employerId, thử fetch từ API
          try {
            const res = await authService.getEmployerIdByUserId(user.id);
            if (res) employerId = res;
          } catch (e) {}
        }
        if (employerId) {
          localStorage.setItem('current_employer_id', employerId);
        }
        // migrate dữ liệu nếu cần
        if (user && (user.employerId || user.id)) {
          const migrateId = employerId || user.id;
          try {
            const migrated = dataStorageUtils.migrateJobsToUserStorage(migrateId);
            if (dataStorageUtils.hasUserJobData(migrateId)) {
              const userJobs = dataStorageUtils.getUserJobData(migrateId);
              console.log(`Tìm thấy ${userJobs.length} tin tuyển dụng đã lưu cho user ID ${migrateId}`);
            }
            const knownUsers = JSON.parse(localStorage.getItem('known_employer_ids') || '[]');
            if (!knownUsers.includes(migrateId)) {
              knownUsers.push(migrateId);
              localStorage.setItem('known_employer_ids', JSON.stringify(knownUsers));
            }
          } catch (e) {}
        }
      }
      return role;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[AuthContext] Registering user:', { ...userData, password: '[REDACTED]' });
      const result = await authService.register(userData);
      return result;
    } catch (err) {
      console.error('[AuthContext] Registration error:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setUserRole(null);
  };

  // Chuẩn hóa role để đảm bảo nhất quán
  const normalizeRole = (role) => {
    console.log("🔍 normalizeRole() received:", role, "type:", typeof role);
    
    if (!role) {
      console.log("⚠️ Empty role, returning default CANDIDATE");
      return 'CANDIDATE';
    }
    
    // Chuyển đổi role sang chuỗi nếu nó là một đối tượng
    let roleString = typeof role === 'object' ? JSON.stringify(role) : String(role);
    const roleLower = roleString.toUpperCase();
    
    console.log("🔍 Normalized to uppercase:", roleLower);
    
    // Danh sách các giá trị có thể là ADMIN
    const adminRoles = ['ADMIN', 'ROLE_ADMIN', 'ADMINISTRATOR'];
    
    // Danh sách các giá trị có thể là EMPLOYER
    const employerRoles = [
      'EMPLOYER', 'RECRUITER', 'ROLE_EMPLOYER', 'ROLE_RECRUITER', 
      'COMPANY', 'NTD', 'NHA_TUYEN_DUNG', 'HR', 'HIRING_MANAGER'
    ];
    
    // Kiểm tra xem role có chứa bất kỳ chuỗi con nào trong danh sách
    const containsAdmin = adminRoles.some(r => roleLower.includes(r));
    const containsEmployer = employerRoles.some(r => roleLower.includes(r));
    
    if (containsAdmin || adminRoles.includes(roleLower)) {
      console.log("✅ Identified as ADMIN");
      return 'ADMIN';
    } else if (containsEmployer || employerRoles.includes(roleLower)) {
      console.log("✅ Identified as EMPLOYER");
      return 'EMPLOYER';
    } else {
      console.log("✅ Fallback to CANDIDATE");
      return 'CANDIDATE';
    }
  };

  // ✅ Giá trị cung cấp cho toàn app
  const value = {
    currentUser,
    userRole,
    role: userRole, // Để tương thích với code cũ
    isAuthenticated: () => authService.isAuthenticated(),
    isLoading,
    error,
    login,
    register,
    logout,
    normalizeRole,
    // Hàm helper để lấy role dễ dàng
    getRole: () => {
      const stateRole = userRole;
      const storageRole = localStorage.getItem('role');
      
      console.log("🔍 getRole() - State role:", stateRole);
      console.log("🔍 getRole() - Storage role:", storageRole);
      
      // Ưu tiên userRole từ state, nếu không có thì lấy từ localStorage
      const effectiveRole = stateRole || storageRole || 'CANDIDATE';
      console.log("🔍 getRole() - Effective role:", effectiveRole);
      
      return effectiveRole;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

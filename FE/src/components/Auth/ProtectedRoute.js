import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  // Chuẩn hóa các allowedRoles thành chữ hoa cho nhất quán
  const normalizedAllowedRoles = allowedRoles.map(role => 
    auth.normalizeRole(role)
  );
  
  // Lấy role hiện tại từ nhiều nguồn và chuẩn hóa
  const rawRole = auth.getRole ? auth.getRole() : (auth.role || localStorage.getItem('role'));
  const userRole = auth.normalizeRole(rawRole);

  console.log('===== PROTECTED ROUTE DEBUGGING =====');
  console.log('Current Role (raw):', rawRole);
  console.log('Current Role (normalized):', userRole);
  console.log('Allowed Roles (original):', allowedRoles);
  console.log('Allowed Roles (normalized):', normalizedAllowedRoles);
  console.log('Has Access:', normalizedAllowedRoles.includes(userRole));
  console.log('====================================');

  useEffect(() => {
    // Debug logs to help troubleshoot
    console.log('ProtectedRoute Effect - Is authenticated:', auth.isAuthenticated());
    console.log('ProtectedRoute Effect - Role:', userRole);
    
    // Tự động chuyển hướng theo role khi người dùng đã đăng nhập
    if (auth.isAuthenticated()) {
      console.log('ProtectedRoute - User authenticated with role:', userRole);
      
      // Kiểm tra nếu người dùng không có quyền truy cập vào trang hiện tại
      if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
        console.log('ProtectedRoute - User does not have permission for this page');
        
        // Chuyển hướng dựa trên vai trò
        if (userRole === "ADMIN") {
          console.log('ProtectedRoute - Redirecting to admin dashboard');
          navigate('/admin-dashboard');
        } else if (userRole === "EMPLOYER") {
          console.log('ProtectedRoute - Redirecting to recruiter dashboard');
          navigate('/recruiter-dashboard');
        } else {
          console.log('ProtectedRoute - Redirecting to homepage');
          navigate('/');
        }
      }
    }
  }, [userRole, navigate, normalizedAllowedRoles, auth]);

  // Nếu không xác thực, chuyển hướng đến trang login
  if (!auth.isAuthenticated()) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Nếu có quy định về role và user không có quyền truy cập
  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    console.log('ProtectedRoute - No access, redirecting based on role');
    
    // Điều chỉnh logic chuyển hướng dựa trên vai trò
    if (userRole === "ADMIN") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (userRole === "EMPLOYER") {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Nếu mọi thứ OK, hiển thị nội dung được bảo vệ
  console.log('ProtectedRoute - Access granted, rendering children');
  return children;
};

export default ProtectedRoute;

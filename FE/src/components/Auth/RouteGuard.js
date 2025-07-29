import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RouteGuard = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip redirect checks for public routes
    const publicRoutes = ['/login', '/register', '/', '/job-search', '/network-debug', '/api-test'];
    if (publicRoutes.includes(location.pathname)) {
      console.log("RouteGuard - On public route:", location.pathname);
      return;
    }

    // If user is authenticated, check role-based access
    if (auth.isAuthenticated()) {
      // Sử dụng getRole() nếu có, nếu không thì dùng cách cũ
      const rawRole = auth.getRole ? auth.getRole() : (auth.role || localStorage.getItem('role'));
      const userRole = auth.normalizeRole(rawRole);
      console.log("RouteGuard - User authenticated with role:", userRole);

      // Role-based redirects for main dashboard routes
      if (location.pathname === '/admin-dashboard' && userRole !== 'ADMIN') {
        console.log("RouteGuard - Non-admin accessing admin dashboard, redirecting");
        navigate(userRole === 'EMPLOYER' ? '/recruiter-dashboard' : '/');
        return;
      }

      if (location.pathname === '/recruiter-dashboard' && userRole !== 'EMPLOYER') {
        console.log("RouteGuard - Non-employer accessing recruiter dashboard, redirecting");
        navigate(userRole === 'ADMIN' ? '/admin-dashboard' : '/');
        return;
      }

    } else {
      // For non-public routes, redirect to login if not authenticated
      console.log("RouteGuard - User not authenticated, redirecting to login");
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [auth, location.pathname, navigate]);

  return <>{children}</>;
};

export default RouteGuard;

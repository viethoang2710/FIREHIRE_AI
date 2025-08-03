import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import HeroSection from '../components/HomePageSections/HeroSection';
import FeaturedJobs from '../components/HomePageSections/FeaturedJobs';
import AIFilterSection from '../components/HomePageSections/AIFilterSection';
import TopCompanies from '../components/HomePageSections/TopCompanies';
import PopularCategories from '../components/HomePageSections/PopularCategories';
import CareerAdviceSection from '../components/HomePageSections/CareerAdviceSection';
import CVBuilderIntro from '../components/HomePageSections/CVBuilderIntro';
import UsefulToolsIntro from '../components/HomePageSections/UsefulToolsIntro';


const HomePage = ({ showAlert }) => {
  const { currentUser, normalizeRole } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Kiểm tra role từ nhiều nguồn để đảm bảo không bỏ sót
  const userRoleFromStorage = localStorage.getItem('role') || '';
  const userRoleFromContext = currentUser?.role || '';
  
  // Logic chuyển hướng ngay khi component được khởi tạo - không đợi useEffect
  const checkAndRedirect = () => {
    // Ghi log chi tiết để debug
    console.log("--- HOMEPAGE ROLE CHECK (DIRECT) ---");
    console.log("Role from localStorage:", userRoleFromStorage);
    console.log("Role from AuthContext:", userRoleFromContext);
    console.log("currentUser object:", currentUser);
    
    // Lấy role từ bất kỳ nguồn nào có sẵn, ưu tiên localStorage
    const effectiveRole = userRoleFromStorage || userRoleFromContext;
    console.log("Effective role being used:", effectiveRole);
    
    if (effectiveRole) {
      // Sử dụng hàm normalizeRole từ context nếu có
      const normalizedRole = normalizeRole ? normalizeRole(effectiveRole) : effectiveRole.toUpperCase();
      console.log("Normalized role:", normalizedRole);
      
      // Thực hiện chuyển hướng dựa vào vai trò đã chuẩn hóa
      if (normalizedRole === "EMPLOYER") {
        console.log("⚠️ EMPLOYER detected - redirecting to recruiter dashboard");
        navigate("/recruiter-dashboard", { replace: true });
        return true; // Đã chuyển hướng
      } else if (normalizedRole === "ADMIN") {
        console.log("⚠️ ADMIN detected - redirecting to admin dashboard");
        navigate("/admin-dashboard", { replace: true });
        return true; // Đã chuyển hướng
      }
    }
    return false; // Không chuyển hướng
  };
  
  // Thực hiện kiểm tra ngay lập tức
  const redirected = checkAndRedirect();
  
  // Sử dụng useEffect để thực hiện kiểm tra lại khi component mount
  useEffect(() => {
    console.log("HomePage - useEffect running");
    if (!redirected) {
      console.log("HomePage - Performing secondary redirect check");
      checkAndRedirect();
    }
  }, [navigate]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <HeroSection />
      <FeaturedJobs showAlert={showAlert} />
      <AIFilterSection showAlert={showAlert} />
      <TopCompanies />
      <PopularCategories />
      <CareerAdviceSection />
      <CVBuilderIntro />
      <UsefulToolsIntro />
    </main>
  );
};

export default HomePage;

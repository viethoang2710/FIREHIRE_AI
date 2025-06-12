import React, { useState } from 'react';

// Import Pages
import HomePage from './pages/HomePage';
import JobSearchPage from './pages/JobSearchPage';
import CompanyProfilePage from './pages/CompanyProfilePage'; // <-- Đảm bảo dòng này import từ CompanyProfilePage.js
import CareerHandbookPage from './pages/CareerHandbookPage';
import CVBuilderPage from './pages/CVBuilderPage';

// Import các trang mới đã tạo cho mục Việc làm
import JobsByIndustryPage from './pages/JobsByIndustryPage';
import JobsByLocationPage from './pages/JobsByLocationPage';
import CompaniesPage from './pages/CompaniesPage'; // <-- Sửa lại dòng này để import từ CompaniesPage.js
import HotLatestJobsPage from './pages/HotLatestJobsPage';

// Import các trang CV mới được tạo
import CVTemplatesPage from './pages/CVTemplatesPage'; // <-- Bỏ comment dòng này
import CVGuidePage from './pages/CVGuidePage';
import CVConsultingPage from './pages/CVConsultingPage';

// Import các trang Cẩm nang mới được tạo
import InterviewConsultingPage from './pages/InterviewConsultingPage';
import WorkSkillsPage from './pages/WorkSkillsPage';
import SelfImprovementPage from './pages/SelfImprovementPage';

// Import các trang Công cụ mới được tạo
import GrossToNetSalaryPage from './pages/GrossToNetSalaryPage';
import MBTITestPage from './pages/MBTITestPage';
import SalaryComparisonPage from './pages/SalaryComparisonPage';
import CVAnalysisToolPage from './pages/CVAnalysisToolPage';

// Import Auth Components (sử dụng khi chưa đăng nhập)
import RegistrationPage from './components/Auth/RegistrationPage';
import LoginPage from './components/Auth/LoginPage';

// Import UI Components
import AlertMessage from './components/UI/AlertMessage';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

function App() {
  const [currentPage, setCurrentPageInternal] = useState('homepage');
  const [pageParams, setPageParams] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'Người dùng A', avatar: 'https://placehold.co/40x40/007bff/ffffff?text=A' });
  const [alert, setAlert] = useState(null);

  const navigate = (page, params = {}) => {
    setCurrentPageInternal(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, duration);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({ name: 'Người dùng A', avatar: 'https://placehold.co/40x40/007bff/ffffff?text=A' });
    navigate('homepage');
    showAlert('Đăng nhập thành công!', 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    navigate('homepage');
    showAlert('Đăng xuất thành công.', 'success');
  };

  const handleRegister = (userData) => {
    setIsLoggedIn(true);
    setUser({ name: userData.fullName || 'Người dùng Mới', avatar: `https://placehold.co/40x40/28a745/ffffff?text=${(userData.fullName || 'M').charAt(0).toUpperCase()}` });
    navigate('homepage');
    showAlert('Đăng ký thành công! Chào mừng bạn.', 'success');
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'homepage':
        return <HomePage navigate={navigate} showAlert={showAlert} />;
      case 'jobSearch':
        return <JobSearchPage navigate={navigate} />;
      case 'jobsByIndustry':
        return <JobsByIndustryPage navigate={navigate} industrySlug={pageParams.slug} />;
      case 'jobsByLocation':
        return <JobsByLocationPage navigate={navigate} locationSlug={pageParams.slug} />;
      case 'companies':
        return <CompaniesPage navigate={navigate} />;
      case 'hotLatestJobs':
        return <HotLatestJobsPage navigate={navigate} />;
      case 'companyProfile':
        return <CompanyProfilePage navigate={navigate} companyId={pageParams.id} />;
      case 'careerHandbook':
        return <CareerHandbookPage navigate={navigate} />;
      case 'cvBuilder':
        return <CVBuilderPage navigate={navigate} />;
      case 'cvTemplates':
        return <CVTemplatesPage navigate={navigate} />;
      case 'cvGuide':
        return <CVGuidePage navigate={navigate} />;
      case 'cvConsulting':
        return <CVConsultingPage navigate={navigate} showAlert={showAlert} />;
      case 'interviewConsulting':
        return <InterviewConsultingPage navigate={navigate} />;
      case 'workSkills':
        return <WorkSkillsPage navigate={navigate} />;
      case 'selfImprovement':
        return <SelfImprovementPage navigate={navigate} />;
      case 'grossToNetSalary':
        return <GrossToNetSalaryPage navigate={navigate} />;
      case 'mbtiTest':
        return <MBTITestPage navigate={navigate} />;
      case 'salaryComparison':
        return <SalaryComparisonPage navigate={navigate} />;
      case 'cvAnalysisTool':
        return <CVAnalysisToolPage navigate={navigate} showAlert={showAlert} />;
      default:
        return <HomePage navigate={navigate} showAlert={showAlert} />;
    }
  };

  if (currentPage === 'login') {
    return <LoginPage navigate={navigate} handleLogin={handleLogin} showAlert={showAlert} />;
  }
  if (currentPage === 'register') {
    return <RegistrationPage navigate={navigate} handleRegister={handleRegister} showAlert={showAlert} />;
  }

  return (
    <div className="font-inter antialiased bg-gray-100 flex flex-col min-h-screen">
      {alert && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <Header navigate={navigate} isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <main className="flex-grow">
        {renderPageContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
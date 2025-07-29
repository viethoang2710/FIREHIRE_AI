import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './contexts/NavigationContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verifyDataIntegrity } from './utils/dataStorageUtils';

// Layout & UI
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import AlertMessage from './components/UI/AlertMessage';
import Chatbot from './components/UI/Chatbot';

// Auth Pages
import LoginPage from './components/Auth/LoginPage';
import RegistrationPage from './components/Auth/RegistrationPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RouteGuard from './components/Auth/RouteGuard';

// Main Pages
import HomePage from './pages/HomePage';
import JobSearchPage from './pages/JobSearchPage';
import JobsByIndustryPage from './pages/JobsByIndustryPage';
import JobsByLocationPage from './pages/JobsByLocationPage';
import HotLatestJobsPage from './pages/HotLatestJobsPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import CVBuilderPage from './pages/CVBuilderPage';
import CVTemplatesPage from './pages/CVTemplatesPage';
import CVGuidePage from './pages/CVGuidePage';
import CVConsultingPage from './pages/CVConsultingPage';
import GrossToNetSalaryPage from './pages/GrossToNetSalaryPage';
import MBTITestPage from './pages/MBTITestPage';
import SalaryComparisonPage from './pages/SalaryComparisonPage';
import CVAnalysisToolPage from './pages/CVAnalysisToolPage';
import InterviewConsultingPage from './pages/InterviewConsultingPage';
import WorkSkillsPage from './pages/WorkSkillsPage';
import SelfImprovementPage from './pages/SelfImprovementPage';
import CareerHandbookPage from './pages/CareerHandbookPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import NetworkDebugPage from './pages/NetworkDebugPage';
import ApiTestPage from './pages/ApiTestPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage'; // <-- Import trang mới
import ViewApplicantsPage from './pages/ViewApplicantsPage'; // <-- Import trang mới
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginDebugPage from './pages/LoginDebugPage';
import StorageDebugPage from './pages/StorageDebugPage';

function App() {
  const [alert, setAlert] = useState(null);
  
  // Verify data integrity when the app starts
  useEffect(() => {
    console.log('App started - verifying data integrity');
    verifyDataIntegrity();
  }, []);

  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), duration);
  };

  return (
    <AuthProvider>
      <NavigationProvider>
        <div className="font-inter bg-gray-50 min-h-screen">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          {alert && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
          <Header showAlert={showAlert} />

          <main className="min-h-[calc(100vh-64px-200px)]">
            <RouteGuard>
              <Routes>
                {/* HomePage - sẽ tự chuyển hướng ADMIN và EMPLOYER sang trang của họ */}
                <Route path="/" element={
                  <HomePage showAlert={showAlert} />
                } />
              <Route path="/login" element={<LoginPage showAlert={showAlert} />} />
              <Route path="/register" element={<RegistrationPage showAlert={showAlert} />} />
              <Route path="/job-search" element={<JobSearchPage showAlert={showAlert} />} />
              <Route path="/jobs-by-industry" element={<JobsByIndustryPage showAlert={showAlert} />} />
              <Route path="/jobs-by-location" element={<JobsByLocationPage showAlert={showAlert} />} />
              <Route path="/hot-latest-jobs" element={<HotLatestJobsPage showAlert={showAlert} />} />
              <Route path="/companies" element={<CompanyProfilePage showAlert={showAlert} />} />
              <Route path="/cv-builder" element={<CVBuilderPage showAlert={showAlert} />} />
              <Route path="/cv-templates" element={<CVTemplatesPage showAlert={showAlert} />} />
              <Route path="/cv-guide" element={<CVGuidePage showAlert={showAlert} />} />
              <Route path="/cv-consulting" element={<CVConsultingPage showAlert={showAlert} />} />
              <Route path="/gross-to-net-salary" element={<GrossToNetSalaryPage showAlert={showAlert} />} />
              <Route path="/mbti-test" element={<MBTITestPage showAlert={showAlert} />} />
              <Route path="/salary-comparison" element={<SalaryComparisonPage showAlert={showAlert} />} />
              <Route path="/cv-analysis-tool" element={<CVAnalysisToolPage showAlert={showAlert} />} />
              <Route path="/interview-consulting" element={<InterviewConsultingPage showAlert={showAlert} />} />
              <Route path="/work-skills" element={<WorkSkillsPage showAlert={showAlert} />} />
              <Route path="/self-improvement" element={<SelfImprovementPage showAlert={showAlert} />} />
              <Route path="/career-handbook" element={<CareerHandbookPage showAlert={showAlert} />} />
              <Route path="/profile" element={<ProfilePage showAlert={showAlert} />} />
              <Route path="/network-debug" element={<NetworkDebugPage />} />
              <Route path="/api-test" element={<ApiTestPage />} />
              <Route path="/login-debug" element={<LoginDebugPage />} />
              <Route path="/storage-debug" element={<StorageDebugPage />} />
              
              {/* --- THÊM ROUTE MỚI CHO CÁC VAI TRÒ (Có bảo vệ) --- */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/recruiter-dashboard" element={
                <ProtectedRoute allowedRoles={['EMPLOYER', 'employer']}>
                  <RecruiterDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/jobs/:jobId/applicants" element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <ViewApplicantsPage />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFoundPage showAlert={showAlert} />} />
            </Routes>
            </RouteGuard>
          </main>

          <Footer />
          <Chatbot />
        </div>
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Users, Briefcase, BarChart3, Activity, Settings, Shield, LogOut, Download, FileText } from 'lucide-react';
import '../styles/AdminDashboard.css';

// Import admin components
import UserManagement from '../components/Admin/UserManagement';
import JobManagement from '../components/Admin/JobManagement';
import SystemStatistics from '../components/Admin/SystemStatistics';
import RecentActivity from '../components/Admin/RecentActivity';
import NotificationSystem from '../components/Admin/NotificationSystem';
import DataExport from '../components/Admin/DataExport';
import ApplicationManagement from '../components/Admin/ApplicationManagement';

function AdminDashboardPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    // Kiểm tra quyền người dùng
    if (!auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Sử dụng getRole() nếu có, nếu không thì dùng cách cũ
    const rawRole = auth.getRole ? auth.getRole() : (auth.role || localStorage.getItem('role'));
    const userRole = auth.normalizeRole(rawRole);
    console.log("AdminDashboardPage - Raw role:", rawRole);
    console.log("AdminDashboardPage - Normalized role:", userRole);
    
    if (userRole !== 'ADMIN') {
      console.log("Redirecting non-admin user to appropriate page");
      // Chuyển hướng về trang phù hợp với vai trò
      if (userRole === 'EMPLOYER') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [auth, navigate]);

  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
    { id: 'jobs', label: 'Quản lý công việc', icon: Briefcase },
    { id: 'applications', label: 'Quản lý CV ứng tuyển', icon: FileText },
    { id: 'statistics', label: 'Thống kê hệ thống', icon: BarChart3 },
    { id: 'activity', label: 'Hoạt động gần đây', icon: Activity },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'users':
        return <UserManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'applications':
        return <ApplicationManagement showAlert={(message, type) => console.log(message, type)} />;
      case 'statistics':
        return <SystemStatistics />;
      case 'activity':
        return <RecentActivity />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-white admin-dashboard flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 admin-sidebar shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="admin-sidebar-header">
          <Shield className="h-8 w-8 text-white mr-2" />
          <span className="text-white text-xl font-bold">Admin Panel</span>
        </div>
        
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="admin-nav-item">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`admin-nav-button ${
                    activeTab === item.id ? 'active' : ''
                  }`}
                >
                  <IconComponent className="mr-4 h-6 w-6" />
                  {item.label}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={() => {
              auth.logout();
              navigate('/login');
            }}
            className="admin-nav-button w-full"
          >
            <LogOut className="mr-4 h-6 w-6" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Page content */}
        <main className="flex-1 w-full">
          {/* Page Title Bar - Ẩn khi ở trang overview */}
          {activeTab !== 'overview' && (
            <div className="flex justify-between items-center mb-6 bg-blue-600 p-4 shadow-sm border-b w-full relative z-10">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-white hover:text-blue-100 lg:hidden mr-4"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-2xl font-semibold text-white">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Admin Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-blue-400 shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất dữ liệu
                </button>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <span className="text-sm font-medium text-white">Admin</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Thanh tài khoản riêng cho trang overview */}
          {activeTab === 'overview' && (
            <div className="flex justify-between items-center mb-6 p-4 w-full relative z-10">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-gray-800 lg:hidden mr-4"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          )}
          
          <div className="px-4 w-full relative z-10">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Modals and Overlays */}
      <DataExport 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
      
      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
}

// Dashboard Overview Component
const DashboardOverview = ({ setActiveTab }) => {
  const stats = [
    { name: 'Tổng người dùng', value: '1,250', change: '+23', changeType: 'increase', icon: Users },
    { name: 'Tổng công việc', value: '340', change: '+8', changeType: 'increase', icon: Briefcase },
    { name: 'Ứng tuyển hôm nay', value: '67', change: '+15', changeType: 'increase', icon: Activity },
    { name: 'Tỷ lệ thành công', value: '3.2%', change: '+0.5%', changeType: 'increase', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-up">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const cardClasses = [
            'stats-card-users',
            'stats-card-jobs', 
            'stats-card-applications',
            'stats-card-success'
          ];
          return (
            <div key={stat.name} className={`stats-card ${cardClasses[index]} fade-in-scale`} style={{animationDelay: `${index * 0.1}s`}}>
              <div className="stats-card-icon">
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div className="stats-card-value text-xl">{stat.value}</div>
              <div className="text-xs font-medium text-white opacity-90 mb-1">{stat.name}</div>
              <div className="stats-card-change">
                <span className="text-white text-sm">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card fade-in-up" style={{animationDelay: '0.4s'}}>
        <h3 className="text-base font-medium text-gray-900 mb-4 text-gradient">Thao tác nhanh</h3>
        <div className="quick-actions-grid">
          <button 
            onClick={() => setActiveTab('users')}
            className="quick-action slide-in-right"
            style={{animationDelay: '0.1s'}}
          >
            <div className="quick-action-icon quick-action-icon-users">
              <Users className="h-6 w-6" />
            </div>
            <p className="quick-action-title text-sm">Quản lý người dùng</p>
            <p className="quick-action-description text-xs">Xem và quản lý tất cả người dùng</p>
          </button>
          
          <button 
            onClick={() => setActiveTab('jobs')}
            className="quick-action slide-in-right"
            style={{animationDelay: '0.2s'}}
          >
            <div className="quick-action-icon quick-action-icon-jobs">
              <Briefcase className="h-6 w-6" />
            </div>
            <p className="quick-action-title text-sm">Duyệt công việc</p>
            <p className="quick-action-description text-xs">Kiểm duyệt tin tuyển dụng mới</p>
          </button>
          
          <button 
            onClick={() => setActiveTab('statistics')}
            className="quick-action slide-in-right"
            style={{animationDelay: '0.3s'}}
          >
            <div className="quick-action-icon quick-action-icon-stats">
              <BarChart3 className="h-6 w-6" />
            </div>
            <p className="quick-action-title text-sm">Xem thống kê</p>
            <p className="quick-action-description text-xs">Báo cáo và phân tích dữ liệu</p>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className="quick-action slide-in-right"
            style={{animationDelay: '0.4s'}}
          >
            <div className="quick-action-icon quick-action-icon-settings">
              <Settings className="h-6 w-6" />
            </div>
            <p className="quick-action-title text-sm">Cài đặt hệ thống</p>
            <p className="quick-action-description text-xs">Cấu hình và tùy chỉnh</p>
          </button>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="dashboard-card fade-in-up" style={{animationDelay: '0.6s'}}>
        <h3 className="text-base font-medium text-gray-900 mb-4 text-gradient">Hoạt động gần đây</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 slide-in-right" style={{animationDelay: '0.1s'}}>
            <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full pulse-animation"></div>
            <p className="text-sm text-gray-600 flex-1">23 người dùng mới đăng ký hôm nay</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">2 giờ trước</span>
          </div>
          <div className="flex items-center space-x-3 slide-in-right" style={{animationDelay: '0.2s'}}>
            <div className="h-2 w-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full pulse-animation" style={{animationDelay: '0.5s'}}></div>
            <p className="text-sm text-gray-600 flex-1">8 tin tuyển dụng mới được đăng</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">3 giờ trước</span>
          </div>
          <div className="flex items-center space-x-3 slide-in-right" style={{animationDelay: '0.3s'}}>
            <div className="h-2 w-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full pulse-animation" style={{animationDelay: '1s'}}></div>
            <p className="text-sm text-gray-600 flex-1">67 đơn ứng tuyển mới</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">5 giờ trước</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// System Settings Component (placeholder)
const SystemSettings = () => {
  return (
    <div className="dashboard-card fade-in-up">
      <h3 className="text-lg font-medium text-gray-900 mb-4 text-gradient">Cài đặt hệ thống</h3>
      <div className="text-center py-12">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Tính năng cài đặt hệ thống sẽ được phát triển trong phiên bản tiếp theo.</p>
        <p className="text-gray-500 text-sm mt-2">Các tính năng sẽ bao gồm: cấu hình email, thông báo, bảo mật, và nhiều hơn nữa.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

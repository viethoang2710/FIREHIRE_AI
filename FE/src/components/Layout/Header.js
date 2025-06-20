import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Briefcase, ChevronDown, LogIn, UserPlus, LogOut, FileText, BookOpen,
  Menu, X as CloseIcon, Search, Wrench, Edit, MapPin, Layers, User
} from 'lucide-react';
import { useAppNavigation } from '../../contexts/NavigationContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';


const Header = ({ showAlert }) => {
  // Use authentication context to get user state
  const { currentUser, logout } = useContext(AuthContext);
  const isLoggedIn = !!currentUser;

  // Use the hook directly as a fallback if the context doesn't work
  const directNavigate = useNavigate();
  const appNavigation = useAppNavigation();
  const navigate = appNavigation?.navigate || directNavigate;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const navDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // ✅ Đặt navItems lên đầu để dùng được trong useEffect
  const navItems = [
    {
      name: 'Việc làm',
      key: 'jobs',
      icon: Search,
      dropdown: [
        { name: 'Tìm việc làm', action: () => handleNavigate('jobSearch') },
        { name: 'Việc làm theo ngành nghề', icon: Layers, action: () => handleNavigate('jobsByIndustry') },
        { name: 'Việc làm theo địa điểm', icon: MapPin, action: () => handleNavigate('jobsByLocation') },
        { name: 'Công ty tuyển dụng', action: () => handleNavigate('companies') },
        { name: 'Việc làm Hot/Mới nhất', action: () => handleNavigate('hotLatestJobs') },
      ]
    },
    {
      name: 'Tạo CV',
      key: 'cv',
      icon: Edit,
      dropdown: [
        { name: 'Tạo CV Online', action: () => handleNavigate('cvBuilder') },
        { name: 'Mẫu CV', action: () => handleNavigate('cvTemplates') },
        { name: 'Hướng dẫn viết CV', action: () => handleNavigate('cvGuide') },
        { name: 'Dịch vụ tư vấn CV', action: () => handleNavigate('cvConsulting') },
      ]
    },
    {
      name: 'Công cụ',
      key: 'tools',
      icon: Wrench,
      dropdown: [
        { name: 'Tính lương Gross sang Net', action: () => handleNavigate('grossToNetSalary') },
        { name: 'Trắc nghiệm MBTI', action: () => handleNavigate('mbtiTest') },
        { name: 'So sánh lương', action: () => handleNavigate('salaryComparison') },
        { name: 'Công cụ phân tích CV', action: () => handleNavigate('cvAnalysisTool') },
      ]
    },
    {
      name: 'Cẩm nang nghề nghiệp',
      key: 'handbook',
      icon: BookOpen,
      dropdown: [
        { name: 'Tư vấn phỏng vấn', action: () => handleNavigate('interviewConsulting') },
        { name: 'Kỹ năng làm việc', action: () => handleNavigate('workSkills') },
        { name: 'Phát triển bản thân', action: () => handleNavigate('selfImprovement') },
        { name: 'Tổng quan Cẩm nang', action: () => handleNavigate('careerHandbook') },
      ]
    },
  ];
  const handleNavigate = (page, params = {}) => {
    // Map the page name to the correct route path
    let path;
    switch(page) {
      case 'homepage': path = '/'; break;
      case 'login': path = '/login'; break;
      case 'register': path = '/register'; break;
      case 'jobSearch': path = '/job-search'; break;
      case 'jobsByIndustry': path = '/jobs-by-industry'; break;
      case 'jobsByLocation': path = '/jobs-by-location'; break;
      case 'companies': path = '/companies'; break;
      case 'hotLatestJobs': path = '/hot-latest-jobs'; break;
      case 'cvBuilder': path = '/cv-builder'; break;
      case 'cvTemplates': path = '/cv-templates'; break;
      case 'cvGuide': path = '/cv-guide'; break;
      case 'cvConsulting': path = '/cv-consulting'; break;
      case 'grossToNetSalary': path = '/gross-to-net-salary'; break;
      case 'mbtiTest': path = '/mbti-test'; break;
      case 'salaryComparison': path = '/salary-comparison'; break;
      case 'cvAnalysisTool': path = '/cv-analysis-tool'; break;
      case 'interviewConsulting': path = '/interview-consulting'; break;
      case 'workSkills': path = '/work-skills'; break;
      case 'selfImprovement': path = '/self-improvement'; break;
      case 'careerHandbook': path = '/career-handbook'; break;
      case 'profileManagement': path = '/profile'; break;
      default: path = `/${page}`; break;
    }
    
    // Add any query params
    if (Object.keys(params).length > 0) {
      path += '?' + new URLSearchParams(params).toString();
    }
    
    navigate(path);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setIsUserMenuOpen(false);
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }

      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target)) {
        let clickedOnDropdownButton = false;
        navItems.forEach(item => {
          if (event.target.closest(`[data-dropdown-button="${item.key}"]`)) {
            clickedOnDropdownButton = true;
          }
        });
        if (!clickedOnDropdownButton) {
          setOpenDropdown(null);
        }
      }

      if (mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // ✅ Không cần navItems trong dependency

  const renderNavLinks = (isMobile = false) => navItems.map((item) => (
    <div key={item.key} className={`relative ${isMobile ? 'w-full' : ''}`}>
      <button
        data-dropdown-button={item.key}
        onClick={() => item.dropdown ? toggleDropdown(item.key) : item.action()}
        className={`text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${isMobile ? 'w-full text-left' : ''}`}
      >
        <div className="flex items-center">
          {isMobile && item.icon && <item.icon size={18} className="mr-3" />}
          {item.name}
        </div>
        {item.dropdown && <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${openDropdown === item.key ? 'rotate-180' : ''}`} />}
      </button>
      {openDropdown === item.key && item.dropdown && (
        <div className={`mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50 ${isMobile ? 'relative w-full pl-4 bg-gray-50 shadow-inner' : 'absolute'}`}>
          {item.dropdown.map((subItem) => (
            <a
              key={subItem.name}
              href="#"
              onClick={(e) => { e.preventDefault(); subItem.action(); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              {subItem.name}
            </a>
          ))}
        </div>
      )}
    </div>
  ));

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={() => handleNavigate('homepage')} className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center">
          <Briefcase size={28} className="mr-2" /> Job<span className="text-gray-700">Finder</span>
        </button>

        <nav className="hidden md:flex space-x-1 items-center" ref={navDropdownRef}>
          {renderNavLinks()}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
            Nhà Tuyển Dụng
          </button>          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-gray-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {currentUser?.fullName?.charAt(0) || <User size={18} />}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-gray-700">{currentUser?.fullName || 'User'}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{currentUser?.fullName || 'User'}</div>
                    <div className="text-xs text-gray-500 mt-1">{currentUser?.email || 'user@example.com'}</div>
                  </div>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('profileManagement'); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"><FileText size={16} className="mr-2" /> Quản lý hồ sơ/CV</a>
                  <button onClick={() => {
                    logout();
                    handleNavigate('homepage');
                    showAlert('Đã đăng xuất thành công', 'success');
                  }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600">
                    <LogOut size={16} className="mr-2" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={() => handleNavigate('login')} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"><LogIn size={16} className="mr-1" /> Đăng Nhập</button>
              <button onClick={() => handleNavigate('register')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center"><UserPlus size={16} className="mr-1" /> Đăng Ký</button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button
            data-mobile-menu-button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 rounded-md"
          >
            {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-30 pb-4">
          <nav className="flex flex-col space-y-1 px-2 pt-2 pb-3">
            {renderNavLinks(true)}
          </nav>
          <div className="px-4 py-2 border-t border-gray-200">            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="flex items-center mb-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                    {currentUser?.fullName?.charAt(0) || <User size={20} />}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{currentUser?.fullName || 'User'}</span>
                    <div className="text-xs text-gray-500">{currentUser?.email || 'user@example.com'}</div>
                  </div>
                </div>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('profileManagement'); setIsMobileMenuOpen(false); }} className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"><FileText size={16} className="mr-2" /> Quản lý hồ sơ/CV</a>
                <button 
                  onClick={() => {
                    logout();
                    handleNavigate('homepage');
                    setIsMobileMenuOpen(false);
                    showAlert('Đã đăng xuất thành công', 'success');
                  }} 
                  className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md"
                >
                  <LogOut size={16} className="mr-2" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => { handleNavigate('login'); setIsMobileMenuOpen(false); }} className="w-full text-left text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"><LogIn size={16} className="mr-2" /> Đăng Nhập</button>
                <button onClick={() => { handleNavigate('register'); setIsMobileMenuOpen(false); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"><UserPlus size={16} className="mr-2" /> Đăng Ký</button>
              </div>
            )}
            <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
              Nhà Tuyển Dụng
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

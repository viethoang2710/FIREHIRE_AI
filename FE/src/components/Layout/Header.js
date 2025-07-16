import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Briefcase, ChevronDown, LogIn, UserPlus, LogOut, FileText, BookOpen,
  Menu, X as CloseIcon, Search, Wrench, Edit, MapPin, Layers, User
} from 'lucide-react';
import { useAppNavigation } from '../../contexts/NavigationContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = ({ showAlert }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const isLoggedIn = !!currentUser;
  const navigate = useNavigate();
  const appNavigation = useAppNavigation();
  const nav = appNavigation?.navigate || navigate;

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const navDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

    if (Object.keys(params).length > 0) {
      path += '?' + new URLSearchParams(params).toString();
    }

    nav(path);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setIsUserMenuOpen(false);
  };

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderNavLinks = (isMobile = false) => navItems.map((item) => (
    <div key={item.key} className={isMobile ? 'w-full' : 'relative'}>
      <button
        onClick={() => item.dropdown ? toggleDropdown(item.key) : item.action()}
        className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center justify-between ${isMobile ? 'w-full text-left' : ''}`}
      >
        <div className="flex items-center">
          {isMobile && item.icon && <item.icon size={16} className="mr-2" />}
          {item.name}
        </div>
        {item.dropdown && <ChevronDown size={16} className={`ml-1 ${openDropdown === item.key ? 'rotate-180' : ''}`} />}
      </button>
      {openDropdown === item.key && item.dropdown && (
        <div className={`bg-white rounded-md shadow-lg py-1 ${isMobile ? 'pl-4 mt-2' : 'absolute w-56 mt-2'}`}>
          {item.dropdown.map(sub => (
            <a key={sub.name} href="#" onClick={(e) => { e.preventDefault(); sub.action(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {sub.name}
            </a>
          ))}
        </div>
      )}
    </div>
  ));

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div onClick={() => handleNavigate('homepage')} className="text-2xl font-bold text-blue-600 flex items-center cursor-pointer">
          <Briefcase size={28} className="mr-2" />
          Job<span className="text-gray-700">Finder</span>
        </div>

        <nav className="hidden md:flex space-x-2 items-center" ref={navDropdownRef}>
          {renderNavLinks()}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          

          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  {currentUser?.fullName?.charAt(0) || <User size={18} />}
                </div>
                <span className="hidden lg:inline text-sm">{currentUser?.fullName}</span>
                <ChevronDown size={16} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">{currentUser?.email}</div>
                  <button onClick={() => handleNavigate('profileManagement')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Quản lý hồ sơ</button>
                  <button onClick={() => { logout(); handleNavigate('homepage'); showAlert('Đã đăng xuất', 'success'); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => handleNavigate('login')} className="text-gray-600 hover:text-blue-600 text-sm">Đăng Nhập</button>
              <button onClick={() => handleNavigate('register')} className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700">Đăng Ký</button>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white px-4 py-4 shadow">
          <div className="mb-4">{renderNavLinks(true)}</div>
          
          {isLoggedIn ? (
            <>
              <div className="text-sm mb-2">{currentUser?.email}</div>
              <button onClick={() => handleNavigate('profileManagement')} className="block w-full text-left text-sm py-2 hover:bg-gray-100">Quản lý hồ sơ</button>
              <button onClick={() => { logout(); handleNavigate('homepage'); showAlert('Đã đăng xuất', 'success'); }} className="block w-full text-left text-sm py-2 text-red-600 hover:bg-gray-100">Đăng xuất</button>
            </>
          ) : (
            <>
              <button onClick={() => handleNavigate('login')} className="block w-full text-left text-sm py-2 hover:bg-gray-100">Đăng Nhập</button>
              <button onClick={() => handleNavigate('register')} className="block w-full text-left text-sm py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Đăng Ký</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

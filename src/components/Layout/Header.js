import React, { useState, useEffect, useRef } from 'react';
// Đã thay thế 'Tool' bằng 'Wrench' (hoặc bạn có thể chọn icon khác phù hợp)
// Đã bỏ 'Settings' nếu không được sử dụng để tránh cảnh báo no-unused-vars
import { Briefcase, ChevronDown, LogIn, UserPlus, LogOut, FileText, BookOpen, Menu, X as CloseIcon, Search, Wrench, Edit, MapPin, Layers } from 'lucide-react'; 

const Header = ({ navigate, isLoggedIn, user, handleLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const navDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  // Hàm nội bộ để xử lý điều hướng và đóng tất cả các menu
  const handleNavigate = (page, params = {}) => {
    navigate(page, params);
    setIsMobileMenuOpen(false); // Đóng menu mobile
    setOpenDropdown(null);     // Đóng bất kỳ dropdown nào đang mở
    setIsUserMenuOpen(false);  // Đóng menu người dùng
  };
  
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      
      // Close main navigation dropdowns
      // We need to check if the click was *outside* the dropdown itself
      // AND not on the button that *opens* the dropdown
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target)) {
        let clickedOnDropdownButton = false;
        navItems.forEach(item => { // THÊM navItems vào dependency array của useEffect
          if (event.target.closest(`[data-dropdown-button="${item.key}"]`)) {
            clickedOnDropdownButton = true;
          }
        });
        if (!clickedOnDropdownButton) {
          setOpenDropdown(null);
        }
      }

      // Close mobile menu
      // Check if the click was outside the mobile menu AND not on the toggle button
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navItems]); // ĐÃ THÊM navItems VÀO ĐÂY để khắc phục cảnh báo react-hooks/exhaustive-deps

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
    { // Cập nhật mục "Công cụ" với các dropdown mới
      name: 'Công cụ', 
      key: 'tools', 
      icon: Wrench, // ĐÃ ĐỔI TỪ Tool SANG Wrench
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
            // Các thẻ <a> này vẫn dùng href="#" và onClick để điều hướng
            // Nếu muốn loại bỏ cảnh báo eslint, bạn có thể thay bằng <button> hoặc dùng thư viện routing thực tế
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
        {/* Logo and Site Title */}
        <button onClick={() => handleNavigate('homepage')} className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center">
          <Briefcase size={28} className="mr-2"/> Job<span className="text-gray-700">Finder</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 items-center" ref={navDropdownRef}>
          {renderNavLinks()}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
            Nhà Tuyển Dụng
          </button>
          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-gray-100">
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-blue-500" />
                <span className="hidden lg:inline text-sm font-medium text-gray-700">{user.name}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Chuyển đến trang Quản lý hồ sơ/CV (chưa có trong App.js)'); handleNavigate('profileManagement'); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"><FileText size={16} className="mr-2"/> Quản lý hồ sơ/CV</a>
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"><LogOut size={16} className="mr-2"/> Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button onClick={() => handleNavigate('login')} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"><LogIn size={16} className="mr-1"/> Đăng Nhập</button>
              <button onClick={() => handleNavigate('register')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center"><UserPlus size={16} className="mr-1"/> Đăng Ký</button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-30 pb-4">
          <nav className="flex flex-col space-y-1 px-2 pt-2 pb-3">
            {renderNavLinks(true)}
          </nav>
          <div className="px-4 py-2 border-t border-gray-200">
            {isLoggedIn ? (
               <div className="space-y-2">
                 <div className="flex items-center mb-2">
                   <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-blue-500 mr-2" />
                   <span className="font-medium">{user.name}</span>
                 </div>
                 <a href="#" onClick={(e) => { e.preventDefault(); alert('Chuyển đến trang Quản lý hồ sơ/CV (chưa có trong App.js)'); handleNavigate('profileManagement'); }} className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"><FileText size={16} className="mr-2"/> Quản lý hồ sơ/CV</a>
                 <button onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md"><LogOut size={16} className="mr-2"/> Đăng xuất</button>
               </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => handleNavigate('login')} className="w-full text-left text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"><LogIn size={16} className="mr-2"/> Đăng Nhập</button>
                <button onClick={() => handleNavigate('register')} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"><UserPlus size={16} className="mr-2"/> Đăng Ký</button>
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
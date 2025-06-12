import React, { useState } from 'react';
import { Eye, EyeOff, Linkedin } from 'lucide-react';

const LoginPage = ({ setCurrentPage, handleLogin, showAlert }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!emailOrPhone.trim()) newErrors.emailOrPhone = 'Email hoặc Số điện thoại là bắt buộc.';
    if (!password) newErrors.password = 'Mật khẩu là bắt buộc.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Đăng nhập:', { emailOrPhone, password, rememberMe });
      // Giả lập API call
      if (emailOrPhone === "user@example.com" && password === "Password123!") {
        handleLogin();
      } else if (emailOrPhone && password) { 
         handleLogin();
      }
      else {
        showAlert('Email hoặc mật khẩu không đúng.', 'error');
        setErrors({ general: 'Email hoặc mật khẩu không đúng.' });
      }
    } else {
       showAlert('Vui lòng điền đầy đủ thông tin đăng nhập.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 lg:p-10 w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 md:pr-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Chào Mừng Trở Lại!</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ email hoặc Số điện thoại <span className="text-red-500">*</span></label>
              <input type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.emailOrPhone ? 'border-red-500' : 'border-gray-300'}`} placeholder="email@example.com hoặc 09xxxxxxxx" />
              {errors.emailOrPhone && <p className="text-red-500 text-xs mt-1">{errors.emailOrPhone}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Nhập mật khẩu của bạn" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-blue-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Ghi nhớ đăng nhập</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-700">Quên mật khẩu?</a>
              </div>
            </div>
            {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Đăng Nhập
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button onClick={() => setCurrentPage('register')} className="font-medium text-blue-600 hover:text-blue-700">
                Đăng ký ngay
              </button>
            </p>
          </div>
           <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                Google
              </button>
              <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                 <img src="https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                Facebook
              </button>
              <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Linkedin size={20} className="mr-2 text-[#0077B5]" />
                LinkedIn
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-r-xl p-8">
            <div className="text-center text-white">
                <img src="https://placehold.co/300x300/ffffff/007bff?text=Welcome+Back" alt="Đăng nhập" className="rounded-lg mb-6 shadow-lg mx-auto" />
                <h2 className="text-3xl font-bold mb-3">Tiếp Tục Hành Trình Của Bạn</h2>
                <p className="text-lg">Đăng nhập để quản lý hồ sơ, theo dõi việc làm đã ứng tuyển và khám phá thêm nhiều cơ hội mới.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
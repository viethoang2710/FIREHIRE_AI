import React, { useState } from 'react';
import { Eye, EyeOff, Linkedin } from 'lucide-react';
import { isValidEmail, isPasswordComplex } from '../../utils/helpers';

const RegistrationPage = ({ setCurrentPage, handleRegister, showAlert }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Họ và tên là bắt buộc.';
    if (!email.trim()) {
      newErrors.email = 'Email là bắt buộc.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Định dạng email không hợp lệ.';
    }
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc.';
    } else if (!isPasswordComplex(password)) {
      newErrors.password = 'Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Nhập lại mật khẩu là bắt buộc.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp.';
    }
    if (!agreedToTerms) newErrors.agreedToTerms = 'Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Đăng ký:', { fullName, email, password, phone, agreedToTerms });
      handleRegister();
    } else {
      showAlert('Vui lòng kiểm tra lại thông tin đăng ký.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 lg:p-10 w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 md:pr-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Tạo Tài Khoản Mới</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Nguyễn Văn A" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ email <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="email@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ít nhất 8 ký tự" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-blue-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu <span className="text-red-500">*</span></label>
              <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="Xác nhận mật khẩu" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-blue-600">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại (Tùy chọn)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="09xxxxxxxx" />
            </div>
            <div className="flex items-center">
              <input id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${errors.agreedToTerms ? 'border-red-500' : ''}`} />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Tôi đồng ý với <a href="#" className="font-medium text-blue-600 hover:text-blue-700">Điều khoản dịch vụ</a> và <a href="#" className="font-medium text-blue-600 hover:text-blue-700">Chính sách bảo mật</a>. <span className="text-red-500">*</span>
              </label>
            </div>
             {errors.agreedToTerms && <p className="text-red-500 text-xs -mt-3">{errors.agreedToTerms}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Đăng Ký
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button onClick={() => setCurrentPage('login')} className="font-medium text-blue-600 hover:text-blue-700">
                Đăng nhập ngay
              </button>
            </p>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng ký bằng</span>
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
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-r-xl p-8">
            <div className="text-center text-white">
                <img src="https://placehold.co/300x300/ffffff/007bff?text=Join+Us" alt="Đăng ký" className="rounded-lg mb-6 shadow-lg mx-auto" />
                <h2 className="text-3xl font-bold mb-3">Tìm Kiếm Hàng Ngàn Cơ Hội Việc Làm</h2>
                <p className="text-lg">Tạo CV chuyên nghiệp miễn phí và ứng tuyển công việc mơ ước của bạn ngay hôm nay!</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
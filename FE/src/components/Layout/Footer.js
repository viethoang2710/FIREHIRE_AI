import React from 'react';
import { Facebook, Linkedin } from 'lucide-react'; // Giả sử Youtube icon nếu cần sẽ import riêng

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Job<span className="text-blue-400">Finder</span></h3>
            <p className="text-sm">Kết nối tài năng với cơ hội. Chúng tôi giúp bạn tìm kiếm công việc mơ ước và xây dựng sự nghiệp bền vững.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Về Chúng Tôi</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sứ mệnh & Tầm nhìn</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tuyển dụng tại JobFinder</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Hỗ Trợ</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Câu hỏi thường gặp (FAQ)</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Liên hệ hỗ trợ</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Liên Hệ</h3>
            <p className="text-sm">Địa chỉ: 123 Đường ABC, Quận XYZ, Thành phố HCM</p>
            <p className="text-sm">Email: support@jobfinder.vn</p>
            <p className="text-sm">Điện thoại: (028) 3812 3456</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} JobFinder Vietnam. Bảo lưu mọi quyền.</p>
          <p className="mt-1">Link tải ứng dụng: <a href="#" className="text-blue-400 hover:underline">App Store</a> | <a href="#" className="text-blue-400 hover:underline">Google Play</a> (Sắp có)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
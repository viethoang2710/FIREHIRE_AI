import React from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {/* Optional: subtle background pattern or image */}
      </div>
      <div className="relative z-10 container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">Kết Nối Tài Năng - Kiến Tạo Tương Lai</h1>
        <p className="text-lg md:text-xl mb-8 animate-fade-in-up">Hàng ngàn cơ hội việc làm chất lượng cao đang chờ bạn khám phá.</p>
        <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-2xl animate-fade-in-up animation-delay-300">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="text-left">
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" id="keyword" placeholder="Tên công việc, kỹ năng, công ty" className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
              </div>
            </div>
            <div className="text-left">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select id="location" className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 appearance-none">
                  <option value="">Tất cả địa điểm</option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </select>
                 <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <button type="submit" className="w-full md:col-span-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-md transition-colors text-base flex items-center justify-center">
              <Search size={20} className="mr-2"/> Tìm Kiếm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
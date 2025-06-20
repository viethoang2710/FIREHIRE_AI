import React from 'react';
import { BarChart2, Users, Briefcase } from 'lucide-react';

const UsefulToolsIntro = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Công Cụ Hữu Ích Cho Bạn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <BarChart2 size={32} className="mx-auto mb-3 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tính Lương Gross - Net</h3>
            <p className="text-gray-600 text-sm mb-3">Dễ dàng quy đổi lương để hiểu rõ thu nhập thực nhận.</p>
            <a href="#" className="text-purple-600 hover:text-purple-800 font-medium text-sm">Thử ngay &rarr;</a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <Users size={32} className="mx-auto mb-3 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Trắc Nghiệm Tính Cách MBTI</h3>
            <p className="text-gray-600 text-sm mb-3">Khám phá bản thân và định hướng nghề nghiệp phù hợp.</p>
            <a href="#" className="text-red-600 hover:text-red-800 font-medium text-sm">Làm trắc nghiệm &rarr;</a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <Briefcase size={32} className="mx-auto mb-3 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">So Sánh Lương Thị Trường</h3>
            <p className="text-gray-600 text-sm mb-3">Biết được mức lương trung bình cho vị trí của bạn.</p>
            <a href="#" className="text-green-600 hover:text-green-800 font-medium text-sm">So sánh ngay &rarr;</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsefulToolsIntro;
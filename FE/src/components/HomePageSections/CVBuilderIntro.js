import React from 'react';
import { FileText } from 'lucide-react';

const CVBuilderIntro = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg shadow-xl my-8">
      <div className="container mx-auto px-4 text-center">
        <FileText size={48} className="mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tạo CV Chuyên Nghiệp Miễn Phí</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Sử dụng công cụ tạo CV trực tuyến của chúng tôi với hàng trăm mẫu CV đa dạng,
          giúp bạn dễ dàng tạo ấn tượng với nhà tuyển dụng.
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105">
          Tạo CV Ngay
        </button>
      </div>
    </section>
  );
};

export default CVBuilderIntro;
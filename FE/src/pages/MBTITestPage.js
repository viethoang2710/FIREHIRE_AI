// Trắc nghiệm MBTI

// src/pages/MBTITestPage.js
import React from 'react';
import { Award, Feather, Lightbulb } from 'lucide-react';

function MBTITestPage({ navigate }) {
  const handleStartTest = () => {
    alert('Bắt đầu làm bài trắc nghiệm MBTI (chưa có chức năng làm bài chi tiết)');
    // navigate('mbtiQuiz'); // Nếu có trang làm bài chi tiết
  };

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Khám phá bản thân với Trắc nghiệm MBTI</h1>
      <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
        MBTI (Myers-Briggs Type Indicator) là công cụ phân loại tính cách giúp bạn hiểu rõ hơn về bản thân, điểm mạnh, điểm yếu và phong cách làm việc phù hợp nhất.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Lightbulb size={48} className="text-blue-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Hiểu rõ tính cách</h2>
          <p className="text-gray-600">
            Phân tích sâu về cách bạn nhận thức thế giới, ra quyết định và tương tác với người khác.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Feather size={48} className="text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Định hướng sự nghiệp</h2>
          <p className="text-gray-600">
            Tìm kiếm các ngành nghề và môi trường làm việc phù hợp nhất với loại hình tính cách của bạn.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Award size={48} className="text-purple-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Phát triển bản thân</h2>
          <p className="text-gray-600">
            Nhận biết điểm mạnh để phát huy và cải thiện những khía cạnh cần thiết.
          </p>
        </div>
      </div>

      <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
        MBTI không phải là một bài kiểm tra "đúng hay sai", mà là một công cụ để tự khám phá và phát triển. Hãy bắt đầu hành trình hiểu mình ngay hôm nay!
      </p>

      <button
        onClick={handleStartTest}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        Bắt đầu làm bài Trắc nghiệm MBTI
      </button>

      <div className="mt-12 text-sm text-gray-500 max-w-2xl mx-auto">
        <p>
          *Lưu ý: Trắc nghiệm MBTI cung cấp cái nhìn sâu sắc về sở thích và khuynh hướng tự nhiên của bạn. Kết quả nên được xem là một công cụ hỗ trợ cho việc tự khám phá, không phải là một đánh giá tuyệt đối.
        </p>
      </div>
    </div>
  );
}

export default MBTITestPage;
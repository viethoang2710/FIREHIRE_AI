// Mẫu CV
// src/pages/CVTemplatesPage.js
import React, { useState, useEffect } from 'react';

// Mock data cho các mẫu CV
const mockCVTemplates = [
  { id: 1, name: 'Mẫu CV Hiện Đại', image: 'https://via.placeholder.com/300x400/007bff/ffffff?text=Modern+CV', description: 'Thiết kế tối giản, phù hợp cho mọi ngành nghề.' },
  { id: 2, name: 'Mẫu CV Chuyên Nghiệp', image: 'https://via.placeholder.com/300x400/28a745/ffffff?text=Pro+CV', description: 'Bố cục rõ ràng, nhấn mạnh kinh nghiệm và kỹ năng.' },
  { id: 3, name: 'Mẫu CV Sáng Tạo', image: 'https://via.placeholder.com/300x400/ffc107/000000?text=Creative+CV', description: 'Độc đáo, thích hợp cho các ngành sáng tạo, nghệ thuật.' },
  { id: 4, name: 'Mẫu CV Kỹ Thuật', image: 'https://via.placeholder.com/300x400/6c757d/ffffff?text=Tech+CV', description: 'Tập trung vào kỹ năng và dự án, lý tưởng cho IT.' },
  { id: 5, name: 'Mẫu CV Đa Ngôn Ngữ', image: 'https://via.placeholder.com/300x400/dc3545/ffffff?text=MultiLang+CV', description: 'Hỗ trợ hiển thị thông tin bằng nhiều ngôn ngữ.' },
];

function CVTemplatesPage({ navigate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API ở đây để lấy danh sách mẫu CV
    setLoading(true);
    setTimeout(() => {
      setTemplates(mockCVTemplates);
      setLoading(false);
    }, 500);
  }, []);

  const handleUseTemplate = (templateId) => {
    // Giả lập logic khi người dùng chọn một mẫu CV
    alert(`Bạn đã chọn mẫu CV ID: ${templateId}. Chuyển đến trang chỉnh sửa CV...`);
    navigate('cvBuilder', { templateId: templateId }); // Điều hướng đến CVBuilder với ID mẫu
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải các mẫu CV...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Chọn mẫu CV phù hợp với bạn</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Khám phá bộ sưu tập các mẫu CV chuyên nghiệp, hiện đại và sáng tạo. Chọn mẫu yêu thích để bắt đầu xây dựng CV của riêng bạn chỉ trong vài phút!
      </p>

      {templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-105">
              <img src={template.image} alt={template.name} className="w-full h-72 object-cover" />
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-xl text-gray-800 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{template.description}</p>
                </div>
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sử dụng mẫu này
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Hiện chưa có mẫu CV nào được hiển thị.</p>
      )}
    </div>
  );
}

export default CVTemplatesPage;
// Hướng dẫn viết CV
// src/pages/CVGuidePage.js
import React, { useState, useEffect } from 'react';

// Mock data cho các bài viết hướng dẫn
const mockGuides = [
  { id: 1, title: 'Cách viết mục tiêu nghề nghiệp trong CV gây ấn tượng', imageUrl: 'https://via.placeholder.com/300x200?text=Career+Goals', excerpt: 'Mục tiêu nghề nghiệp là một phần quan trọng, hãy viết nó một cách rõ ràng và hấp dẫn.', date: '01/06/2025' },
  { id: 2, title: 'Những lỗi thường gặp khi viết CV và cách khắc phục', imageUrl: 'https://via.placeholder.com/300x200?text=CV+Mistakes', excerpt: 'Tránh những sai lầm phổ biến có thể khiến CV của bạn bị loại ngay lập tức.', date: '28/05/2025' },
  { id: 3, title: 'Tối ưu CV cho hệ thống ATS: Bí quyết vượt qua vòng lọc tự động', imageUrl: 'https://via.placeholder.com/300x200?text=ATS+Tips', excerpt: 'Học cách thiết kế CV để thân thiện với các phần mềm quản lý ứng viên (ATS).', date: '20/05/2025' },
  { id: 4, title: 'Thêm kỹ năng vào CV sao cho chuyên nghiệp và hiệu quả', imageUrl: 'https://via.placeholder.com/300x200?text=Skills+in+CV', excerpt: 'Cách trình bày các kỹ năng (mềm và cứng) để thu hút sự chú ý của nhà tuyển dụng.', date: '15/05/2025' },
];

function CVGuidePage({ navigate }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch CV guides from API
    setLoading(true);
    setTimeout(() => {
      setGuides(mockGuides);
      setLoading(false);
    }, 500);
  }, []);

  const handleReadGuide = (guideId) => {
    alert(`Đọc hướng dẫn ID: ${guideId}`);
    // navigate('guideDetail', { id: guideId }); // Bạn có thể tạo trang chi tiết bài viết sau
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải hướng dẫn viết CV...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Hướng dẫn viết CV chuyên nghiệp</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Nâng cao kỹ năng viết CV của bạn với các hướng dẫn chi tiết từ chuyên gia, giúp bạn tạo ra một hồ sơ ấn tượng và vượt trội.
      </p>

      {guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map(guide => (
            <div key={guide.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
              <img src={guide.imageUrl} alt={guide.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className="text-xs text-gray-500">{guide.date}</span>
                <h3 className="font-semibold text-lg text-gray-800 mt-2 line-clamp-2">{guide.title}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">{guide.excerpt}</p>
                <div className="mt-3 flex items-center justify-end text-blue-600 text-sm">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleReadGuide(guide.id); }} className="font-medium hover:underline">Đọc thêm &rarr;</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Hiện không có hướng dẫn viết CV nào.</p>
      )}
    </div>
  );
}

export default CVGuidePage;
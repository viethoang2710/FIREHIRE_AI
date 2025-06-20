// Phát triển bản thân

// src/pages/SelfImprovementPage.js
import React, { useState, useEffect } from 'react';

// Mock data cho các bài viết phát triển bản thân
const mockSelfImprovement = [
  { id: 1, title: 'Thiết lập mục tiêu sự nghiệp và kế hoạch hành động', imageUrl: 'https://via.placeholder.com/300x200/607D8B/ffffff?text=Goal+Setting', excerpt: 'Xây dựng lộ trình rõ ràng để đạt được mục tiêu nghề nghiệp của bạn.', date: '03/06/2025' },
  { id: 2, title: 'Học cách quản lý căng thẳng trong công việc', imageUrl: 'https://via.placeholder.com/300x200/FF5722/ffffff?text=Stress+Management', excerpt: 'Các chiến lược hiệu quả để đối phó với áp lực và duy trì sức khỏe tinh thần.', date: '30/05/2025' },
  { id: 3, title: 'Phát triển tư duy phản biện để đưa ra quyết định tốt hơn', imageUrl: 'https://via.placeholder.com/300x200/795548/ffffff?text=Critical+Thinking', excerpt: 'Rèn luyện khả năng phân tích thông tin và đánh giá vấn đề một cách khách quan.', date: '26/05/2025' },
  { id: 4, title: 'Mạng lưới quan hệ (Networking): Xây dựng và duy trì', imageUrl: 'https://via.placeholder.com/300x200/673AB7/ffffff?text=Networking', excerpt: 'Bí quyết mở rộng mối quan hệ chuyên nghiệp và tận dụng chúng.', date: '22/05/2025' },
  { id: 5, title: 'Cân bằng giữa công việc và cuộc sống: Chìa khóa thành công', imageUrl: 'https://via.placeholder.com/300x200/CDDC39/000000?text=WorkLife+Balance', excerpt: 'Tìm kiếm sự hài hòa giữa sự nghiệp và cuộc sống cá nhân.', date: '18/05/2025' },
];

function SelfImprovementPage({ navigate }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch articles from API
    setLoading(true);
    setTimeout(() => {
      setArticles(mockSelfImprovement);
      setLoading(false);
    }, 500);
  }, []);

  const handleReadArticle = (articleId) => {
    alert(`Đọc bài viết phát triển bản thân ID: ${articleId}`);
    // navigate('selfImprovementDetail', { id: articleId }); // Có thể tạo trang chi tiết bài viết sau
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải các bài viết phát triển bản thân...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Phát triển bản thân & Sự nghiệp</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Tìm kiếm nguồn cảm hứng và kiến thức để không ngừng phát triển kỹ năng, tư duy và định hình con đường sự nghiệp của bạn.
      </p>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02]">
              <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-xs text-gray-500">{article.date}</span>
                  <h3 className="font-semibold text-lg text-gray-800 mt-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3">{article.excerpt}</p>
                </div>
                <div className="mt-3 flex items-center justify-end text-blue-600 text-sm">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleReadArticle(article.id); }} className="font-medium hover:underline">Đọc thêm &rarr;</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Hiện không có bài viết phát triển bản thân nào.</p>
      )}
    </div>
  );
}

export default SelfImprovementPage;
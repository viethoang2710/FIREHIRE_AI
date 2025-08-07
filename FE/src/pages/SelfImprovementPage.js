// src/pages/SelfImprovementPage.js
import React, { useState, useEffect } from 'react';

const mockSelfImprovement = [
  {
    id: 1,
    title: 'Thiết lập mục tiêu sự nghiệp và kế hoạch hành động',
    excerpt: 'Xây dựng lộ trình rõ ràng để đạt được mục tiêu nghề nghiệp của bạn.',
    date: '03/06/2025',
    url: 'https://acabiz.vn/blog/cac-buoc-xac-dinh-muc-tieu-va-lap-ke-hoach-hanh-dong'
  },
  {
    id: 2,
    title: 'Học cách quản lý căng thẳng trong công việc',
    excerpt: 'Các chiến lược hiệu quả để đối phó với áp lực và duy trì sức khỏe tinh thần.',
    date: '30/05/2025',
    url: 'https://www.pace.edu.vn/tin-kho-tri-thuc/stress-trong-cong-viec'
  },
  {
    id: 3,
    title: 'Phát triển tư duy phản biện để đưa ra quyết định tốt hơn',
    excerpt: 'Rèn luyện khả năng phân tích thông tin và đánh giá vấn đề một cách khách quan.',
    date: '26/05/2025',
    url: 'https://lighthuman.vn/lam-sao-de-tu-duy-phan-bien-tot-hon/'
  },
  {
    id: 4,
    title: 'Mạng lưới quan hệ (Networking): Xây dựng và duy trì',
    excerpt: 'Bí quyết mở rộng mối quan hệ chuyên nghiệp và tận dụng chúng.',
    date: '22/05/2025',
    url: 'https://anhtuanle.com/2023/03/02/cach-xay-dung-mang-luoi-quan-he-chuyen-nghiep/'
  },
  {
    id: 5,
    title: 'Cân bằng giữa công việc và cuộc sống: Chìa khóa thành công',
    excerpt: 'Tìm kiếm sự hài hòa giữa sự nghiệp và cuộc sống cá nhân.',
    date: '18/05/2025',
    url: 'https://chefjob.vn/can-bang-cuoc-song-va-cong-viec'
  },
];

const imageMap = {
  1: 'https://acabiz.vn/images/v4/home/e-learning-img.png', // career planning illustration
  2: 'https://www.pace.edu.vn/uploads/news/2024/02/1-stress-trong-cong-viec-la-gi.jpg', // stress management infographic
  3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMyiRnI6AzAS6Iji1ETtjb6AppELGMZsl-Dg&s', // critical thinking icon vector
  4: 'https://anhtuanle.com/wp-content/uploads/2023/03/swot-anhtuanle.jpeg', // networking illustration
  5: 'https://chefjob.vn/wp-content/uploads/2018/04/can-bang-cuoc-song.jpg'  // work-life balance infographic
};

function SelfImprovementPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const updated = mockSelfImprovement.map(a => ({
        ...a,
        imageUrl: imageMap[a.id] || a.imageUrl
      }));
      setArticles(updated);
      setLoading(false);
    }, 500);
  }, []);

  const openUrl = (url) => window.open(url, '_blank');

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải các bài viết phát triển bản thân...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Phát triển bản thân &amp; Sự nghiệp
      </h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Tìm nguồn cảm hứng và kiến thức để phát triển kỹ năng, tư duy và định hình con đường sự nghiệp.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02]">
            <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <span className="text-xs text-gray-500">{article.date}</span>
                <h3 className="font-semibold text-lg text-gray-800 mt-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-end text-blue-600 text-sm">
                <button onClick={() => openUrl(article.url)} className="font-medium hover:underline">
                  Đọc thêm &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelfImprovementPage;

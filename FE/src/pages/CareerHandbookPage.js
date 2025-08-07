// src/pages/CareerHandbookPage.js
import React, { useState, useEffect } from 'react';

const mockCareerHandbook = [
  {
    id: 1,
    title: 'Cách khéo léo trả lời câu hỏi “Điểm yếu của bạn là gì?”',
    excerpt: 'Học cách định nghĩa điểm yếu thông minh và chuyển điểm yếu thành lợi thế trong phỏng vấn.',
    date: '05/06/2025',
    url: 'https://hrchannels.com/uptalent/tiet-lo-cach-neu-diem-manh-diem-yeu-cua-ban-than-trong-phong-van-tim-viec.html'
  },
  {
    id: 2,
    title: '10 lỗi cơ bản cần tránh khi viết CV xin việc',
    excerpt: 'Những sai lầm thường gặp như lỗi chính tả, nội dung lan man, dùng địa chỉ email thiếu chuyên nghiệp.',
    date: '30/05/2025',
    url: 'https://vn.joboko.com/blog/top-loi-cv-xin-viec-kinh-dien-ung-vien-nao-cung-co-the-mac-phai-nwi1135'
  },
  {
    id: 3,
    title: '7 lỗi thường gặp khi lần đầu viết CV và cách khắc phục',
    excerpt: 'Dành cho người mới học cách viết CV: tránh dài dòng, không phù hợp nội dung, thiếu trọng tâm.',
    date: '28/05/2025',
    url: 'https://vn.joboko.com/blog/cv-xin-viec-la-gi-chu-y-gi-khi-lam-cv-xin-viec-nwi87'
  },
];

const imageMap = {
  1: 'https://hrchannels.com/uptalent/attachments/images/20240510/175555225_diem-manh-diem-yeu-hrchannels.jpg', // answering weakness
  2: 'https://vn.joboko.com/blogs/img/2020/3/top-loi-cv-xin-viec-kinh-dien-ung-vien-nao-cung-co-the-mac-phai-1.jpg', // writing CV
  3: 'https://vn.joboko.com/blogs/img/2020/1/cv-la-gi-2.jpg'  // editing CV
};

function CareerHandbookPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Mô phỏng fetch
    setTimeout(() => {
      const filled = mockCareerHandbook.map(a => ({
        ...a,
        imageUrl: imageMap[a.id]
      }));
      setArticles(filled);
    }, 300);
  }, []);

  const openUrl = url => window.open(url, '_blank');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cẩm nang Nghề nghiệp</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map(item => (
          <div key={item.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{item.excerpt}</p>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
              <button
                onClick={() => openUrl(item.url)}
                className="mt-4 text-blue-600 text-sm font-medium hover:underline text-right"
              >
                Đọc thêm &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CareerHandbookPage;

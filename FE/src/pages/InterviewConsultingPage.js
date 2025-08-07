// src/pages/InterviewConsultingPage.js
import React, { useState, useEffect } from 'react';

const mockInterviewTips = [
  {
    id: 1,
    title: 'Bí quyết trả lời câu hỏi "Điểm yếu của bạn là gì?"',
    excerpt: 'Học cách biến điểm yếu thành lợi thế trong buổi phỏng vấn.',
    date: '05/06/2025',
    url: 'https://hrchannels.com/uptalent/tiet-lo-cach-neu-diem-manh-diem-yeu-cua-ban-than-trong-phong-van-tim-viec.html'
  },
  {
    id: 2,
    title: 'Cách gây ấn tượng trong 5 phút đầu phỏng vấn',
    excerpt: 'Những điều nên và không nên làm để tạo ấn tượng tốt ban đầu.',
    date: '03/06/2025',
    url: 'https://iconicjob.vn/blog/bi-quyet-co-dau-an-5-phut-dau-tien-cua-buoi-phong-van'
  },
  {
    id: 3,
    title: 'Chuẩn bị phỏng vấn online hiệu quả: Checklist đầy đủ',
    excerpt: 'Đảm bảo bạn sẵn sàng cho buổi phỏng vấn trực tuyến từ A–Z.',
    date: '01/06/2025',
    url: 'https://www.cake.me/resources/phong-van-online?locale=en'
  }
];

const imageMap = {
  1: 'https://hrchannels.com/uptalent/attachments/images/20240510/175555225_diem-manh-diem-yeu-hrchannels.jpg',
  2: 'https://s3-iconicjob-vn.imgix.net/prod/wp-content/uploads/2015/07/tao-an-tuong-voi-nha-tuyen-dung.jpg',
  3: 'https://img.cake.me/cdn-cgi/image/fit=scale-down,format=auto,w=1920/https://images.cakeresume.com/images/cb2a3e66-a80e-4ae3-9414-8f0b9a91a7e4.png',
};

function InterviewConsultingPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const filled = mockInterviewTips.map(t => ({
        ...t,
        imageUrl: imageMap[t.id] || t.imageUrl
      }));
      setTips(filled);
      setLoading(false);
    }, 500);
  }, []);

  const openTip = (url) => window.open(url, '_blank');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-700">Đang tải các bài viết tư vấn phỏng vấn...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Tư vấn Phỏng vấn Chuyên sâu
      </h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Bí quyết, hướng dẫn và lời khuyên từ chuyên gia để giúp bạn tự tin tỏa sáng trong mọi buổi phỏng vấn.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map(tip => (
          <div
            key={tip.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02]"
          >
            <img src={tip.imageUrl} alt={tip.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-500">{tip.date}</span>
                <h3 className="font-semibold text-lg text-gray-800 mt-2 line-clamp-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">{tip.excerpt}</p>
              </div>
              <div className="mt-3 flex items-center justify-end text-blue-600 text-sm">
                <button
                  onClick={() => openTip(tip.url)}
                  className="font-medium hover:underline"
                >
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

export default InterviewConsultingPage;

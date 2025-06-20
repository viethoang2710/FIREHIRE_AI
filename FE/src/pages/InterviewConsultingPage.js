// Tư vấn phỏng vấn

// src/pages/InterviewConsultingPage.js
import React, { useState, useEffect } from 'react';

// Mock data cho các bài viết tư vấn phỏng vấn
const mockInterviewTips = [
  { id: 1, title: 'Bí quyết trả lời câu hỏi "Điểm yếu của bạn là gì?"', imageUrl: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Weakness', excerpt: 'Học cách biến điểm yếu thành lợi thế trong buổi phỏng vấn.', date: '05/06/2025' },
  { id: 2, title: 'Cách gây ấn tượng trong 5 phút đầu phỏng vấn', imageUrl: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=First+Impression', excerpt: 'Những điều nên và không nên làm để tạo ấn tượng tốt ban đầu.', date: '03/06/2025' },
  { id: 3, title: 'Chuẩn bị phỏng vấn online hiệu quả: Checklist đầy đủ', imageUrl: 'https://via.placeholder.com/300x200/FFC107/000000?text=Online+Interview', excerpt: 'Đảm bảo bạn sẵn sàng cho buổi phỏng vấn trực tuyến từ A-Z.', date: '01/06/2025' },
  { id: 4, title: 'Những câu hỏi nhà tuyển dụng thường hỏi và gợi ý trả lời', imageUrl: 'https://via.placeholder.com/300x200/9C27B0/ffffff?text=Common+Questions', excerpt: 'Luyện tập trả lời các câu hỏi phổ biến để tự tin hơn.', date: '28/05/2025' },
  { id: 5, title: 'Hỏi ngược nhà tuyển dụng: Khi nào và hỏi gì?', imageUrl: 'https://via.placeholder.com/300x200/E91E63/ffffff?text=Your+Questions', excerpt: 'Bí quyết để đặt câu hỏi thông minh, thể hiện sự chủ động.', date: '25/05/2025' },
];

function InterviewConsultingPage({ navigate }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API ở đây để lấy danh sách tips
    setLoading(true);
    setTimeout(() => {
      setTips(mockInterviewTips);
      setLoading(false);
    }, 500);
  }, []);

  const handleReadTip = (tipId) => {
    alert(`Đọc bài viết tư vấn phỏng vấn ID: ${tipId}`);
    // navigate('interviewTipDetail', { id: tipId }); // Có thể tạo trang chi tiết bài viết sau
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải các bài viết tư vấn phỏng vấn...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tư vấn Phỏng vấn Chuyên sâu</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Chuẩn bị kỹ lưỡng cho mọi buổi phỏng vấn với các bí quyết, hướng dẫn và lời khuyên từ chuyên gia, giúp bạn tự tin tỏa sáng.
      </p>

      {tips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map(tip => (
            <div key={tip.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02]">
              <img src={tip.imageUrl} alt={tip.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-xs text-gray-500">{tip.date}</span>
                  <h3 className="font-semibold text-lg text-gray-800 mt-2 line-clamp-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3">{tip.excerpt}</p>
                </div>
                <div className="mt-3 flex items-center justify-end text-blue-600 text-sm">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleReadTip(tip.id); }} className="font-medium hover:underline">Đọc thêm &rarr;</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Hiện chưa có bài viết tư vấn phỏng vấn nào.</p>
      )}
    </div>
  );
}

export default InterviewConsultingPage;
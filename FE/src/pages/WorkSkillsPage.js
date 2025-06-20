// Kĩ năng làm việc

// src/pages/WorkSkillsPage.js
import React, { useState, useEffect } from 'react';

// Mock data cho các bài viết kỹ năng làm việc
const mockWorkSkills = [
  { id: 1, title: 'Kỹ năng giao tiếp hiệu quả tại nơi làm việc', imageUrl: 'https://via.placeholder.com/300x200/F44336/ffffff?text=Communication', excerpt: 'Cải thiện cách bạn tương tác với đồng nghiệp và cấp trên.', date: '01/06/2025' },
  { id: 2, title: 'Quản lý thời gian: Tối ưu hiệu suất làm việc', imageUrl: 'https://via.placeholder.com/300x200/9C27B0/ffffff?text=Time+Management', excerpt: 'Học các phương pháp quản lý thời gian để đạt được nhiều hơn.', date: '29/05/2025' },
  { id: 3, title: 'Kỹ năng giải quyết vấn đề trong công việc', imageUrl: 'https://via.placeholder.com/300x200/00BCD4/ffffff?text=Problem+Solving', excerpt: 'Phát triển tư duy phân tích và tìm ra giải pháp hiệu quả.', date: '25/05/2025' },
  { id: 4, title: 'Làm việc nhóm: Xây dựng team mạnh mẽ', imageUrl: 'https://via.placeholder.com/300x200/FFEB3B/000000?text=Teamwork', excerpt: 'Bí quyết để trở thành thành viên đội nhóm xuất sắc.', date: '20/05/2025' },
  { id: 5, title: 'Kỹ năng thích nghi với môi trường làm việc mới', imageUrl: 'https://via.placeholder.com/300x200/8BC34A/ffffff?text=Adaptability', excerpt: 'Làm thế nào để nhanh chóng hòa nhập và phát triển.', date: '15/05/2025' },
];

function WorkSkillsPage({ navigate }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch work skills from API
    setLoading(true);
    setTimeout(() => {
      setSkills(mockWorkSkills);
      setLoading(false);
    }, 500);
  }, []);

  const handleReadSkill = (skillId) => {
    alert(`Đọc bài viết kỹ năng làm việc ID: ${skillId}`);
    // navigate('workSkillDetail', { id: skillId }); // Có thể tạo trang chi tiết bài viết sau
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-lg text-gray-700">Đang tải các bài viết kỹ năng làm việc...</p>
    </div>
  );
  if (error) return (
    <div className="container mx-auto px-4 py-8 text-center text-red-600">
      <p>Lỗi: {error.message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nâng cao Kỹ năng làm việc</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Khám phá và phát triển các kỹ năng mềm và kỹ năng cứng cần thiết để thành công trong sự nghiệp của bạn.
      </p>

      {skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => (
            <div key={skill.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02]">
              <img src={skill.imageUrl} alt={skill.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-xs text-gray-500">{skill.date}</span>
                  <h3 className="font-semibold text-lg text-gray-800 mt-2 line-clamp-2">{skill.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3">{skill.excerpt}</p>
                </div>
                <div className="mt-3 flex items-center justify-end text-blue-600 text-sm">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleReadSkill(skill.id); }} className="font-medium hover:underline">Đọc thêm &rarr;</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Hiện không có bài viết kỹ năng làm việc nào.</p>
      )}
    </div>
  );
}

export default WorkSkillsPage;
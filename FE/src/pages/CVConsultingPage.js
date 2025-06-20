// Dịch vụ tư vấn CV
// src/pages/CVConsultingPage.js
import React, { useState } from 'react';

function CVConsultingPage({ navigate, showAlert }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Giả lập gửi dữ liệu đến server
    console.log('Đăng ký tư vấn CV:', formData);
    setTimeout(() => {
      setSubmitting(false);
      showAlert('Yêu cầu tư vấn của bạn đã được gửi thành công!', 'success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        message: '',
      });
      // navigate('homepage'); // Có thể điều hướng về trang chủ
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dịch vụ tư vấn CV chuyên nghiệp</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Nhận sự hỗ trợ cá nhân từ các chuyên gia để tối ưu hóa CV của bạn, giúp bạn nổi bật và đạt được công việc mơ ước.
      </p>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Đăng ký tư vấn ngay!</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">Loại dịch vụ bạn quan tâm</label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">-- Chọn dịch vụ --</option>
              <option value="review">Review và chỉnh sửa CV</option>
              <option value="writing">Viết mới CV</option>
              <option value="interview_prep">Tư vấn phỏng vấn</option>
              <option value="career_coaching">Tư vấn định hướng nghề nghiệp</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn (không bắt buộc)</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {submitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CVConsultingPage;
// src/components/CompanyCard.js
import React from 'react';

const CompanyCard = ({ company }) => {
  // Bạn có thể tùy chỉnh props 'company' tùy theo dữ liệu bạn muốn hiển thị
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-xl font-semibold">{company?.name || 'Tên Công ty'}</h2>
      <p className="text-gray-600">{company?.location || 'Địa điểm'}</p>
      <p className="text-gray-800 mt-2">{company?.description || 'Mô tả ngắn gọn về công ty.'}</p>
      {/* Thêm các chi tiết khác như logo, ngành nghề, v.v. */}
    </div>
  );
};

export default CompanyCard;
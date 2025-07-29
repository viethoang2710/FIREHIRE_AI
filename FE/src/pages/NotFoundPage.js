import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-[80vh] text-center">
      <div>
        <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-600">Trang bạn đang tìm không tồn tại.</p>
      </div>
    </div>
  );
};

export default NotFoundPage;

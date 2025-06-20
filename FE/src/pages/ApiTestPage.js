import React from 'react';
import ApiTester from '../components/Debug/ApiTester';

const ApiTestPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Trang kiểm tra API</h1>
      
      <div className="mb-8 bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          Trang này giúp bạn kiểm tra các chức năng API trực tiếp, bỏ qua xử lý của React để xác định vấn đề nằm ở frontend hay backend.
        </p>
      </div>
      
      <ApiTester />
    </div>
  );
};

export default ApiTestPage;

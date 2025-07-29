import React from 'react';
import StorageDebugger from '../components/Debug/StorageDebugger';

const StorageDebugPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Storage Debug Page</h1>
      <StorageDebugger />
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-3">Hướng dẫn sử dụng công cụ debug</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Công cụ này hiển thị tất cả dữ liệu tin tuyển dụng được lưu trong localStorage</li>
          <li>Key chung <code>recruiterJobs</code> được sử dụng cho tương thích ngược</li>
          <li>Key riêng <code>recruiterJobs_{'{userId}'}</code> lưu dữ liệu cho từng người dùng</li>
          <li>Nhấn "Làm mới dữ liệu" để cập nhật thông tin hiện tại</li>
          <li>Chọn "Hiển thị dữ liệu thô" để xem chi tiết dữ liệu lưu trữ</li>
          <li>Bạn có thể xóa từng key hoặc xóa tất cả dữ liệu</li>
          <li>Dữ liệu của user hiện tại được hiển thị nổi bật với viền màu xanh lá</li>
        </ul>
      </div>
    </div>
  );
};

export default StorageDebugPage;

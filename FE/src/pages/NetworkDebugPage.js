import React from 'react';
import ConnectionTest from '../components/Debug/ConnectionTest';

const NetworkDebugPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Trang debug kết nối mạng</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Thông tin hiện tại</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <div><strong>Frontend URL:</strong> {window.location.origin}</div>
          <div><strong>Backend URL (direct):</strong> http://localhost:8080</div>
          <div><strong>Backend URL (proxy):</strong> {window.location.origin}/api</div>
          <div><strong>API base URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:8080'}</div>
          <div><strong>Proxy configured:</strong> {process.env.REACT_APP_PROXY === 'true' ? 'Yes' : 'Check package.json'}</div>
        </div>
      </div>
      
      <ConnectionTest />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3">Các lỗi thường gặp và cách khắc phục</h2>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-bold text-lg">1. Lỗi "Network Error"</h3>
          <p><strong>Nguyên nhân:</strong> Backend không chạy, hoặc không thể kết nối đến.</p>
          <p><strong>Giải pháp:</strong></p>
          <ul className="list-disc pl-5 mt-2">
            <li>Kiểm tra xem backend có đang chạy không (port 8080)</li>
            <li>Chạy lại backend: <code>cd BE && .\mvnw-fixed.cmd spring-boot:run</code></li>
            <li>Kiểm tra cấu hình proxy trong package.json</li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-bold text-lg">2. Lỗi CORS</h3>
          <p><strong>Nguyên nhân:</strong> Backend không cho phép request từ domain của frontend.</p>
          <p><strong>Giải pháp:</strong></p>
          <ul className="list-disc pl-5 mt-2">
            <li>Đảm bảo WebConfig.java đã được cấu hình đúng</li>
            <li>Thêm <code>@CrossOrigin(origins = "http://localhost:3000")</code> vào các controller</li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-bold text-lg">3. Lỗi kết nối database</h3>
          <p><strong>Nguyên nhân:</strong> MySQL không chạy hoặc thông tin kết nối không đúng.</p>
          <p><strong>Giải pháp:</strong></p>
          <ul className="list-disc pl-5 mt-2">
            <li>Kiểm tra MySQL đang chạy: <code>netstat -ano | findstr :3306</code></li>
            <li>Kiểm tra thông tin trong application.properties</li>
            <li>Tạo database nếu chưa có: <code>CREATE DATABASE firehire_ai;</code></li>
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg">4. Lỗi 400/500 khi đăng ký</h3>
          <p><strong>Nguyên nhân:</strong> Dữ liệu không hợp lệ hoặc lỗi xử lý trong backend.</p>
          <p><strong>Giải pháp:</strong></p>
          <ul className="list-disc pl-5 mt-2">
            <li>Kiểm tra log của backend để xem lỗi chi tiết</li>
            <li>Kiểm tra dữ liệu gửi từ frontend có đúng định dạng không</li>
            <li>Sửa các controller và service trong backend nếu cần</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkDebugPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConnectionTest = () => {
  const [results, setResults] = useState({
    backendDirectCheck: { status: 'pending', message: 'Chưa kiểm tra' },
    backendProxyCheck: { status: 'pending', message: 'Chưa kiểm tra' },
    corsCheck: { status: 'pending', message: 'Chưa kiểm tra' },
    databaseCheck: { status: 'pending', message: 'Chưa kiểm tra' }
  });
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults({
      backendDirectCheck: { status: 'running', message: 'Đang kiểm tra...' },
      backendProxyCheck: { status: 'running', message: 'Đang kiểm tra...' },
      corsCheck: { status: 'running', message: 'Đang kiểm tra...' },
      databaseCheck: { status: 'running', message: 'Đang kiểm tra...' }
    });

    // Test 1: Direct backend connection
    try {
      const directResponse = await fetch('http://localhost:8080/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (directResponse.ok) {
        setResults(prev => ({
          ...prev,
          backendDirectCheck: { 
            status: 'success', 
            message: 'Kết nối thành công đến backend qua URL trực tiếp' 
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          backendDirectCheck: { 
            status: 'error', 
            message: `Lỗi: ${directResponse.status} ${directResponse.statusText}` 
          }
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        backendDirectCheck: { 
          status: 'error', 
          message: `Lỗi kết nối: ${error.message}. Backend có thể không hoạt động.` 
        }
      }));
    }

    // Test 2: Backend via proxy
    try {
      const proxyResponse = await fetch('/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (proxyResponse.ok) {
        setResults(prev => ({
          ...prev,
          backendProxyCheck: { 
            status: 'success', 
            message: 'Kết nối thành công đến backend qua proxy' 
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          backendProxyCheck: { 
            status: 'error', 
            message: `Lỗi: ${proxyResponse.status} ${proxyResponse.statusText}` 
          }
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        backendProxyCheck: { 
          status: 'error', 
          message: `Lỗi kết nối qua proxy: ${error.message}. Kiểm tra cấu hình proxy trong package.json.` 
        }
      }));
    }

    // Test 3: CORS test with preflight OPTIONS request
    try {
      const corsResponse = await fetch('http://localhost:8080/auth/register/candidate', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      if (corsResponse.ok) {
        setResults(prev => ({
          ...prev,
          corsCheck: { 
            status: 'success', 
            message: 'CORS được cấu hình đúng' 
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          corsCheck: { 
            status: 'error', 
            message: `Lỗi CORS: ${corsResponse.status} ${corsResponse.statusText}` 
          }
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        corsCheck: { 
          status: 'error', 
          message: `Lỗi kiểm tra CORS: ${error.message}` 
        }
      }));
    }

    // Test 4: Database connection (through backend)
    try {
      const dbCheckResponse = await fetch('/health/database', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => ({
        ok: false,
        status: 'error',
        statusText: 'Could not connect to backend'
      }));
      
      if (dbCheckResponse.ok) {
        const data = await dbCheckResponse.json();
        setResults(prev => ({
          ...prev,
          databaseCheck: { 
            status: 'success', 
            message: 'Kết nối cơ sở dữ liệu thành công' 
          }
        }));
      } else {
        setResults(prev => ({
          ...prev,
          databaseCheck: { 
            status: 'warning', 
            message: 'Không thể kiểm tra kết nối cơ sở dữ liệu. Endpoint /health/database không có sẵn.' 
          }
        }));
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        databaseCheck: { 
          status: 'warning', 
          message: `Không thể kiểm tra kết nối cơ sở dữ liệu: ${error.message}` 
        }
      }));
    }

    setIsRunning(false);
  };

  return (
    <div className="connection-test p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Kiểm tra kết nối hệ thống</h2>
      
      <button 
        onClick={runTests}
        disabled={isRunning}
        className={`mb-4 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRunning ? 'Đang kiểm tra...' : 'Bắt đầu kiểm tra'}
      </button>
      
      <div className="grid gap-4">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="bg-white p-3 rounded border">
            <div className="flex items-center">
              <StatusIcon status={value.status} />
              <h3 className="font-semibold ml-2">
                {key === 'backendDirectCheck' && 'Kết nối trực tiếp đến backend'}
                {key === 'backendProxyCheck' && 'Kết nối qua proxy đến backend'}
                {key === 'corsCheck' && 'Kiểm tra cấu hình CORS'}
                {key === 'databaseCheck' && 'Kiểm tra kết nối cơ sở dữ liệu'}
              </h3>
            </div>
            <p className="mt-1 text-sm text-gray-600">{value.message}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold">Gợi ý khắc phục:</h3>
        <ul className="mt-2 list-disc list-inside text-sm">
          <li>Nếu kết nối trực tiếp thất bại: Kiểm tra backend có đang chạy không (port 8080)</li>
          <li>Nếu kết nối qua proxy thất bại: Kiểm tra cấu hình proxy trong package.json (thêm "proxy": "http://localhost:8080")</li>
          <li>Nếu kiểm tra CORS thất bại: Kiểm tra cấu hình CORS trong backend</li>
          <li>Nếu kiểm tra cơ sở dữ liệu thất bại: Kiểm tra kết nối MySQL trong application.properties</li>
          <li>Khởi động lại cả frontend và backend sau khi thay đổi cấu hình</li>
        </ul>
      </div>
    </div>
  );
};

// Status icon component
const StatusIcon = ({ status }) => {
  if (status === 'pending') {
    return <span className="text-gray-400">⚪</span>;
  } else if (status === 'running') {
    return <span className="text-blue-500">🔄</span>;
  } else if (status === 'success') {
    return <span className="text-green-500">✅</span>;
  } else if (status === 'warning') {
    return <span className="text-yellow-500">⚠️</span>;
  } else if (status === 'error') {
    return <span className="text-red-500">❌</span>;
  }
  return null;
};

export default ConnectionTest;

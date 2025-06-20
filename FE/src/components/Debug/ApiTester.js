import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTester = () => {
  const [testResults, setTestResults] = useState({
    dbConnection: { status: 'pending', message: 'Chưa kiểm tra' },
    backendHealth: { status: 'pending', message: 'Chưa kiểm tra' },
    registerApi: { status: 'pending', message: 'Chưa kiểm tra' },
    loginApi: { status: 'pending', message: 'Chưa kiểm tra' }
  });

  const [isTestRunning, setIsTestRunning] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://localhost:8080');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [directRegisterData, setDirectRegisterData] = useState({
    fullName: 'Test User',
    email: `test${Math.floor(Math.random() * 1000)}@example.com`,
    password: 'password123',
    role: 'candidate'
  });

  // Thêm state cho kết quả chi tiết
  const [apiResponse, setApiResponse] = useState('');
  const [networkError, setNetworkError] = useState('');

  const runAllTests = async () => {
    setIsTestRunning(true);
    setTestResults({
      dbConnection: { status: 'running', message: 'Đang kiểm tra...' },
      backendHealth: { status: 'running', message: 'Đang kiểm tra...' },
      registerApi: { status: 'running', message: 'Đang kiểm tra...' },
      loginApi: { status: 'running', message: 'Đang kiểm tra...' }
    });
    
    await testBackendHealth();
    await testDbConnection();
    await testRegisterApi();
    
    setIsTestRunning(false);
  };

  const testBackendHealth = async () => {
    try {
      const response = await axios.get(`${backendUrl}/health`, { timeout: 5000 });
      
      if (response.status === 200) {
        setTestResults(prev => ({
          ...prev,
          backendHealth: { 
            status: 'success', 
            message: `Backend hoạt động. Phản hồi: ${JSON.stringify(response.data)}` 
          }
        }));
        return true;
      } else {
        setTestResults(prev => ({
          ...prev,
          backendHealth: { 
            status: 'error', 
            message: `Backend trả về mã lỗi: ${response.status}` 
          }
        }));
        return false;
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        backendHealth: { 
          status: 'error', 
          message: `Không thể kết nối đến backend: ${error.message}` 
        }
      }));
      return false;
    }
  };

  const testDbConnection = async () => {
    try {
      const response = await axios.get(`${backendUrl}/health/database`, { timeout: 5000 });
      
      if (response.status === 200) {
        setTestResults(prev => ({
          ...prev,
          dbConnection: { 
            status: 'success', 
            message: `Kết nối database thành công. ${JSON.stringify(response.data)}` 
          }
        }));
        return true;
      } else {
        setTestResults(prev => ({
          ...prev,
          dbConnection: { 
            status: 'error', 
            message: `Kiểm tra database trả về mã lỗi: ${response.status}` 
          }
        }));
        return false;
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        dbConnection: { 
          status: 'warning', 
          message: `Không thể kiểm tra kết nối database: ${error.message}` 
        }
      }));
      return false;
    }
  };

  const testRegisterApi = async () => {
    try {
      // Generate a random email to avoid duplicates
      const testUser = {
        ...directRegisterData,
        email: `test${Math.floor(Math.random() * 10000)}@example.com`
      };
      
      setTestResults(prev => ({
        ...prev,
        registerApi: { 
          status: 'running', 
          message: `Đang thử đăng ký với email: ${testUser.email}...` 
        }
      }));
      
      const endpoint = testUser.role === 'employer' 
        ? '/auth/register/employer' 
        : '/auth/register/candidate';
      
      console.log('Sending test registration:', {...testUser, password: '[REDACTED]'});
      
      const response = await axios.post(`${backendUrl}${endpoint}`, testUser, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      setApiResponse(JSON.stringify(response.data, null, 2));
      
      if (response.status === 200 || response.status === 201) {
        setTestResults(prev => ({
          ...prev,
          registerApi: { 
            status: 'success', 
            message: `Đăng ký thành công! Phản hồi: ${JSON.stringify(response.data)}` 
          }
        }));
        
        // Try to login with the created account
        await testLoginApi(testUser.email, testUser.password);
        
        return true;
      } else {
        setTestResults(prev => ({
          ...prev,
          registerApi: { 
            status: 'warning', 
            message: `API đăng ký trả về mã không mong đợi: ${response.status}` 
          }
        }));
        return false;
      }
    } catch (error) {
      setNetworkError(JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      }, null, 2));
      
      setTestResults(prev => ({
        ...prev,
        registerApi: { 
          status: 'error', 
          message: `Lỗi gọi API đăng ký: ${error.message}. ${error.response?.data ? `Phản hồi: ${JSON.stringify(error.response.data)}` : ''}` 
        }
      }));
      return false;
    }
  };

  const testLoginApi = async (email, password) => {
    try {
      const loginData = { email, password };
      
      setTestResults(prev => ({
        ...prev,
        loginApi: { 
          status: 'running', 
          message: `Đang thử đăng nhập với email: ${email}...` 
        }
      }));
      
      const response = await axios.post(`${backendUrl}/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      if (response.status === 200) {
        setTestResults(prev => ({
          ...prev,
          loginApi: { 
            status: 'success', 
            message: `Đăng nhập thành công! Token nhận được.` 
          }
        }));
        return true;
      } else {
        setTestResults(prev => ({
          ...prev,
          loginApi: { 
            status: 'warning', 
            message: `API đăng nhập trả về mã không mong đợi: ${response.status}` 
          }
        }));
        return false;
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        loginApi: { 
          status: 'error', 
          message: `Lỗi gọi API đăng nhập: ${error.message}. ${error.response?.data ? `Phản hồi: ${JSON.stringify(error.response.data)}` : ''}` 
        }
      }));
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDirectRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Công cụ kiểm tra API</h1>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">Công cụ này sẽ gửi các yêu cầu trực tiếp đến backend để kiểm tra các chức năng API. Các kiểm tra này sẽ bỏ qua React và chạy trực tiếp với Axios để xác minh kết nối API đúng.</p>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Backend URL</label>
        <div className="flex">
          <input
            type="text"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            className="flex-1 rounded-l border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="bg-gray-200 px-3 rounded-r hover:bg-gray-300"
          >
            {showAdvanced ? 'Ẩn' : 'Tùy chọn'}
          </button>
        </div>
      </div>
      
      {showAdvanced && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h2 className="font-semibold mb-3">Dữ liệu đăng ký test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
              <input
                type="text"
                name="fullName"
                value={directRegisterData.fullName}
                onChange={handleInputChange}
                className="w-full rounded border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={directRegisterData.email}
                onChange={handleInputChange}
                className="w-full rounded border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="text"
                name="password"
                value={directRegisterData.password}
                onChange={handleInputChange}
                className="w-full rounded border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản</label>
              <select
                name="role"
                value={directRegisterData.role}
                onChange={handleInputChange}
                className="w-full rounded border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="candidate">Ứng viên</option>
                <option value="employer">Nhà tuyển dụng</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={runAllTests}
        disabled={isTestRunning}
        className={`w-full py-3 px-4 rounded-lg mb-6 font-medium text-white ${isTestRunning ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isTestRunning ? 'Đang chạy kiểm tra...' : 'Chạy tất cả kiểm tra'}
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(testResults).map(([key, value]) => (
          <div key={key} className="p-4 rounded-lg border shadow-sm bg-white">
            <div className="flex items-center mb-2">
              {value.status === 'pending' && <span className="text-gray-500 mr-2">⚪</span>}
              {value.status === 'running' && <span className="text-blue-500 mr-2">🔄</span>}
              {value.status === 'success' && <span className="text-green-500 mr-2">✅</span>}
              {value.status === 'warning' && <span className="text-yellow-500 mr-2">⚠️</span>}
              {value.status === 'error' && <span className="text-red-500 mr-2">❌</span>}
              
              <h2 className="font-semibold">
                {key === 'dbConnection' && 'Kết nối cơ sở dữ liệu'}
                {key === 'backendHealth' && 'Trạng thái Backend'}
                {key === 'registerApi' && 'API Đăng ký'}
                {key === 'loginApi' && 'API Đăng nhập'}
              </h2>
            </div>
            <p className={`text-sm ${value.status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>{value.message}</p>
          </div>
        ))}
      </div>
      
      {apiResponse && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Phản hồi API:</h2>
          <pre className="bg-gray-50 p-3 rounded border overflow-auto max-h-60">{apiResponse}</pre>
        </div>
      )}
      
      {networkError && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-red-600">Lỗi Network:</h2>
          <pre className="bg-red-50 p-3 rounded border border-red-200 overflow-auto max-h-60 text-red-800">{networkError}</pre>
        </div>
      )}
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <h2 className="font-semibold mb-2">Gợi ý khắc phục lỗi đăng ký:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Đảm bảo MySQL đang chạy (kiểm tra với lệnh: <code className="bg-gray-100 p-1 rounded">netstat -ano | findstr :3306</code>)</li>
          <li>Kiểm tra thông tin kết nối database trong <code className="bg-gray-100 p-1 rounded">application.properties</code></li>
          <li>Đảm bảo database <code className="bg-gray-100 p-1 rounded">firehire_ai</code> đã được tạo trong MySQL</li>
          <li>Đảm bảo backend đang chạy ở port 8080 (kiểm tra tại <a href="http://localhost:8080/health" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">http://localhost:8080/health</a>)</li>
          <li>Đảm bảo không có lỗi trong log backend khi chạy</li>
          <li>Kiểm tra tên trường dữ liệu gửi đến API có khớp với yêu cầu của backend không</li>
        </ol>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h2 className="font-semibold mb-2">Kiểm tra trực tiếp các API:</h2>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Endpoint Health: </span>
            <a href={`${backendUrl}/health`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{`${backendUrl}/health`}</a>
          </div>
          <div>
            <span className="font-medium">Database Health: </span>
            <a href={`${backendUrl}/health/database`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{`${backendUrl}/health/database`}</a>
          </div>
          <div className="mt-2">
            <p><span className="font-medium">API Đăng ký (POST): </span>{`${backendUrl}/auth/register/candidate`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;

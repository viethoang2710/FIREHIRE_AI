import React, { useState, useEffect } from 'react';

/**
 * Component để debug trạng thái localStorage và dữ liệu tin tuyển dụng
 */
const StorageDebugger = () => {
  const [storageData, setStorageData] = useState({});
  const [currentUserId, setCurrentUserId] = useState('');
  const [showRawData, setShowRawData] = useState(false);
  
  // Phân tích dữ liệu localStorage khi component được render
  useEffect(() => {
    refreshData();
  }, []);
  
  // Làm mới dữ liệu từ localStorage
  const refreshData = () => {
    const data = {};
    const userId = localStorage.getItem('current_employer_id') || '';
    
    // Thu thập tất cả các key trong localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        // Phân loại dữ liệu
        if (key === 'recruiterJobs') {
          const value = JSON.parse(localStorage.getItem(key));
          data.commonJobs = { key, count: Array.isArray(value) ? value.length : 0, value };
        } else if (key.startsWith('recruiterJobs_')) {
          const value = JSON.parse(localStorage.getItem(key));
          const thisUserId = key.replace('recruiterJobs_', '');
          data[key] = { 
            key, 
            userId: thisUserId,
            count: Array.isArray(value) ? value.length : 0,
            value,
            isCurrent: thisUserId === userId
          };
        } else if (key === 'known_employer_ids') {
          const value = JSON.parse(localStorage.getItem(key));
          data.knownUsers = { key, value, count: value.length };
        } else if (key === 'user' || key === 'token' || key === 'role' || key === 'current_employer_id') {
          // Thông tin đăng nhập
          const value = localStorage.getItem(key);
          data[key] = { key, value: key === 'user' ? JSON.parse(value) : value };
        }
      } catch (e) {
        console.error(`Lỗi khi phân tích dữ liệu cho key ${key}:`, e);
        data[key] = { key, error: e.message };
      }
    }
    
    setStorageData(data);
    setCurrentUserId(userId);
  };
  
  // Xóa một key cụ thể
  const clearKey = (key) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dữ liệu "${key}" không?`)) {
      localStorage.removeItem(key);
      refreshData();
      alert(`Đã xóa "${key}" khỏi localStorage.`);
    }
  };
  
  // Xóa tất cả dữ liệu tin tuyển dụng
  const clearAllJobs = () => {
    if (window.confirm('Xóa TẤT CẢ dữ liệu tin tuyển dụng?')) {
      // Xóa key chung
      localStorage.removeItem('recruiterJobs');
      
      // Xóa tất cả key riêng
      Object.keys(storageData).forEach(key => {
        if (key.startsWith('recruiterJobs_')) {
          localStorage.removeItem(key);
        }
      });
      
      refreshData();
      alert('Đã xóa tất cả dữ liệu tin tuyển dụng.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Công cụ debug localStorage</h1>
      <div className="mb-4 flex items-center justify-between">
        <button 
          onClick={refreshData} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Làm mới dữ liệu
        </button>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="showRawData" 
            checked={showRawData} 
            onChange={() => setShowRawData(!showRawData)} 
            className="mr-2"
          />
          <label htmlFor="showRawData">Hiển thị dữ liệu thô</label>
        </div>
      </div>
      
      <div className="mb-6 p-3 border border-yellow-300 bg-yellow-50 rounded">
        <h2 className="font-semibold">Thông tin đăng nhập hiện tại:</h2>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div><span className="font-semibold">User ID:</span> {currentUserId || 'Chưa đăng nhập'}</div>
          <div><span className="font-semibold">Role:</span> {storageData.role?.value || 'N/A'}</div>
          {storageData.user && (
            <div className="col-span-2">
              <span className="font-semibold">User:</span> {JSON.stringify(storageData.user.value)}
            </div>
          )}
        </div>
      </div>
      
      {/* Phần thông tin về dữ liệu chung */}
      {storageData.commonJobs && (
        <div className="mb-6 p-4 border border-gray-300 rounded">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Key chung: {storageData.commonJobs.key}</h2>
            <div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                {storageData.commonJobs.count} tin
              </span>
              <button 
                onClick={() => clearKey(storageData.commonJobs.key)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
          {showRawData && (
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40 text-xs">
              {JSON.stringify(storageData.commonJobs.value, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      {/* Phần thông tin về danh sách người dùng đã biết */}
      {storageData.knownUsers && (
        <div className="mb-6 p-4 border border-gray-300 rounded">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Người dùng đã biết: {storageData.knownUsers.count} user</h2>
            <button 
              onClick={() => clearKey('known_employer_ids')}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              Xóa
            </button>
          </div>
          <div className="mt-2">
            {storageData.knownUsers.value.map(userId => (
              <span 
                key={userId} 
                className={`inline-block mr-2 mb-2 px-3 py-1 rounded ${userId === currentUserId ? 
                  'bg-green-100 text-green-800 border border-green-500' : 
                  'bg-gray-100 text-gray-800'}`}
              >
                {userId} {userId === currentUserId && '(hiện tại)'}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Phần thông tin về key riêng của từng user */}
      <h2 className="font-bold text-lg mb-2">Key riêng theo user ID:</h2>
      <div className="space-y-4">
        {Object.keys(storageData).filter(key => key.startsWith('recruiterJobs_')).map(key => {
          const data = storageData[key];
          return (
            <div 
              key={key} 
              className={`p-4 border rounded ${data.isCurrent ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold">
                  {key} 
                  {data.isCurrent && <span className="ml-2 text-green-600">(User hiện tại)</span>}
                </h3>
                <div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                    {data.count} tin
                  </span>
                  <button 
                    onClick={() => clearKey(key)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              {showRawData && (
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40 text-xs">
                  {JSON.stringify(data.value, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Nút xóa tất cả */}
      <div className="mt-6 pt-4 border-t border-gray-300">
        <button 
          onClick={clearAllJobs} 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Xóa tất cả dữ liệu tin tuyển dụng
        </button>
        <p className="mt-2 text-sm text-gray-600">
          Cảnh báo: Hành động này sẽ xóa tất cả dữ liệu tin tuyển dụng khỏi localStorage, bao gồm cả key chung và key riêng.
        </p>
      </div>
    </div>
  );
};

export default StorageDebugger;

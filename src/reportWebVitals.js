import React, { useState } from 'react';
import RegistrationPage from './components/Auth/RegistrationPage';
import LoginPage from './components/Auth/LoginPage';
import HomePage from './pages/HomePage';
import AlertMessage from './components/UI/AlertMessage';

function App() {
  const [currentPage, setCurrentPage] = useState('homepage'); // 'homepage', 'login', 'register'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'Người dùng A', avatar: 'https://placehold.co/40x40/007bff/ffffff?text=A' });
  const [alert, setAlert] = useState(null); // { message: '', type: 'success' | 'error' }

  const showAlert = (message, type = 'success', duration = 3000) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, duration);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Trong ứng dụng thực tế, bạn sẽ lấy thông tin người dùng từ API
    setUser({ name: 'Người dùng A', avatar: 'https://placehold.co/40x40/007bff/ffffff?text=A' });
    setCurrentPage('homepage');
    showAlert('Đăng nhập thành công!', 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null); // Xóa thông tin người dùng
    setCurrentPage('homepage');
    showAlert('Đăng xuất thành công.', 'success');
  };

  const handleRegister = (userData) => { // userData có thể chứa tên người dùng từ form
    setIsLoggedIn(true);
    // Giả sử userData.fullName chứa tên người dùng đã đăng ký
    setUser({ name: userData.fullName || 'Người dùng Mới', avatar: `https://placehold.co/40x40/28a745/ffffff?text=${(userData.fullName || 'M').charAt(0).toUpperCase()}` });
    setCurrentPage('homepage');
    showAlert('Đăng ký thành công! Chào mừng bạn.', 'success');
  };

  let pageContent;
  if (currentPage === 'homepage') {
    pageContent = <HomePage setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} showAlert={showAlert} />;
  } else if (currentPage === 'login') {
    pageContent = <LoginPage setCurrentPage={setCurrentPage} handleLogin={handleLogin} showAlert={showAlert} />;
  } else if (currentPage === 'register') {
    // Truyền thêm fullName vào handleRegister nếu muốn cập nhật tên người dùng
    pageContent = <RegistrationPage setCurrentPage={setCurrentPage} handleRegister={handleRegister} showAlert={showAlert} />;
  }

  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      {alert && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {pageContent}
    </div>
  );
}

export default App;
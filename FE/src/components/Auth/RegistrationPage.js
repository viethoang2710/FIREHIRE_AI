// src/pages/RegistrationPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import './RegistrationPage.css'; // Import CSS file nếu bạn tạo file riêng

const RegistrationPage = ({ showAlert }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '', 
    role: 'candidate',
    companyName: '',
    website: '',
    description: ''
  });

  const [message, setMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Xác định endpoint dựa trên vai trò người dùng đã chọn
      const endpoint = formData.role === 'candidate' 
        ? 'http://localhost:8080/api/auth/register/candidate' 
        : 'http://localhost:8080/api/auth/register/employer';
      // Chuẩn bị dữ liệu phù hợp với API
      const requestData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone // cho candidate
      };
      // Thêm dữ liệu cho nhà tuyển dụng nếu cần
      if (formData.role === 'employer') {
        requestData.companyName = formData.companyName || 'Chưa cập nhật';
        requestData.phoneNumber = formData.phone; // Đảm bảo tên trường là phone
        requestData.website = formData.website || 'Chưa cập nhật';
        requestData.description = formData.description || 'Chưa cập nhật';
      }
      
      const response = await axios.post(endpoint, requestData);
      setMessage('Đăng ký thành công! ' + (response.data.message || ''));
      setIsRegistered(true);
      
      if (showAlert) {
        showAlert('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.', 'success');
      }
      
      // Sau khi đăng ký thành công, chuyển về trang đăng nhập
      console.log("Registration successful, redirecting to login page");
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Chờ 1.5 giây để người dùng đọc thông báo thành công
    } catch (error) {
      setMessage('Đăng ký thất bại: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="registration-container">
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Họ tên"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="candidate">Ứng viên</option>
          <option value="employer">Nhà tuyển dụng</option>
        </select>

        {formData.role === 'employer' && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Tên công ty"
              value={formData.companyName}
              onChange={handleChange}
              required={formData.role === 'employer'}
            />
            <input
              type="text"
              name="website"
              placeholder="Website công ty"
              value={formData.website}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Mô tả công ty"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </>
        )}
        
        <button type="submit">Đăng ký</button>
      </form>
      {message && <p className={message.includes('thành công') ? 'success-message' : 'error-message'}>{message}</p>}
    </div>
  );
};

export default RegistrationPage;

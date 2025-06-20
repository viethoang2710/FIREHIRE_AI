import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setLoading(true);
      try {
        console.log('Preparing registration data...');
        
        // Prepare user data based on role
        let userData;
        if (formData.role === 'candidate') {
          userData = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phoneNumber: '' // Optional field, can be updated later in profile
          };
        } else if (formData.role === 'employer') {
          userData = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            companyName: formData.fullName, // Default to fullName, can be updated later
            website: '',
            description: ''
          };
        }
        
        console.log('Submitting registration data:', { ...userData, password: '[REDACTED]' });
        
        // Use context register function
        const result = await register(userData);        console.log('Registration successful:', result);
        
        toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
        navigate('/login');      } catch (error) {
        console.error('Registration error:', error);
        console.error('Error type:', typeof error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status
        });
        
        let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
        
        // Network error detection
        if (error.message && error.message.includes('Network Error')) {
          errorMessage = 'Lỗi kết nối mạng! Không thể kết nối đến máy chủ. Vui lòng kiểm tra:';
          errorMessage += '\n- Backend server đã được khởi động';
          errorMessage += '\n- Không có vấn đề với cấu hình CORS';
          errorMessage += '\n- Proxy đã được cấu hình đúng trong package.json';
        } else if (error.response) {
          // Server returned an error response
          if (error.response.status === 400) {
            errorMessage = error.response.data || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
          } else if (error.response.status === 500) {
            errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
          } else if (error.response.status === 409) {
            errorMessage = 'Email này đã được sử dụng.';
          }
        }
        
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        console.log('Showing error message:', errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="candidate">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
            <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="auth-divider">
            <span>or sign up with</span>
          </div>
          
          <div className="social-buttons">
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.56V20.34H19.28C21.36 18.42 22.56 15.59 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.56C14.74 18.22 13.48 18.63 12 18.63C9.11 18.63 6.69 16.71 5.86 14.11H2.18V16.96C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
                <path d="M5.86 14.09C5.65 13.43 5.53 12.73 5.53 12C5.53 11.27 5.65 10.57 5.86 9.91V7.06H2.18C1.43 8.54 1 10.22 1 12C1 13.78 1.43 15.46 2.18 16.94L5.86 14.09Z" fill="#FBBC05" />
                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07L5.86 9.92C6.69 7.32 9.11 5.38 12 5.38Z" fill="#EA4335" />
              </svg>
              <span>Google</span>
            </button>
            <button type="button" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073C24 5.404 18.629 0 12 0C5.37 0 0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.413C10.125 6.386 11.917 4.713 14.658 4.713C15.97 4.713 17.344 4.951 17.344 4.951V7.925H15.83C14.34 7.925 13.875 8.85 13.875 9.797V12.073H17.203L16.671 15.563H13.875V24C19.612 23.094 24 18.1 24 12.073Z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
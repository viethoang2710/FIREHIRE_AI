import api from './api';
import axios from 'axios';

// Sử dụng endpoint của phần BE
const AUTH_ENDPOINT = '/auth';

const AuthService = {  register: async (userData) => {
    try {
      // Determine which endpoint to use based on role
      const endpoint = userData.role === 'employer' 
        ? `${AUTH_ENDPOINT}/register/employer` 
        : `${AUTH_ENDPOINT}/register/candidate`;
      
      console.log(`Sending registration data to ${endpoint}:`, {...userData, password: '[REDACTED]'});
      console.log('Full API URL:', api.defaults.baseURL + endpoint);
      
      try {
        const response = await api.post(endpoint, userData);
        console.log('Registration response:', response.data);
        return response.data;
      } catch (networkError) {
        // Detailed network error logging
        console.error('NETWORK ERROR DETAILS:');
        console.error('- Error name:', networkError.name);
        console.error('- Error message:', networkError.message);
        console.error('- Request URL:', networkError.config?.url);
        console.error('- Request method:', networkError.config?.method);
        console.error('- Request headers:', networkError.config?.headers);
        console.error('- Request data:', networkError.config?.data);
        console.error('- Response status:', networkError.response?.status);
        console.error('- Response data:', networkError.response?.data);
        console.error('- Is network error:', networkError.isAxiosError && !networkError.response);
        
        // Attempt direct fetch to diagnose CORS or network issues
        console.log('Attempting direct fetch to diagnose connection issues...');
        try {
          const testFetch = await fetch(api.defaults.baseURL + '/health', {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Direct fetch test result:', {
            ok: testFetch.ok,
            status: testFetch.status,
            statusText: testFetch.statusText
          });
        } catch (fetchError) {
          console.error('Direct fetch test failed:', fetchError.message);
        }
        
        throw networkError;
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: error.config?.url
      });
      throw error?.response?.data || error;
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await api.post(`${AUTH_ENDPOINT}/login`, {
        email: credentials.email,
        password: credentials.password
      });
      
      // Store user data and token in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      } else if (response.data) {
        // Handle the mock return from our backend which may not include token directly
        const userData = {
          email: credentials.email,
          // Extract role information if available in response
          role: response.data.includes('EMPLOYER') ? 'employer' : 'candidate',
          fullName: 'User' // Default name to be updated by server data later
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', 'temp-token'); // Placeholder until JWT implementation is complete
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
    getToken: () => {
    return localStorage.getItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },
    // Set up auth header for all requests
  setupAxiosInterceptors: () => {
    // Note: This function might not be needed as we already set up interceptors in api.js
    // But keeping it here for backwards compatibility
    api.interceptors.request.use(
      config => {
        const token = AuthService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
};

export default AuthService;
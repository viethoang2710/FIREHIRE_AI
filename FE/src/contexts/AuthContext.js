import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create the Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);
    // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the backend API to authenticate the user
      const response = await authService.login(credentials);
      
      // Get user from localStorage (set by authService)
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      
      return response;
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
    // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[AuthContext] Registering user:', { ...userData, password: '[REDACTED]' });
      // Call the backend API to register the user
      const result = await authService.register(userData);
      console.log('[AuthContext] Registration successful:', result);
      return result;
    } catch (err) {
      console.error('[AuthContext] Registration error:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Value to be provided to consumers of this context
  const value = {
    currentUser,
    isLoading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
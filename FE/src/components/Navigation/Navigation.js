// Or wherever your navigation component is defined

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ setCurrentPage }) => {
  // Get navigate function from React Router hook
  const navigate = useNavigate();

  // Unified navigation handler that works with both approaches
  const handleNavigate = (path, pageName = null) => {
    if (path && typeof navigate === 'function') {
      // Use React Router navigation if available
      navigate(path);
    } else if (pageName && typeof setCurrentPage === 'function') {
      // Fallback to traditional state-based navigation
      setCurrentPage(pageName);
    } else {
      // Ultimate fallback if nothing else works
      console.error('Navigation failed - both navigation methods unavailable');
    }
  };

  return (
    <div className="navigation">
      <button onClick={() => handleNavigate('/home', 'homepage')}>Home</button>
      <button onClick={() => handleNavigate('/login', 'login')}>Login</button>
      <button onClick={() => handleNavigate('/register', 'register')}>Register</button>
      {/* Other navigation buttons */}
    </div>
  );
};

export default Navigation;
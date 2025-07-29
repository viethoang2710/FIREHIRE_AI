import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationComponent = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (navigate) {
      navigate(path);
    } else {
      console.error('navigate function is not available');
      // Fallback navigation using window.location as a last resort
      window.location.href = path;
    }
  };

  return (
    <div>
      <button onClick={() => handleNavigate('/home')}>Home</button>
      <button onClick={() => handleNavigate('/profile')}>Profile</button>
      {/* Other navigation buttons */}
    </div>
  );
};

export default NavigationComponent;
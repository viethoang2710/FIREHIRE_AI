import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  
  // For components using the old pattern
  const setCurrentPage = (pageName) => {
    switch (pageName) {
      case 'homepage': navigate('/'); break;
      case 'login': navigate('/login'); break;
      case 'register': navigate('/register'); break;
      case 'profile': navigate('/profile'); break;
      // Add other page mappings as needed
      default: navigate(`/${pageName}`);
    }
  };

  return (
    <NavigationContext.Provider value={{ navigate, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useAppNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useAppNavigation must be used within a NavigationProvider');
  }
  return context;
};
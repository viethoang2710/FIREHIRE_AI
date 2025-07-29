import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NavigationContext = React.createContext();

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const value = {
    navigate,
    goTo: (path) => navigate(path),
    goBack: () => navigate(-1),
    goForward: () => navigate(1)
  };
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
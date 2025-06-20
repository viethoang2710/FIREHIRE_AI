import { useNavigate } from 'react-router-dom';

// This won't work because hooks can only be used inside React components
export const navigateTo = (path) => {
  const navigate = useNavigate(); // THIS IS WRONG! Hooks can't be used in regular functions
  navigate(path);
};

// Instead, create a component or custom hook that uses useNavigate properly
export const useNavigation = () => {
  const navigate = useNavigate();
  
  return {
    navigateTo: (path) => navigate(path),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
  };
};
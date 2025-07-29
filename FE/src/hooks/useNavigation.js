import { useNavigate } from 'react-router-dom';

/**
 * Custom hook that wraps the React Router's useNavigate hook
 * @returns {Function} navigate function from React Router
 */
export const useNavigation = () => {
  return useNavigate();
};

export default useNavigation;
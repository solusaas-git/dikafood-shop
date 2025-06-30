import { useNavigate, generatePath } from 'react-router-dom';

/**
 * Custom hook for app navigation
 * Provides convenient methods for navigating to different parts of the app
 */
const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    // General navigation
    goTo: (path, options) => navigate(path, options),
    goBack: () => navigate(-1),
    goHome: () => navigate('/'),

    // Product navigation
    goToProducts: () => navigate('/produits'),
    goToProduct: (productId) => navigate(`/produits/${productId}`),
    goToProductNotFound: () => navigate('/produits/not-found'),

    // Generate a path with parameters
    generatePath,
  };
};

export default useAppNavigation;
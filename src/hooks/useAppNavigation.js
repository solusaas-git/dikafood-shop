import { useRouter } from 'next/navigation';

/**
 * Custom hook for app navigation
 * Provides convenient methods for navigating to different parts of the app
 */
const useAppNavigation = () => {
  const router = useRouter();

  return {
    // General navigation
    goTo: (path, options) => router.push(path),
    goBack: () => router.back(),
    goHome: () => router.push('/'),

    // Product navigation
    goToProducts: () => router.push('/produits'),
    goToProduct: (productId) => router.push(`/produits/${productId}`),
    goToProductNotFound: () => router.push('/produits/not-found'),

    // Shop navigation
    goToShop: () => router.push('/shop'),
    goToCheckout: () => router.push('/checkout'),
  };
};

export default useAppNavigation;
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Custom hook for managing page loading states
 * This hook provides easy access to global loading controls
 */
export const usePageLoading = () => {
  const { isLoading, showLoading, hideLoading, loadingMessage } = useLoading();

  /**
   * Show loading with automatic hide after delay
   * @param {string} message - Loading message to display
   * @param {number} duration - Duration in ms (optional)
   */
  const showLoadingWithDelay = (message = 'Chargement...', duration = 1000) => {
    showLoading(message);
    setTimeout(() => {
      hideLoading();
    }, duration);
  };

  /**
   * Execute an async function with loading state
   * @param {Function} asyncFn - Async function to execute
   * @param {string} message - Loading message
   */
  const withLoading = async (asyncFn, message = 'Chargement...') => {
    try {
      showLoading(message);
      const result = await asyncFn();
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
    showLoadingWithDelay,
    withLoading,
    loadingMessage
  };
};

export default usePageLoading;

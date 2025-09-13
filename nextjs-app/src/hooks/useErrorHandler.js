import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContextNew';
import { handleApiError, createErrorHandlingFetch } from '@/utils/errorHandler';

/**
 * Hook for handling errors with notifications
 * Provides utilities for handling API errors and showing notifications
 */
const useErrorHandler = () => {
  const { error: notifyError } = useNotification();

  // Handle API error and show notification
  const handleError = useCallback((err, options = {}) => {
    return handleApiError(err, notifyError, options);
  }, [notifyError]);

  // Create a wrapped fetch function that handles errors
  const withErrorHandling = useCallback((fetchFn, options = {}) => {
    return createErrorHandlingFetch(fetchFn, notifyError, options);
  }, [notifyError]);

  // Wrap an async function with error handling
  const wrapWithErrorHandling = useCallback((asyncFn, options = {}) => {
    return async (...args) => {
      try {
        return await asyncFn(...args);
      } catch (err) {
        handleError(err, options);
        throw err; // Re-throw to allow further handling
      }
    };
  }, [handleError]);

  return {
    handleError,
    withErrorHandling,
    wrapWithErrorHandling,
  };
};

export default useErrorHandler;
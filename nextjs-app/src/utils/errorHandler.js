/**
 * Error handler utilities for API requests
 */

/**
 * Handle API errors and show appropriate notifications
 *
 * @param {Error} error - Error object from API request
 * @param {Function} notifyError - Function to show error notification
 * @param {Object} options - Additional options
 * @returns {Object} Error details
 */
export const handleApiError = (error, notifyError, options = {}) => {
  const {
    defaultMessage = 'Une erreur est survenue lors de la communication avec le serveur.',
    silent = false,
    title = 'Erreur API',
    logToConsole = true,
  } = options;

  // Extract error message
  const statusCode = error?.response?.status;
  const responseData = error?.response?.data;
  const message = responseData?.message || error?.message || defaultMessage;

  // Log error to console if needed
  if (logToConsole) {
    console.error('API Error:', {
      statusCode,
      message,
      error,
    });
  }

  // Show notification if not silent
  if (!silent && notifyError) {
    notifyError(message, { title });
  }

  // Return error details
  return {
    message,
    statusCode,
    originalError: error,
    responseData,
  };
};

/**
 * Create a wrapped fetch function that handles errors with notifications
 *
 * @param {Function} fetchFn - Original fetch function
 * @param {Function} notifyError - Function to show error notification
 * @param {Object} options - Default options for error handling
 * @returns {Function} Wrapped fetch function
 */
export const createErrorHandlingFetch = (fetchFn, notifyError, options = {}) => {
  return async (...args) => {
    try {
      return await fetchFn(...args);
    } catch (error) {
      handleApiError(error, notifyError, options);
      throw error; // Re-throw to allow further handling
    }
  };
};

export default {
  handleApiError,
  createErrorHandlingFetch,
};
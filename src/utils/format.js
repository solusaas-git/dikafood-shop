/**
 * Format a price with the specified currency and locale
 *
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: 'MAD')
 * @param {string} locale - The locale to use for formatting (default: 'fr-FR')
 * @returns {string} - The formatted price string
 */
export const formatPrice = (price, currency = 'MAD', locale = 'fr-FR') => {
  if (price === undefined || price === null) return '';

  // For MAD (Moroccan Dirham), use a simple format with space
  if (currency === 'MAD') {
    return `${parseFloat(price).toFixed(2).replace(/\.00$/, '')} ${currency}`;
  }

  // Otherwise use the Intl formatter
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Format a date with the specified locale and options
 *
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale to use for formatting (default: 'fr-FR')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - The formatted date string
 */
export const formatDate = (date, locale = 'fr-MA', options = {}) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Default options
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  try {
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format a number with the specified locale and options
 *
 * @param {number} number - The number to format
 * @param {string} locale - The locale to use for formatting (default: 'fr-FR')
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} - The formatted number string
 */
export const formatNumber = (number, locale = 'fr-FR', options = {}) => {
  if (number === undefined || number === null) return '';

  return new Intl.NumberFormat(locale, options).format(number);
};

/**
 * Truncate a text to a specific length and add ellipsis
 *
 * @param {string} text - The text to truncate
 * @param {number} length - The maximum length
 * @returns {string} - The truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';

  if (text.length <= length) return text;

  return text.substring(0, length) + '...';
};

/**
 * Format a phone number for display
 *
 * @param {string} phone - The phone number
 * @param {string} format - The format to use (default: 'XX XX XX XX XX')
 * @returns {string} - The formatted phone number
 */
export const formatPhone = (phone, format = 'XX XX XX XX XX') => {
  if (!phone) return '';

  // Remove all non-digits
  const cleaned = ('' + phone).replace(/\D/g, '');

  // Format according to the mask
  let result = '';
  let cleanedIndex = 0;

  for (let i = 0; i < format.length; i++) {
    if (format[i] === 'X') {
      if (cleanedIndex < cleaned.length) {
        result += cleaned[cleanedIndex];
        cleanedIndex++;
      } else {
        result += 'X';
      }
    } else {
      result += format[i];
    }
  }

  return result;
};

/**
 * Format a number as currency
 *
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: MAD)
 * @param {string} locale - The locale (default: fr-MA)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'MAD', locale = 'fr-MA') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }

  // Simple fallback if Intl is not available
  if (typeof Intl === 'undefined' || typeof Intl.NumberFormat === 'undefined') {
    return `${amount.toFixed(2)} ${currency}`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${amount.toFixed(2)} ${currency}`;
  }
};
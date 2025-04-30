/**
 * Format a number as currency with the specified locale and currency
 *
 * @param {number} amount - The amount to format
 * @param {string} locale - The locale to use for formatting (default: 'fr-FR')
 * @param {string} currency - The currency code (default: 'EUR')
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0 €';

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date to a human-readable string
 *
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale to use for formatting (default: 'fr-FR')
 * @returns {string} - The formatted date string
 */
export const formatDate = (date, locale = 'fr-FR') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a number with commas as thousands separators
 *
 * @param {number} number - The number to format
 * @param {string} locale - The locale to use for formatting (default: 'fr-FR')
 * @returns {string} - The formatted number
 */
export const formatNumber = (number, locale = 'fr-FR') => {
  if (number === undefined || number === null) return '0';

  return new Intl.NumberFormat(locale).format(number);
};
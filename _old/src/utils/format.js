/**
 * Format a number as currency with the specified locale and currency
 *
 * @param {number} amount - The amount to format
 * @param {string} locale - The locale to use for formatting (default: 'fr-FR')
 * @param {string} currency - The currency code (default: 'MAD')
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0 MAD';

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a number with commas as thousands separators
 *
 * @param {number} number - The number to format
 * @returns {string} - The formatted number
 */
export const formatNumber = (number) => {
  if (number === undefined || number === null) return '0';

  return new Intl.NumberFormat('fr-FR').format(number);
};
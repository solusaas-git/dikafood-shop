/**
 * Formats a date string into a readable format
 * Handles different date formats including "15 juin 2023" and ISO dates
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';

  try {
    // Try to parse different date formats
    const dateParts = dateString.split(' ');

    // Handle "15 juin 2023" format
    if (dateParts.length === 3 && !isNaN(parseInt(dateParts[0]))) {
      const day = parseInt(dateParts[0]);
      const month = dateParts[1];
      const year = dateParts[2];
      return `${day} ${month} ${year}`;
    }

    // Handle ISO format or other formats
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }

    // If all else fails, return the original string
    return dateString;
  } catch (e) {
    return dateString;
  }
};
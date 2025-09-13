/**
 * Validates a name field (first name or last name)
 * @param {string} value - The name value to validate
 * @returns {string} Error message if invalid, empty string if valid
 */
export const validateName = (value) => {
  if (!value || value.trim() === '') {
    return 'Veuillez remplir ce champ';
  }
  if (value.length < 2) {
    return 'Doit contenir au moins 2 caractères';
  }
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
    return 'Ne doit contenir que des lettres';
  }
  return '';
};

/**
 * Validates an email address
 * @param {string} value - The email value to validate
 * @returns {string} Error message if invalid, empty string if valid
 */
export const validateEmail = (value) => {
  if (!value || value.trim() === '') {
    return 'Veuillez remplir ce champ';
  }
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(value)) {
    return 'Format d\'email invalide';
  }
  return '';
};

/**
 * Validates a phone number
 * @param {string} value - The phone number value to validate
 * @returns {string} Error message if invalid, empty string if valid
 */
export const validatePhone = (value) => {
  if (!value || value.trim() === '') {
    return 'Veuillez remplir ce champ';
  }

  // Remove spaces and dashes for validation
  const cleanNumber = value.replace(/[\s-]/g, '');

  // Check for international format or local format
  // International: +212612345678
  // Local: 0612345678 or 06-12-34-56-78
  const phoneRegex = /^(?:\+[0-9]{1,3}[0-9]{9}|0[567][0-9]{8})$/;

  if (!phoneRegex.test(cleanNumber)) {
    return 'Format de numéro invalide';
  }
  return '';
};

/**
 * Formats a phone number as it's being typed
 * @param {string} value - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (value) => {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, '');

  // Handle international format
  if (cleaned.startsWith('+')) {
    // Format: +212 6 12 34 56 78
    return cleaned.replace(/(\+\d{3})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
  }

  // Handle local format
  // Format: 06 12 34 56 78
  return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
};

/**
 * Validates the entire form
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object containing isValid boolean and errors object
 */
export const validateForm = (formData) => {
  const errors = {};
  let hasErrors = false;

  // Validate each field
  Object.entries(formData).forEach(([field, value]) => {
    let error = '';
    switch (field) {
      case 'prenom':
      case 'surname':
      case 'nom':
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'telephone':
      case 'phone':
        error = validatePhone(value);
        break;
      default:
        break;
    }
    if (error) {
      errors[field] = error;
      hasErrors = true;
    }
  });

  return {
    isValid: !hasErrors,
    errors
  };
};
import React from 'react';
import Icon from './Icon';

/**
 * FormIcon component for form fields and inputs
 *
 * @param {string} field - Form field type (email, password, name, phone, etc.)
 * @param {string} state - Form field state (default, focus, error, success)
 * @param {string} position - Position of the icon (left, right)
 * @param {string} size - Size variant (sm, md, lg)
 * @param {string} className - Additional CSS classes
 */
export default function FormIcon({
  field,
  state = 'default',
  position = 'left',
  size = 'md',
  className,
  ...props
}) {
  // Map field types to appropriate icons
  const fieldIconMap = {
    // User information
    name: 'User',
    email: 'EnvelopeSimple',
    password: 'Lock',
    phone: 'Phone',
    company: 'Buildings',
    address: 'House',
    city: 'MapPin',
    country: 'Globe',

    // Form states
    search: 'MagnifyingGlass',
    calendar: 'Calendar',
    time: 'Clock',
    dropdown: 'CaretDown',
    checkbox: 'Check',
    radio: 'Circle',
    upload: 'UploadSimple',
    download: 'DownloadSimple',

    // Payment
    creditCard: 'CreditCard',
    bank: 'Bank',
    money: 'Money',

    // Message
    message: 'ChatText',
    comment: 'ChatCircleText',
  };

  // Map states to appropriate icons (for right side validation)
  const stateIconMap = {
    error: 'WarningCircle',
    success: 'CheckCircle',
    loading: 'CircleNotch',
    visible: 'Eye',
    hidden: 'EyeSlash',
  };

  // Determine which icon to use based on position and state
  let iconName;
  let iconColor = 'inherit';
  let iconWeight = 'regular';
  let animation = 'none';

  if (position === 'right' && state !== 'default') {
    // Right position usually shows validation state
    iconName = stateIconMap[state] || 'Info';

    if (state === 'error') {
      iconColor = 'error';
      iconWeight = 'fill';
    } else if (state === 'success') {
      iconColor = 'success';
      iconWeight = 'fill';
    } else if (state === 'loading') {
      animation = 'spin';
    }
  } else {
    // Left position usually shows field type
    iconName = fieldIconMap[field] || field;
  }

  return (
    <Icon
      name={iconName}
      size={size}
      color={iconColor}
      weight={iconWeight}
      animation={animation}
      className={className}
      {...props}
    />
  );
}
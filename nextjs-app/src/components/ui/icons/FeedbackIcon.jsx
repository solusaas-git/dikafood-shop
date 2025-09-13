import React from 'react';
import Icon from './Icon';

/**
 * FeedbackIcon component for notifications, alerts, and form validation
 *
 * @param {string} type - The type of feedback (success, error, warning, info)
 * @param {string} size - Size variant (xs, sm, md, lg, xl, 2xl)
 * @param {boolean} filled - Whether to use the filled version of the icon
 * @param {string} className - Additional CSS classes
 */
export default function FeedbackIcon({
  type = 'info',
  size = 'md',
  filled = true,
  className,
  ...props
}) {
  const iconMap = {
    success: 'CheckCircle',
    error: 'XCircle',
    warning: 'Warning',
    info: 'Info',
  };

  const iconName = iconMap[type] || iconMap.info;
  const weight = filled ? 'fill' : 'regular';

  return (
    <Icon
      name={iconName}
      color={type}
      size={size}
      weight={weight}
      className={className}
      {...props}
    />
  );
}
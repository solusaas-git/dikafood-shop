import React from 'react';
import { tv } from 'tailwind-variants';
import { FeedbackIcon, ActionIcon } from '../icons';

// Styles for alert components
const styles = {
  container: tv({
    base: 'flex items-start p-4 rounded-lg',
    variants: {
      variant: {
        success: 'bg-green-50 text-green-800 border border-green-200',
        error: 'bg-red-50 text-red-800 border border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
        info: 'bg-blue-50 text-blue-800 border border-blue-200',
        neutral: 'bg-neutral-50 text-neutral-800 border border-neutral-200',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'info',
      size: 'md',
    },
  }),

  icon: 'flex-shrink-0 mr-3 mt-0.5',

  content: 'flex-1',

  title: 'font-medium mb-1',

  message: 'opacity-90',

  closeButton: 'flex-shrink-0 ml-3 -mr-1 mt-0.5',
};

/**
 * Alert component for displaying feedback messages
 *
 * @param {string} variant - Visual variant (success, error, warning, info, neutral)
 * @param {string} size - Size variant (sm, md, lg)
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {boolean} showIcon - Whether to show the alert icon
 * @param {boolean} dismissible - Whether the alert can be dismissed
 * @param {function} onClose - Function to call when the alert is dismissed
 * @param {React.ReactNode} children - Custom alert content
 * @param {string} className - Additional CSS classes
 */
export default function Alert({
  variant = 'info',
  size = 'md',
  title,
  message,
  showIcon = true,
  dismissible = false,
  onClose,
  children,
  className,
  ...props
}) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={styles.container({ variant, size, className })}
      role="alert"
      {...props}
    >
      {showIcon && (
        <div className={styles.icon}>
          <FeedbackIcon
            type={variant}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
          />
        </div>
      )}

      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {message && <div className={styles.message}>{message}</div>}
        {children}
      </div>

      {dismissible && (
        <div className={styles.closeButton}>
          <ActionIcon
            name="close"
            variant="button"
            color="gray"
            size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
            onClick={handleClose}
            aria-label="Close alert"
          />
        </div>
      )}
    </div>
  );
}
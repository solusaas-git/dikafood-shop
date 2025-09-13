import React, { useState, useEffect } from 'react';
import { tv } from 'tailwind-variants';
import Icon from '../icons/Icon';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// Styles for toast components
const styles = {
  container: tv({
    base: 'fixed z-50 flex flex-col gap-3 p-4 w-full max-w-sm',
    variants: {
      position: {
        topRight: 'top-0 right-0',
        topLeft: 'top-0 left-0',
        bottomRight: 'bottom-0 right-0',
        bottomLeft: 'bottom-0 left-0',
        topCenter: 'top-0 left-1/2 -translate-x-1/2',
        bottomCenter: 'bottom-4 left-1/2 -translate-x-1/2',
      },
      isMobile: {
        true: 'max-w-[90%] p-3 gap-2 bottom-2',
        false: 'max-w-sm',
      }
    },
    defaultVariants: {
      position: 'bottomCenter',
      isMobile: false,
    },
  }),

  toast: tv({
    base: 'flex items-center p-4 rounded-full shadow-md border transition-all duration-300 mb-1',
    variants: {
      type: {
        success: 'border-feedback-success bg-white bg-gradient-to-r from-white via-white to-light-green-1/20',
        error: 'border-feedback-error bg-white/95 shadow-feedback-error/10',
        warning: 'border-feedback-warning bg-white bg-gradient-to-r from-white via-white to-light-yellow-1/20',
        info: 'border-logo-lime bg-white bg-gradient-to-r from-white via-white to-light-green-1/20',
      },
      animate: {
        enter: 'transform translate-y-0 opacity-100',
        exit: 'transform translate-y-full opacity-0',
      },
      isMobile: {
        true: 'p-3',
        false: 'p-4',
      }
    },
    defaultVariants: {
      type: 'info',
      animate: 'enter',
      isMobile: false,
    },
  }),

  title: 'font-medium text-sm font-heading',
  message: 'text-sm mt-0.5',
  content: 'flex-grow mr-3',
  mobileTitle: 'font-heading font-medium text-sm',
  iconMap: {
    success: { name: 'checkCircle', color: 'dark-green', weight: 'duotone' },
    error: { name: 'warning', color: 'error', weight: 'duotone' },
    warning: { name: 'warning', color: 'warning', weight: 'duotone' },
    info: { name: 'info', color: 'logo-lime', weight: 'duotone' },
  },
  textColorMap: {
    success: 'text-dark-green-7',
    error: 'text-feedback-error',
    warning: 'text-feedback-warning',
    info: 'text-dark-green-7',
  },
  iconBgMap: {
    success: 'bg-logo-lime/10 border-logo-lime/30',
    error: 'bg-feedback-error/10 border-feedback-error/30',
    warning: 'bg-feedback-warning/10 border-feedback-warning/30',
    info: 'bg-logo-lime/10 border-logo-lime/30',
  },
};

/**
 * Individual Toast component
 */
const Toast = ({ id, type = 'info', title, message, onClose, autoClose = 5000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const iconProps = styles.iconMap[type] || styles.iconMap.info;
  const textColor = styles.textColorMap[type] || styles.textColorMap.info;
  const iconBg = styles.iconBgMap[type] || styles.iconBgMap.info;
  const { isMobile } = useBreakpoint();

  // Handle auto close
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  // Handle close with animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  // If no title is provided, use the message as title for mobile
  const displayTitle = title || (isMobile ? message : '');

  // If message is not provided or is the same as title, don't show it separately
  const shouldDisplayMessage = !isMobile && message && title && message !== title;

  return (
    <div className={styles.toast({ type, animate: isExiting ? 'exit' : 'enter', isMobile })}>
      <div className={`flex-shrink-0 mr-3 ${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-full ${iconBg} flex items-center justify-center`}>
        <Icon
          name={iconProps.name}
          size={isMobile ? "sm" : "md"}
          color={iconProps.color}
          weight={iconProps.weight}
        />
      </div>

      <div className={styles.content}>
        <div className={`${isMobile ? styles.mobileTitle : styles.title} ${textColor}`}>{displayTitle}</div>
        {shouldDisplayMessage && <div className={`${styles.message} ${textColor}/90`}>{message}</div>}
      </div>

      <button
        onClick={handleClose}
        className={`flex-shrink-0 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full flex items-center justify-center hover:bg-gray-200/40 transition-colors`}
        aria-label="Close"
      >
        <Icon name="x" size={isMobile ? "xs" : "sm"} color={type === 'error' ? 'error' : (type === 'warning' ? 'warning' : 'dark-green')} />
      </button>
    </div>
  );
};

/**
 * Toast Container component
 */
const ToastContainer = ({ toasts = [], position = 'bottomCenter', onClose }) => {
  const { isMobile } = useBreakpoint();

  return (
    <div className={styles.container({ position, isMobile })}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={onClose}
          autoClose={toast.timeout}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { tv } from 'tailwind-variants';
import { ActionIcon } from '../icons';

// Styles for modal components
const styles = {
  overlay: tv({
    base: 'fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4',
    variants: {
      isOpen: {
        true: 'animate-fadeIn',
        false: 'animate-fadeOut pointer-events-none opacity-0',
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }),

  modal: tv({
    base: 'bg-white rounded-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col w-full relative',
    variants: {
      size: {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        full: 'max-w-full',
      },
      isOpen: {
        true: 'animate-slideUp',
        false: 'animate-slideDown opacity-0 translate-y-4',
      },
    },
    defaultVariants: {
      size: 'md',
      isOpen: false,
    },
  }),

  header: tv({
    base: 'flex items-center justify-between p-5 border-b border-neutral-200 bg-gradient-to-r from-light-yellow-1/50 via-light-lime-1/20 to-light-yellow-1/30',
    variants: {
      withCloseButton: {
        true: '',
        false: 'justify-center',
      },
    },
    defaultVariants: {
      withCloseButton: true,
    },
  }),

  title: 'text-lg font-normal text-dark-green-7 flex items-center',
  body: 'overflow-y-auto',
  footer: 'p-5 border-t border-neutral-200 flex justify-center gap-3',
};

/**
 * Modal component for dialogs, forms, and other modal content
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to call when the modal is closed
 * @param {string} title - Modal title
 * @param {string} size - Modal size (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, full)
 * @param {boolean} closeOnOverlayClick - Whether to close the modal when the overlay is clicked
 * @param {boolean} showCloseButton - Whether to show the close button
 * @param {React.ReactNode} children - Modal content
 * @param {React.ReactNode} footer - Modal footer content
 * @param {string} className - Additional CSS classes
 * @param {string} overlayClassName - Additional CSS classes for the overlay
 * @param {string} maxWidth - Maximum width for the modal
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  size,
  closeOnOverlayClick = true,
  showCloseButton = true,
  children,
  footer,
  className,
  overlayClassName = '',
  maxWidth, // Extract maxWidth to prevent it from being passed to DOM
  ...props
}) {
  const modalRef = useRef(null);

  // Close on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [isOpen, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Only render the portal if modal is open
  if (!isOpen) return null;

  // Portal to render modal at the end of the document body
  return createPortal(
    <div
      className={`${styles.overlay({ isOpen })} ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        className={styles.modal({ size, isOpen, className })}
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        style={maxWidth ? { maxWidth } : undefined}
        {...props}
      >
        {/* Modal header */}
        {title && (
          <div className={styles.header({ withCloseButton: showCloseButton })}>
            <h2 className={styles.title}>{title}</h2>
            {showCloseButton && (
              <ActionIcon
                name="x"
                variant="button"
                color="primary"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-full hover:bg-dark-green-1/20 transition-colors w-8 h-8 flex items-center justify-center"
              />
            )}
          </div>
        )}

        {/* Modal body */}
        <div className={styles.body}>
          {children}
        </div>

        {/* Modal footer */}
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
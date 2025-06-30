import { useEffect, useCallback } from 'react';

/**
 * Custom hook for modal functionality including closing on escape key and outside clicks
 *
 * @param {Object} options - Options for the modal
 * @param {boolean} options.isOpen - Whether the modal is open
 * @param {Function} options.onClose - Function to close the modal
 * @param {boolean} options.closeOnEscKey - Whether to close the modal on escape key (default: true)
 * @param {boolean} options.closeOnOutsideClick - Whether to close the modal on outside click (default: true)
 * @returns {Object} - Object containing functions for closing the modal
 */
export function useModal({
  isOpen,
  onClose,
  closeOnEscKey = true,
  closeOnOutsideClick = true
}) {
  // Handle pressing the Escape key
  const handleEscKey = useCallback((event) => {
    if (isOpen && event.key === 'Escape' && closeOnEscKey) {
      onClose();
    }
  }, [isOpen, onClose, closeOnEscKey]);

  // Add and remove event listeners for ESC key
  useEffect(() => {
    if (closeOnEscKey) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [handleEscKey, closeOnEscKey]);

  // Handle clicking outside the modal content
  const closeOnOutsideClick = useCallback((e) => {
    if (closeOnOutsideClick) {
      onClose();
    }
  }, [onClose, closeOnOutsideClick]);

  // When modal is open, prevent scrolling on the body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Calculate and account for scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen]);

  return {
    closeOnEsc: handleEscKey,
    closeOnOutsideClick
  };
}

export default useModal;
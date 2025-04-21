import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X } from '@phosphor-icons/react';
import './modal.scss';

const Modal = ({ isOpen, onClose, title, children, sidebar = null }) => {
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current &&
          modalContentRef.current &&
          !modalContentRef.current.contains(e.target) &&
          isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Using ReactDOM.createPortal to mount the modal directly to the body
  return ReactDOM.createPortal(
    <div className="modal-overlay" ref={modalRef} data-testid="modal-overlay">
      <div className="modal-container" ref={modalContentRef} data-testid="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            <X size={20} weight="bold" />
          </button>
        </div>

        {sidebar ? (
          <div className="modal-with-sidebar">
            {sidebar}
            <div className="modal-content-with-sidebar">
              {children}
            </div>
          </div>
        ) : (
          <div className="modal-content">
            {children}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
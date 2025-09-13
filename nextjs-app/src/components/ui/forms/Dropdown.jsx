import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';

/**
 * Dropdown component using a portal
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.trigger - The element that triggers the dropdown
 * @param {React.ReactNode} props.children - The content of the dropdown
 * @param {boolean} props.isOpen - Controlled state for dropdown visibility
 * @param {Function} props.onToggle - Function to toggle the dropdown state
 */
const Dropdown = ({ trigger, children, isOpen, onToggle }) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const dropdownRef = useRef(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        referenceElement && 
        !referenceElement.contains(event.target)
      ) {
        if (isOpen) {
          onToggle(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle, referenceElement]);

  const clonedTrigger = React.cloneElement(trigger, {
    ref: setReferenceElement,
    onClick: (e) => {
      e.preventDefault();
      onToggle(!isOpen);
      if (trigger.props.onClick) {
        trigger.props.onClick(e);
      }
    }
  });

  if (typeof document === 'undefined') {
    return null;
  }
  
  return (
    <>
      {clonedTrigger}
      {isOpen && ReactDOM.createPortal(
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="z-[100]" // High z-index to ensure it's on top
        >
          <div ref={dropdownRef}>
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Dropdown; 
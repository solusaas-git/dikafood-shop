import React, { useState } from 'react';
import Icon from '@/components/ui/icons/Icon';

/**
 * CollapsibleSection Component
 * Creates collapsible subsections for long forms with muted titles and subtle separators
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 * @param {boolean} props.defaultOpen - Whether section is open by default
 * @param {boolean} props.isCompleted - Whether section is completed (shows check icon)
 * @param {Function} props.onToggle - Toggle handler function
 * @param {boolean} props.disabled - Whether section is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.isOpen - External control for open state
 * @param {Function} props.onToggle - External toggle handler
 */
const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
  isCompleted = false,
  onToggle,
  disabled = false,
  className = '',
  isOpen: externalIsOpen,
  onToggle: externalOnToggle
}) => {
  // Use external state if provided, otherwise use internal state
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    
    if (externalOnToggle) {
      // Use external toggle handler if provided
      externalOnToggle(newIsOpen);
    } else {
      // Use internal state if no external control
      setInternalIsOpen(newIsOpen);
      if (onToggle) {
        onToggle(newIsOpen);
      }
    }
  };

  return (
    <div className={`border border-logo-lime/30 rounded-lg overflow-hidden ${className}`}>
      {/* Section Header with light yellow gradient overlay */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors bg-gradient-to-r from-light-yellow-1/20 to-light-yellow-2/10 ${
          disabled 
            ? 'cursor-not-allowed' 
            : 'hover:from-light-yellow-1/30 hover:to-light-yellow-2/20 cursor-pointer'
        }`}
        disabled={disabled}
      >
        <div className="flex items-center gap-3">
          {/* Section title */}
          <h3 className={`text-sm font-medium transition-colors ${
            disabled 
              ? 'text-gray-400' 
              : 'text-dark-green-7/60'
          }`}>
            {title}
          </h3>
        </div>

        {/* Collapse indicator */}
        <div className={`flex items-center gap-2 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}>
          <Icon name="caretDown" size="sm" />
        </div>
      </button>

      {/* Subtle separator line */}
      <div className={`h-px bg-gradient-to-r from-transparent via-logo-lime/30 to-transparent transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-50'
      }`} />

      {/* Section Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4 pt-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection; 
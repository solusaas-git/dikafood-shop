import React from 'react';
import Icon from '../icons/Icon';

/**
 * Checkbox component with styled appearance
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Checkbox ID
 * @param {string} props.name - Checkbox name
 * @param {boolean} props.checked - Whether checkbox is checked
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Checkbox label
 * @param {boolean} props.required - Whether checkbox is required
 * @param {string} props.className - Additional CSS classes
 */
const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  label,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          className="sr-only"
          {...props}
        />

        <div className={`w-5 h-5 border ${checked ? 'border-logo-lime bg-white' : 'border-logo-lime/50 bg-white'} rounded transition-colors flex items-center justify-center`}>
          {checked && (
            <Icon name="check" weight="bold" size="xs" color="lime" />
          )}
        </div>
      </div>

      {label && (
        <span className="text-sm text-dark-green-7">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
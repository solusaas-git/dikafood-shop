import React, { useState } from 'react';
import Icon from '../icons/Icon';

/**
 * Styled text field component with lime green border styling
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.type - Input type (text, email, password)
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.className - Additional CSS classes
 */
const StyledTextField = ({
  id,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Determine the input type for password fields
  const inputType = type === 'password' ? (passwordVisible ? 'text' : 'password') : type;

  // Get the appropriate icon based on field type
  const getIcon = () => {
    if (type === 'email') {
      return <Icon name="envelope" weight="duotone" color="lime" size="md" />;
    } else if (type === 'password') {
      return <Icon name="lock" weight="duotone" color="lime" size="md" />;
    }
    return null;
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center relative rounded-full border border-logo-lime/70 bg-white overflow-hidden focus-within:border-logo-lime focus-within:ring-1 focus-within:ring-logo-lime">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-logo-lime">
          {getIcon()}
        </div>

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full py-3 px-4 pl-12 text-dark-green-7 focus:outline-none bg-transparent placeholder:text-dark-green-6/70"
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-logo-lime hover:text-dark-green-7 transition-colors focus:outline-none"
          >
            {passwordVisible ?
              <Icon name="eyeSlash" weight="duotone" color="lime" size="md" /> :
              <Icon name="eye" weight="duotone" color="lime" size="md" />
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default StyledTextField;
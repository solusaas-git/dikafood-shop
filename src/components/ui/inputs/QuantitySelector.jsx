import React from 'react';
import { Icon } from '@components/ui';

/**
 * QuantitySelector component for selecting quantity values
 * @param {Object} props - Component props
 * @param {number} props.value - Current quantity value
 * @param {function} props.onChange - Function called when quantity changes
 * @param {number} props.min - Minimum allowed value (default: 1)
 * @param {number} props.max - Maximum allowed value (default: 99)
 * @param {string} props.className - Additional class names
 */
const QuantitySelector = ({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  className = ""
}) => {
  const handleChange = (newValue) => {
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) handleChange(val);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        className="w-8 h-8 flex items-center justify-center border border-logo-lime/30 rounded-l-full bg-logo-lime/10 hover:bg-logo-lime/20"
        onClick={() => handleChange(value - 1)}
        disabled={value <= min}
      >
        <Icon
          name="minus"
          size="sm"
          className={value <= min ? "text-logo-lime/30" : "text-dark-green-6"}
        />
      </button>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="w-12 h-8 border-y border-logo-lime/30 text-center focus:outline-none bg-logo-lime/5"
      />
      <button
        className="w-8 h-8 flex items-center justify-center border border-logo-lime/30 rounded-r-full bg-logo-lime/10 hover:bg-logo-lime/20"
        onClick={() => handleChange(value + 1)}
        disabled={value >= max}
      >
        <Icon
          name="plus"
          size="sm"
          className={value >= max ? "text-logo-lime/30" : "text-dark-green-6"}
        />
      </button>
    </div>
  );
};

export default QuantitySelector;
import React from 'react';
import './field.scss';

const Field = ({
    inputName,
    Icon,
    placeholder,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    required
}) => {
    const fieldId = `field-${inputName}`;
    const errorId = `${fieldId}-error`;
    const hasError = Boolean(error);

    return (
        <div className={`field ${hasError ? 'has-error' : ''}`}>
            <div className="field-icon">
                {Icon}
            </div>
            <input
                id={fieldId}
                name={inputName}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                aria-invalid={hasError}
                aria-describedby={hasError ? errorId : undefined}
                aria-required={required}
            />
            {hasError && (
                <div 
                    className="error-message" 
                    id={errorId}
                    role="alert"
                >
                    {error}
                </div>
            )}
        </div>
    );
};

Field.displayName = 'Field';

export default Field;

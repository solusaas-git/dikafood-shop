import React from 'react';
import './message-field.scss';

const MessageField = ({
    inputName,
    icon: Icon,
    placeholder,
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
        <div className={`message-field ${hasError ? 'has-error' : ''}`}>
            <div className="field-icon">
                {Icon}
            </div>
            <textarea
                id={fieldId}
                name={inputName}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                aria-invalid={hasError}
                aria-describedby={hasError ? errorId : undefined}
                aria-required={required}
                rows={4}
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

MessageField.displayName = 'MessageField';

export default MessageField;

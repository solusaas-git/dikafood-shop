import React from 'react';
import "./message-field.scss"

export default function MessageField({ icon: Icon, inputName, placeholder }) {
    return (
        <div className="message-field">
            <div className="textarea-wrapper">
                <span className="field-icon">
                    {Icon}
                </span>
                <textarea 
                    name={inputName} 
                    placeholder={placeholder} 
                    required 
                    aria-label={placeholder}
                />
            </div>
        </div>
    )
}

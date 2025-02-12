import React from 'react';
import "./message-field.scss"

export default function MessageField({ icon: Icon, inputName, placeholder }) {
    return (
        <div className="message-field">
            <div>
                {Icon}
                <textarea 
                    name={inputName} 
                    placeholder={placeholder} 
                    required 
                    aria-label={placeholder}
                />
            </div>
            <button type="submit">
                {Icon}
                Envoyer
            </button>
        </div>
    )
}

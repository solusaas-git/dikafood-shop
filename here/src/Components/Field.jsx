import { memo } from 'react';
import "./field.scss"

const Field = memo(({ Icon, inputName, placeholder }) => {
    // Enhanced autocomplete mapping
    const getAutocomplete = (name) => {
        const mappings = {
            'prenom': 'given-name',
            'nom': 'family-name',
            'email': 'email',
            'telephone': 'tel'
        };
        return mappings[name] || 'off';
    };

    // Get input type based on name
    const getInputType = (name) => {
        const types = {
            'email': 'email',
            'telephone': 'tel'
        };
        return types[name] || 'text';
    };

    return (
        <div className="field">
            {Icon && <span className="field-icon">{Icon}</span>}
            <input 
                type={getInputType(inputName)}
                id={`field-${inputName}`}
                name={inputName} 
                placeholder={placeholder} 
                autoComplete={getAutocomplete(inputName)}
                required 
                aria-label={placeholder}
            />
            <div className="field-line" aria-hidden="true" />
        </div>
    );
});

Field.displayName = 'Field';

export default Field;

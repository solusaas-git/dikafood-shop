import "./field.scss"

export default function Field({ Icon, inputName, placeholder }) {
    // Map input names to correct autocomplete values
    const getAutocomplete = (name) => {
        switch (name) {
            case 'prenom':
                return 'given-name';
            case 'nom':
                return 'family-name';
            case 'email':
                return 'email';
            case 'telephone':
                return 'tel';
            default:
                return 'off';
        }
    };

    return (
        <div className="field">
            {Icon}
            <input 
                type="text" 
                id={`field-${inputName}`}
                name={inputName} 
                placeholder={placeholder} 
                autoComplete={getAutocomplete(inputName)}
                required 
            />
        </div>
    )
}

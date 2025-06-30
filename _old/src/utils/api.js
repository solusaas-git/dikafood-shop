import { validateForm } from './validation';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1025';

const validateFileUrl = (url) => {
    try {
        // Debug the incoming URL
        console.log('Validating URL:', url);
        
        // Handle both absolute and relative URLs
        const fullUrl = url.startsWith('http') 
            ? new URL(url)
            : new URL(url, API_URL);
            
        console.log('Parsed URL:', fullUrl.toString());
        console.log('Search params:', Object.fromEntries(fullUrl.searchParams));
        
        const params = fullUrl.searchParams;
        const isValid = params.has('type') && params.has('filename');
        
        console.log('URL validation result:', isValid);
        return isValid;
    } catch (error) {
        console.error('URL validation error:', error);
        return false;
    }
};

const handleApiError = (error, response) => {
    if (response?.status === 400) {
        // Handle validation errors
        return error.details?.[0]?.message || 'Requête invalide';
    }
    if (response?.status === 404) {
        return 'Fichier non trouvé';
    }
    return error.message || 'Une erreur est survenue';
};

/**
 * Submits form data to the appropriate endpoint based on useCase
 * @param {Object} formData - Form data (name, email, phone, message)
 * @param {'catalog'|'contact'} useCase - Form submission type
 * @param {'fr'|'ar'} lang - Language code
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
export const submitFormData = async (formData, useCase, lang = 'fr') => {
    try {
        // Validate form data
        const { isValid, errors } = validateForm(formData);
        
        if (!isValid) {
            throw new Error('Form validation failed');
        }

        if (useCase === 'catalog') {
            // For catalog (GET request), append data to URL
            const params = new URLSearchParams({
                ...formData,
                useCase,
                lang
            });
            
            const response = await fetch(`${API_URL}/catalog?${params}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(handleApiError(error, response));
            }

            const data = await response.json();
            console.log('Catalog response:', data); // Debug response

            if (!data.success) {
                throw new Error(data.error || 'Failed to get catalog');
            }

            // Validate returned URLs
            const urls = data.data.urls;
            console.log('Received URLs:', urls); // Debug URLs

            if (!urls || !urls[lang]) {
                throw new Error('URLs non disponibles');
            }

            // Validate each URL
            if (!validateFileUrl(urls[lang])) {
                console.error('Invalid URL structure:', urls[lang]);
                throw new Error('URL de téléchargement invalide');
            }

            return {
                success: true,
                data: {
                    urls: data.data.urls,
                    expiresIn: data.data.expiresIn
                }
            };
        } else {
            // For contact (POST request), use body
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    useCase
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            return {
                success: true,
                data: await response.json()
            };
        }
    } catch (error) {
        console.error('Form submission error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}; 
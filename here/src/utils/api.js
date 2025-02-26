import { validateForm } from './validation';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1025';

/**
 * Submits form data to the appropriate endpoint based on useCase
 * @param {Object} formData - Form data (name, email, phone, message)
 * @param {'catalog'|'contact'} useCase - Form submission type
 * @param {'fr'|'ar'} lang - Language code
 * @returns {Promise<{ success: boolean, data?: Blob, error?: string }>}
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
                throw new Error('Failed to submit form');
            }

            const data = await response.json();
            console.log("data", data);
            if (!data.success) {
                throw new Error(data.error || 'Failed to get catalog');
            }

            // Return both catalog URLs
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
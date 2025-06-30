import { apiRequest } from './api';

class ContactError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

export const contactService = {
    // Submit contact form
    submitContact: async (contactData) => {
        try {
            // Validate required fields
            if (!contactData) {
                throw new ContactError(
                    'Données du formulaire manquantes',
                    'INVALID_DATA'
                );
            }

            // Check for required fields
            const requiredFields = ['name', 'email', 'message'];
            for (const field of requiredFields) {
                if (!contactData[field] || contactData[field].trim() === '') {
                    throw new ContactError(
                        `Le champ ${field} est requis`,
                        'MISSING_REQUIRED_FIELD'
                    );
                }
            }

            // Make API request with proper timeout handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            try {
                const response = await apiRequest('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...contactData,
                        useCase: 'contact'
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // Validate response structure
                if (!response.success) {
                    throw new ContactError(
                        response.error || 'La soumission du formulaire a échoué',
                        'SUBMISSION_FAILED'
                    );
                }

                // Track successful form submission
                try {
                    await apiRequest('/analytics/track', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            event: 'contact_form_submit',
                            email: contactData.email
                        })
                    });
                } catch (analyticsError) {
                    // Don't block the form submission if analytics fails
                    console.warn('Failed to track contact form submission:', analyticsError);
                }

                return response;
            } catch (fetchError) {
                clearTimeout(timeoutId);

                if (fetchError.name === 'AbortError') {
                    throw new ContactError(
                        'La demande a expiré. Veuillez réessayer.',
                        'REQUEST_TIMEOUT'
                    );
                }
                throw fetchError;
            }
        } catch (error) {
            console.error('Contact submission error:', error);

            // Categorize errors to provide better feedback
            if (error instanceof ContactError) {
                throw error;
            } else if (error.status === 429) {
                throw new ContactError(
                    'Trop de demandes. Veuillez réessayer plus tard.',
                    'RATE_LIMITED'
                );
            } else if (error.status >= 500) {
                throw new ContactError(
                    'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
                    'SERVER_ERROR'
                );
            } else {
                throw new ContactError(
                    'Une erreur est survenue lors de l\'envoi du message',
                    'SUBMISSION_FAILED'
                );
            }
        }
    }
};
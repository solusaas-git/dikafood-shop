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
            if (!contactData) {
                throw new ContactError(
                    'Données du formulaire manquantes',
                    'INVALID_DATA'
                );
            }

            const response = await apiRequest('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...contactData,
                    useCase: 'contact'
                })
            });

            return response;
        } catch (error) {
            console.error('Contact submission error:', error);
            throw error instanceof ContactError ? error : new ContactError(
                'Une erreur est survenue lors de l\'envoi du message',
                'SUBMISSION_FAILED'
            );
        }
    }
}; 
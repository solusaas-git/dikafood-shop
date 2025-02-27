import { apiRequest } from './api';
import config from '../config';

class DownloadError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

export const catalogService = {
    // 4. Initial Catalog Request
    requestCatalog: async (userData) => {
        const queryParams = new URLSearchParams({
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            phone: userData.phone,
            useCase: 'catalog'
        }).toString();

        return apiRequest(`/catalog?${queryParams}`, {
            method: 'GET'
        });
    },

    // 5. Download Handler
    downloadCatalog: async (language, secureUrl) => {
        try {
            if (!secureUrl) {
                throw new DownloadError(
                    'URL de téléchargement non disponible',
                    'MISSING_URL'
                );
            }

            // Validate URL format
            if (!catalogService.validateCatalogUrl(secureUrl)) {
                throw new DownloadError(
                    'URL de téléchargement invalide',
                    'INVALID_URL'
                );
            }

            // Open download in new tab
            window.open(secureUrl, '_blank');
            return { success: true };
        } catch (error) {
            throw error instanceof DownloadError ? error : new DownloadError(
                'Une erreur est survenue lors du téléchargement.',
                'UNKNOWN_ERROR'
            );
        }
    },

    // Helper method to validate catalog URL
    validateCatalogUrl: (url) => {
        try {
            const urlObj = new URL(url);
            const requiredParams = ['type', 'filename', 'token', 'email', 'timestamp'];
            
            for (const param of requiredParams) {
                if (!urlObj.searchParams.has(param)) {
                    return false;
                }
            }
            
            return urlObj.searchParams.get('type') === 'catalog' &&
                   urlObj.searchParams.get('filename').endsWith('.pdf');
        } catch {
            return false;
        }
    }
}; 
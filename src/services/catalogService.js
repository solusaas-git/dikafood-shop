import { apiRequest } from './api';
import config from '../config';

class DownloadError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

export const catalogService = {
    // Request Catalog - Sends user data and gets secure download URLs
    requestCatalog: async (userData) => {
        try {
            if (!userData || !userData.email) {
                throw new DownloadError(
                    'Informations utilisateur incomplètes',
                    'INCOMPLETE_USER_DATA'
                );
            }

            // Build query parameters for the request
            const queryParams = new URLSearchParams({
                name: userData.name || '',
                surname: userData.surname || '',
                email: userData.email, // Required
                phone: userData.phone || '',
                useCase: 'catalog'
            }).toString();

            // Make API request with proper error handling
            const response = await apiRequest(`/catalog?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            // Validate response structure
            if (!response?.data?.urls || !response.data.urls.fr) {
                throw new DownloadError(
                    'Format de réponse invalide du serveur',
                    'INVALID_RESPONSE'
                );
            }

            return response;
        } catch (error) {
            console.error('Catalog request error:', error);

            // Categorize errors to provide better feedback
            if (error instanceof DownloadError) {
                throw error;
            } else if (error.status === 429) {
                throw new DownloadError(
                    'Trop de demandes. Veuillez réessayer plus tard.',
                    'RATE_LIMITED'
                );
            } else if (error.status >= 500) {
                throw new DownloadError(
                    'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
                    'SERVER_ERROR'
                );
            } else {
                throw new DownloadError(
                    'Une erreur est survenue lors de la demande de catalogue',
                    'REQUEST_FAILED'
                );
            }
        }
    },

    // Download Handler - Processes the actual download
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

            // Track download attempt
            try {
                await apiRequest('/analytics/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        event: 'catalog_download',
                        language: language
                    })
                });
            } catch (analyticsError) {
                // Don't block the download if analytics tracking fails
                console.warn('Failed to track download:', analyticsError);
            }

            // Open download in new tab
            window.open(secureUrl, '_blank');
            return { success: true };
        } catch (error) {
            console.error('Catalog download error:', error);
            throw error instanceof DownloadError ? error : new DownloadError(
                'Une erreur est survenue lors du téléchargement.',
                'DOWNLOAD_FAILED'
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

            // Validate domain to ensure URL is from our own backend
            const validDomains = [
                'api.dikafood.com',
                'localhost:1025'
            ];

            const isDomainValid = validDomains.some(domain =>
                urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
            );

            return isDomainValid &&
                   urlObj.searchParams.get('type') === 'catalog' &&
                   urlObj.searchParams.get('filename').endsWith('.pdf');
        } catch {
            return false;
        }
    }
};
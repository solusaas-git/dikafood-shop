import axios from 'axios';

const DOWNLOAD_ENDPOINT = '/api/download-catalog';

class DownloadError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

// Simple in-memory rate limiting (should be replaced with Redis or similar in production)
const rateLimiter = {
    attempts: new Map(),
    maxAttempts: 5,
    timeWindow: 3600000, // 1 hour in milliseconds

    canDownload(email) {
        const now = Date.now();
        const userAttempts = this.attempts.get(email) || [];
        
        // Clean up old attempts
        const recentAttempts = userAttempts.filter(
            timestamp => now - timestamp < this.timeWindow
        );
        
        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }
        
        recentAttempts.push(now);
        this.attempts.set(email, recentAttempts);
        return true;
    }
};

export const downloadCatalog = async (userData, language) => {
    try {
        // Check rate limit
        if (!rateLimiter.canDownload(userData.email)) {
            throw new DownloadError(
                'Trop de tentatives de téléchargement. Veuillez réessayer plus tard.',
                'RATE_LIMIT_EXCEEDED'
            );
        }

        // Get secure download URL from backend
        const response = await axios.post(DOWNLOAD_ENDPOINT, {
            userData,
            language
        }, {
            baseURL: window.location.origin
        });

        if (!response.data?.downloadUrl) {
            throw new DownloadError(
                'Erreur lors de la génération du lien de téléchargement.',
                'INVALID_RESPONSE'
            );
        }

        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `catalog-${language}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
    } catch (error) {
        if (error instanceof DownloadError) {
            throw error;
        }

        // Log error for monitoring but show generic message to user
        console.error('Download error:', error);
        throw new DownloadError(
            'Une erreur est survenue lors du téléchargement. Veuillez réessayer.',
            'UNKNOWN_ERROR'
        );
    }
}; 
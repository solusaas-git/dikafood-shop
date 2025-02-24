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

/**
 * Handles the catalog download process
 * @param {string} url - The secure URL for the catalog
 * @param {string} language - Language code for filename
 * @returns {Promise<boolean>}
 */
export const handleCatalogDownload = async (url, language = 'fr') => {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new DownloadError(
                'Erreur lors du téléchargement. Veuillez réessayer.',
                'DOWNLOAD_FAILED'
            );
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `dikafood-catalog-${language}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        return true;
    } catch (error) {
        console.error('Download error:', error);
        throw new DownloadError(
            'Une erreur est survenue lors du téléchargement. Veuillez réessayer.',
            'UNKNOWN_ERROR'
        );
    }
}; 
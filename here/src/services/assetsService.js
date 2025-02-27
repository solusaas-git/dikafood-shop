import { apiRequest } from './api';
import config from '../config';

export const assetsService = {
    // Get asset URL with proper query parameters
    getAssetUrl: (type, filename, options = {}) => {
        const queryParams = new URLSearchParams({
            type,
            filename,
            ...options
        }).toString();
        
        return `${config.API_URL}/files/download?${queryParams}`;
    },

    // Get brand logo URL
    getBrandLogoUrl: (brandName) => {
        return assetsService.getAssetUrl('brand-logo', `${brandName}-logo.svg`);
    },

    // Get optimized image URL with size
    getOptimizedImageUrl: (imageId, size = 'medium') => {
        return assetsService.getAssetUrl('optimized-image', `${imageId}-${size}.webp`);
    },

    // Upload an image (for admin use)
    uploadImage: async (file, type = 'blog-image') => {
        const formData = new FormData();
        formData.append('image', file);

        return apiRequest(`/files/upload/${type}`, {
            method: 'POST',
            headers: {
                // Don't set Content-Type, let browser set it with boundary
            },
            body: formData
        });
    }
}; 
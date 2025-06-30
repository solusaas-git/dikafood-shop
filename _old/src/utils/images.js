import { API_URL } from './api';

export const getImagePlaceholder = (size = 'medium') => {
    // Define dimensions for each size
    const dimensions = {
        thumbnail: '400x300',
        medium: '800x600',
        large: '1200x900'
    };

    // Use placehold.co service with olive oil-themed colors
    // Using a warm olive green background (#8B8B3D) with light text (#F5F5DC)
    return `https://placehold.co/${dimensions[size]}/8B8B3D/F5F5DC.jpg?text=Huile+d'Olive`;
}; 
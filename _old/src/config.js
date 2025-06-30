const ENV = import.meta.env.MODE; // 'development' or 'production'

const config = {
    API_URL: ENV === 'production' 
        ? 'https://api.dikafood.com'
        : 'http://localhost:1025',
    
    ASSETS: {
        SIZES: {
            small: '300w',
            medium: '600w',
            large: '1200w'
        }
    }
};

export default config; 
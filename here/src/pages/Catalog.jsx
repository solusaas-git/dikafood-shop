import React, { useState } from 'react';

const [downloadUrls, setDownloadUrls] = useState(null);

const handleFormSubmit = async (formData) => {
    const result = await submitFormData(formData, 'catalog');
    if (result.success) {
        setShowModal(true);
        setDownloadUrls(result.data.urls);
    } else {
        // Handle error
        console.error('Failed to get catalog URLs:', result.error);
    }
};

// When rendering the modal
<CatalogDownloadModal 
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    userData={formData}
    onDownload={async (language) => {
        if (!downloadUrls) {
            return {
                success: false,
                error: 'URLs de téléchargement non disponibles'
            };
        }
        return {
            success: true,
            data: {
                urls: downloadUrls
            }
        };
    }}
/> 
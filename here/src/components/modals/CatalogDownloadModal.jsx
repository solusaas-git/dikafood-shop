import React, { useState, useEffect } from 'react';
import { X, Globe, Warning, CheckCircle } from "@phosphor-icons/react";
import { API_URL } from '../../utils/api';
import './catalog-download-modal.scss';

export default function CatalogDownloadModal({ isOpen, onClose, userData, onDownload }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [downloadStates, setDownloadStates] = useState({
        fr: { isLoading: false, isSuccess: false },
        ar: { isLoading: false, isSuccess: false }
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDownload = async (language) => {
        try {
            setDownloadStates(prev => ({
                ...prev,
                [language]: { ...prev[language], isLoading: true }
            }));
            setError('');
            
            // Call onDownload and handle potential undefined return
            const result = await onDownload?.(language);
            
            if (!result || !result.success) {
                throw new Error(result?.error || 'Erreur lors de la récupération du catalogue');
            }

            const urls = result.data?.urls;
            
            if (!urls || !urls[language]) {
                throw new Error('URL de téléchargement non disponible');
            }

            // Handle both absolute and relative URLs
            const downloadUrl = urls[language].startsWith('http') 
                ? urls[language]
                : `${API_URL}${urls[language]}`;

            console.log('Attempting download with URL:', downloadUrl);

            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `dikafood-catalog-${language}.pdf`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setDownloadStates(prev => ({
                ...prev,
                [language]: { isLoading: false, isSuccess: true }
            }));

            setTimeout(() => {
                setDownloadStates(prev => ({
                    ...prev,
                    [language]: { ...prev[language], isSuccess: false }
                }));
            }, 3000);

        } catch (error) {
            console.error('Download error:', error);
            setError(error.message || 'Erreur lors du téléchargement');
            setDownloadStates(prev => ({
                ...prev,
                [language]: { isLoading: false, isSuccess: false }
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className={`catalog-download-modal ${isMobile ? 'mobile' : ''}`}>
                <button className="close-button" onClick={onClose}>
                    <X size={24} weight="bold" />
                </button>

                <div className="modal-content">
                    <h3>Merci pour votre intérêt !</h3>
                    <p>Choisissez la version du catalogue que vous souhaitez télécharger</p>

                    {error && (
                        <div className="error-message">
                            <Warning size={16} weight="fill" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="download-options">
                        <button 
                            className={`download-button ${downloadStates.fr.isLoading ? 'loading' : ''} ${downloadStates.fr.isSuccess ? 'success' : ''}`}
                            onClick={() => handleDownload('fr')}
                            disabled={downloadStates.fr.isLoading}
                        >
                            {downloadStates.fr.isSuccess ? (
                                <CheckCircle size={24} weight="fill" />
                            ) : (
                                <Globe size={24} weight="duotone" />
                            )}
                            <span>
                                {downloadStates.fr.isLoading 
                                    ? 'Téléchargement...' 
                                    : downloadStates.fr.isSuccess 
                                        ? 'Téléchargé !' 
                                        : 'Version Française'}
                            </span>
                        </button>

                        <button 
                            className={`download-button ${downloadStates.ar.isLoading ? 'loading' : ''} ${downloadStates.ar.isSuccess ? 'success' : ''}`}
                            onClick={() => handleDownload('ar')}
                            disabled={downloadStates.ar.isLoading}
                        >
                            {downloadStates.ar.isSuccess ? (
                                <CheckCircle size={24} weight="fill" />
                            ) : (
                                <Globe size={24} weight="duotone" />
                            )}
                            <span>
                                {downloadStates.ar.isLoading 
                                    ? 'Téléchargement...' 
                                    : downloadStates.ar.isSuccess 
                                        ? 'تم التحميل !' 
                                        : 'النسخة العربية'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
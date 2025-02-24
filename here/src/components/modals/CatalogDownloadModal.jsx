import React, { useState, useEffect } from 'react';
import { X, Download, Globe, Warning, CheckCircle } from "@phosphor-icons/react";
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

    if (!isOpen) return null;

    const handleDownload = async (language) => {
        try {
            setDownloadStates(prev => ({
                ...prev,
                [language]: { ...prev[language], isLoading: true }
            }));
            setError('');
            
            await onDownload(language);
            
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
            setError(error.message);
            setDownloadStates(prev => ({
                ...prev,
                [language]: { isLoading: false, isSuccess: false }
            }));
        }
    };

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
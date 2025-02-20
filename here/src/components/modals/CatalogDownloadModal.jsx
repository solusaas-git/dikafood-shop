import React, { useState, useEffect } from 'react';
import { X, Download, Globe, Warning } from "@phosphor-icons/react";
import { downloadCatalog } from '../../services/downloadService';
import './catalog-download-modal.scss';

export default function CatalogDownloadModal({ isOpen, onClose, userData }) {
    const [error, setError] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
            setError('');
            setIsDownloading(true);
            await downloadCatalog(userData, language);
            // Close modal after successful download
            setTimeout(onClose, 1000);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className={`catalog-download-modal ${isMobile ? 'mobile' : ''}`}>
                <button 
                    className="close-button" 
                    onClick={onClose} 
                    aria-label="Close modal"
                    disabled={isDownloading}
                >
                    <X weight="bold" />
                </button>

                <div className="modal-content">
                    <div className="success-message">
                        <div className="icon-wrapper">
                            <Download size={isMobile ? 24 : 32} weight="duotone" />
                        </div>
                        <h3>Merci pour votre intérêt!</h3>
                        <p>Choisissez la version du catalogue que vous souhaitez télécharger</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <Warning size={isMobile ? 14 : 16} weight="fill" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="download-options">
                        <button 
                            className="download-button french"
                            onClick={() => handleDownload('fr')}
                            disabled={isDownloading}
                        >
                            <Globe size={isMobile ? 20 : 24} weight="duotone" />
                            <span>{isDownloading ? 'Téléchargement...' : 'Version Française'}</span>
                        </button>
                        <button 
                            className="download-button arabic"
                            onClick={() => handleDownload('ar')}
                            disabled={isDownloading}
                        >
                            <Globe size={isMobile ? 20 : 24} weight="duotone" />
                            <span>{isDownloading ? 'Téléchargement...' : 'النسخة العربية'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
} 
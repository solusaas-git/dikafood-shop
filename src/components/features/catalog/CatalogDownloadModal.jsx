import React, { useState, useEffect } from 'react';
import { tv } from 'tailwind-variants';
import { paths } from '@/utils/paths';
import Modal from '@/components/ui/feedback/Modal';
import { Button } from '@/components/ui/inputs';
import { Icon } from '@/components/ui/icons';

// Styles for the download buttons and content
const styles = {
  content: `
    flex flex-col items-center text-center
  `,

  errorMessage: `
    flex items-center gap-2 p-3 bg-light-yellow-1
    border border-dark-yellow-1 rounded-lg text-dark-green-7
    text-sm font-medium w-full mb-6
  `,

  downloadOptions: `
    flex flex-row gap-4 w-full mt-6 justify-center flex-wrap
    md:flex-nowrap md:gap-5
  `,

  downloadButton: tv({
    base: `
      flex items-center gap-3 px-6 py-4
      bg-white border border-dark-yellow-1
      rounded-full text-dark-green-7 font-medium
      transition-all hover:bg-light-yellow-1 hover:border-dark-yellow-2
      focus:outline-none focus:ring-2 focus:ring-dark-yellow-1
      md:py-3 flex-1 min-w-[170px] max-w-[200px] justify-center h-[56px]
    `,
    variants: {
      state: {
        default: 'text-dark-green-7',
        loading: 'bg-light-yellow-1 text-dark-green-6 cursor-wait opacity-80',
        success: 'bg-dark-green-6 text-white border-dark-green-6',
      },
      lang: {
        ar: 'font-[Cairo,sans-serif]',
        fr: '',
      }
    },
    defaultVariants: {
      state: 'default',
      lang: 'fr'
    }
  }),
};

const INITIAL_DOWNLOAD_STATES = {
  fr: { isLoading: false, isSuccess: false },
  ar: { isLoading: false, isSuccess: false }
};

/**
 * Modal component for catalog download options after form submission
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {object} userData - User data submitted in the form
 * @param {function} onDownload - Function to handle download
 */
export default function CatalogDownloadModal({ isOpen, onClose, userData, onDownload }) {
  const [downloadStates, setDownloadStates] = useState(INITIAL_DOWNLOAD_STATES);
  const [error, setError] = useState('');

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setDownloadStates(INITIAL_DOWNLOAD_STATES);
      setError('');
      console.log('📋 Modal opened with userData:', userData);
    }
  }, [isOpen, userData]);

  // Handle download button click
  const handleDownload = async (language) => {
    try {
      setError('');
      setDownloadStates(prev => ({
        ...prev,
        [language]: { ...prev[language], isLoading: true }
      }));

      // First, send email with selected language
      if (userData?.leadId) {
        console.log('📧 Sending email for language:', language, 'leadId:', userData.leadId);
        
        const emailResponse = await fetch('/api/catalog-leads/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leadId: userData.leadId,
            selectedLanguage: language
          })
        });

        const emailResult = await emailResponse.json();
        console.log('📧 Email API response:', emailResult);
        
        if (!emailResult.success && !emailResult.data?.alreadySent) {
          throw new Error(emailResult.message || 'Failed to send email');
        }
      } else {
        console.log('❌ No leadId found in userData:', userData);
      }

      // Then trigger the download
      const result = await onDownload?.(language);

      if (!result || !result.success) {
        throw new Error(result?.error || 'Erreur lors du téléchargement');
      }

      setDownloadStates(prev => ({
        ...prev,
        [language]: { isLoading: false, isSuccess: true }
      }));

      // Reset success state after 3 seconds
      setTimeout(() => {
        setDownloadStates(prev => ({
          ...prev,
          [language]: { isLoading: false, isSuccess: false }
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

  // Custom footer with download buttons
  const modalFooter = (
    <div className={styles.downloadOptions}>
      <button
        className={styles.downloadButton({
          state: downloadStates.fr.isLoading
            ? 'loading'
            : downloadStates.fr.isSuccess
            ? 'success'
            : 'default',
          lang: 'fr'
        })}
        onClick={() => handleDownload('fr')}
        disabled={downloadStates.fr.isLoading}
        lang="fr"
      >
        {downloadStates.fr.isSuccess ? (
          <Icon name="check" size="lg" weight="fill" />
        ) : downloadStates.fr.isLoading ? (
          <Icon name="circlenotch" size="lg" weight="regular" className="animate-spin" />
        ) : (
          <img
            src="/images/flags/france.svg"
            alt="French flag"
            className="w-7 h-5 rounded-sm shadow-sm object-cover"
          />
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
        className={styles.downloadButton({
          state: downloadStates.ar.isLoading
            ? 'loading'
            : downloadStates.ar.isSuccess
            ? 'success'
            : 'default',
          lang: 'ar'
        })}
        onClick={() => handleDownload('ar')}
        disabled={downloadStates.ar.isLoading}
        lang="ar"
        dir="rtl"
      >
        <div className="flex items-center gap-3 flex-row-reverse">
          {downloadStates.ar.isSuccess ? (
            <Icon name="check" size="lg" weight="fill" />
          ) : downloadStates.ar.isLoading ? (
            <Icon name="circlenotch" size="lg" weight="regular" className="animate-spin" />
          ) : (
            <img
              src="/images/flags/morocco.svg"
              alt="Moroccan flag"
              className="w-7 h-5 rounded-sm shadow-sm object-cover"
            />
          )}
          <span>
            {downloadStates.ar.isLoading
              ? 'جاري التحميل...'
              : downloadStates.ar.isSuccess
                ? 'تم التحميل !'
                : 'النسخة العربية'}
          </span>
        </div>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span role="img" aria-label="Merci" className="text-xl">🎉</span>
          <span>Merci pour votre intérêt !</span>
        </div>
      }
      size="md"
      footer={modalFooter}
      closeOnOverlayClick={true}
    >
      <div className={styles.content}>
        <p className="text-dark-green-6 mb-6 text-base leading-relaxed">
          Choisissez la version du catalogue que vous souhaitez recevoir par email et télécharger
        </p>

        {error && (
          <div className={styles.errorMessage}>
            <Icon name="warning" size="sm" weight="fill" className="text-dark-yellow-2" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
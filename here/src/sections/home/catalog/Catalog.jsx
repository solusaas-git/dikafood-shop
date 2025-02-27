import React, { useState, useCallback } from 'react';
import {
    ArrowDownRight,
    At,
    User,
    Phone,
    ClipboardText,
    Warning,
    Download,
    CircleNotch
} from "@phosphor-icons/react";
import Field from "../../../components/forms/Field";
import CatalogCover from "../../../components/catalog/CatalogCover";
import CatalogDownloadModal from "../../../components/modals/CatalogDownloadModal";
import { useApi } from '../../../hooks/useApi';
import { catalogService } from '../../../services/catalogService';
import "./catalog.scss";
import { validateName, validateEmail, validatePhone, formatPhoneNumber } from '../../../utils/validation';

const INITIAL_FORM_STATE = {
    name: '',
    surname: '',
    email: '',
    telephone: ''
};

const Catalog = () => {
    // Form state
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    // API hook
    const { 
        loading: isSubmitting, 
        error: submitError, 
        execute: submitCatalogRequest 
    } = useApi(catalogService.requestCatalog);

    // Form validation functions
    const validateField = useCallback((name, value) => {
        switch (name) {
            case 'name':
            case 'surname':
                return validateName(value) || '';
            case 'email':
                return validateEmail(value) || '';
            case 'telephone':
                return validatePhone(value) || '';
            default:
                return '';
        }
    }, []);

    const validateForm = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        // Validate all fields
        Object.entries(formData).forEach(([field, value]) => {
            const error = validateField(field, value);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        // Mark all fields as touched when submitting
        setTouched(Object.keys(formData).reduce((acc, field) => ({
            ...acc,
            [field]: true
        }), {}));

        setErrors(newErrors);
        return isValid;
    }, [formData, validateField]);

    // Event handlers
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // Format phone number as user types
        if (name === 'telephone') {
            setFormData(prev => ({
                ...prev,
                [name]: formatPhoneNumber(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        
        setTouched(prev => ({ 
            ...prev, 
            [name]: true 
        }));
        
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ 
                ...prev, 
                [name]: error 
            }));
        }
    }, [touched, validateField]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // Call API through catalogService
            const response = await submitCatalogRequest({
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone: formData.telephone,
                useCase: 'catalog'
            });
            
            // Store URLs for later use
            setSubmittedData({
                ...formData,
                submittedAt: new Date().toISOString(),
                catalogUrls: response.data.urls // Contains {fr: url, ar: url}
            });
            
            setIsModalOpen(true);
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: error.message
            }));
        }
    };

    const handleDownload = async (language) => {
        try {
            if (!submittedData?.catalogUrls?.[language]) {
                throw new Error('URL de téléchargement non disponible');
            }

            // Pass URL to catalogService
            return await catalogService.downloadCatalog(
                language,
                submittedData.catalogUrls[language]
            );
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        if (submittedData) {
            // Reset form state
            setFormData(INITIAL_FORM_STATE);
            setTouched({});
            setErrors({});
            setSubmittedData(null);
        }
    }, [submittedData]);

    return (
        <section className="form-section" id="form">
            <div className="form-container">
                <div className="hero-side">
                    <div className="catalog-preview">
                        <div className="catalog-wrapper">
                            <CatalogCover />
                            <div className="catalog-reflection"></div>
                        </div>
                    </div>
                </div>

                <div className="form-side">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <div className="icon-wrapper">
                                <ClipboardText weight="duotone" />
                            </div>
                            <h3>Téléchargez le catalogue</h3>
                            <p>Remplissez le formulaire pour recevoir notre catalogue détaillé</p>
                        </div>

                        <form className="download-form" onSubmit={handleSubmit} noValidate>
                            <div className="fields-container">
                                <Field
                                    inputName="name"
                                    Icon={<User size={20} weight="duotone" />}
                                    placeholder="Nom"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.name ? errors.name : ''}
                                    required
                                />
                                <Field
                                    inputName="surname"
                                    Icon={<User size={20} weight="duotone" />}
                                    placeholder="Prénom"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.surname ? errors.surname : ''}
                                    required
                                />
                                <Field
                                    inputName="email"
                                    Icon={<At size={20} weight="duotone" />}
                                    placeholder="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.email ? errors.email : ''}
                                    required
                                />
                                <Field
                                    inputName="telephone"
                                    Icon={<Phone size={20} weight="duotone" />}
                                    placeholder="Numéro de téléphone"
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.telephone ? errors.telephone : ''}
                                    required
                                />
                            </div>

                            {errors.submit && (
                                <div className="submit-error">
                                    <Warning size={16} weight="fill" />
                                    <span>{errors.submit}</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <CircleNotch size={20} weight="bold" className="spinning" />
                                ) : (
                                    <Download size={20} weight="duotone" />
                                )}
                                <span>
                                    {isSubmitting ? 'Envoi en cours...' : 'Télécharger le catalogue'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <CatalogDownloadModal 
                isOpen={isModalOpen} 
                onClose={handleModalClose}
                userData={submittedData}
                onDownload={handleDownload}
            />
        </section>
    );
};

Catalog.displayName = 'Catalog';

export default Catalog;
import React, { useState } from 'react';
import {
    ArrowDownRight,
    At,
    User,
    Phone,
    ClipboardText,
    Warning,
    Download
} from "@phosphor-icons/react";
import Field from "../../../components/forms/Field";
import CatalogCover from "../../../components/catalog/CatalogCover";
import CatalogDownloadModal from "../../../components/modals/CatalogDownloadModal";
import "./catalog.scss";
import { validateName, validateEmail, validatePhone, formatPhoneNumber } from '../../../utils/validation';

const Catalog = () => {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    const handleInputChange = (e) => {
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
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'prenom':
            case 'nom':
                return validateName(value);
            case 'email':
                return validateEmail(value);
            case 'telephone':
                return validatePhone(value);
            default:
                return '';
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Only validate if field has been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Validate all fields and mark them as touched
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
            setTouched(prev => ({
                ...prev,
                [field]: true
            }));
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Store the validated form data for the download modal
            setSubmittedData({
                ...formData,
                submittedAt: new Date().toISOString()
            });
            
            // Show success modal
            setIsModalOpen(true);
            
            // Don't reset form until download is complete
            // Form reset will happen after successful download in the modal
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Une erreur est survenue. Veuillez réessayer.'
            }));
            setSubmittedData(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        // Only reset the form if we have submitted data (successful submission)
        if (submittedData) {
            setFormData({
                prenom: '',
                nom: '',
                email: '',
                telephone: ''
            });
            setTouched({});
            setErrors({});
            setSubmittedData(null);
        }
    };

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
                                    inputName="prenom"
                                    Icon={<User size={20} weight="duotone" />}
                                    placeholder="Prénom"
                                    value={formData.prenom}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.prenom ? errors.prenom : ''}
                                    required
                                />
                                <Field
                                    inputName="nom"
                                    Icon={<User size={20} weight="duotone" />}
                                    placeholder="Nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.nom ? errors.nom : ''}
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
                                <Download size={20} weight="duotone" />
                                <span>{isSubmitting ? 'Envoi en cours...' : 'Télécharger le catalogue'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <CatalogDownloadModal 
                isOpen={isModalOpen} 
                onClose={handleModalClose}
                userData={submittedData}
            />
        </section>
    );
};

Catalog.displayName = 'Catalog';

export default Catalog;
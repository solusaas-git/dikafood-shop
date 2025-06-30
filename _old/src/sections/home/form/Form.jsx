import React from 'react';
import { DownloadSimple, User, At, Buildings } from "@phosphor-icons/react";
import Field from "../../../components/forms/Field";
import SectionHeader from '../../../components/ui/section/SectionHeader';
import './form.scss';

// Import product images
import productImage1 from "../../../assets/images/products/dika-5L.png";
import productImage2 from "../../../assets/images/products/dika-500ML.png";
import productImage3 from "../../../assets/images/products/chourouk-1L.png";
import productImage4 from "../../../assets/images/products/chourouk-10L.png";

export default function Catalog() {
    return (
        <section className="catalog-section" id="catalog">
            <div className="container">
                <SectionHeader 
                    icon={DownloadSimple}
                    title="Téléchargez Notre Catalogue"
                    subtitle="Découvrez notre gamme complète de produits et leurs spécifications"
                    className="white-text"
                />

                <div className="catalog-content">
                    {/* Catalog Preview */}
                    <div className="catalog-preview">
                        <div className="catalog-wrapper">
                            <div className="catalog-cover">
                                <div className="product-showcase">
                                    <img src={productImage1} alt="Dika 5L" className="product-image" />
                                    <img src={productImage2} alt="Dika 500ML" className="product-image" />
                                    <img src={productImage3} alt="Chourouk 1L" className="product-image" />
                                    <img src={productImage4} alt="Chourouk 10L" className="product-image" />
                                </div>
                                <div className="catalog-info">
                                    <h3>Catalogue 2024</h3>
                                    <p>Collection Premium</p>
                                </div>
                            </div>
                            <div className="catalog-reflection"></div>
                        </div>
                    </div>

                    {/* Download Form */}
                    <form className="catalog-form">
                        <Field 
                            placeholder="Prénom" 
                            inputName="prénom" 
                            Icon={<User weight="duotone" />} 
                        />
                        <Field 
                            placeholder="Nom" 
                            inputName="nom" 
                            Icon={<User weight="duotone" />} 
                        />
                        <Field 
                            placeholder="Adresse mail" 
                            inputName="email" 
                            Icon={<At weight="duotone" />} 
                        />
                        <Field 
                            placeholder="Entreprise (optionnel)" 
                            inputName="company" 
                            Icon={<Buildings weight="duotone" />} 
                        />
                        <button type="submit" className="submit-button">
                            <DownloadSimple weight="duotone" />
                            Télécharger le catalogue
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

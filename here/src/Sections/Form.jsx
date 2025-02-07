import { memo } from 'react';
import { DownloadSimple, At, User, Phone } from "@phosphor-icons/react";
import Button from "../Components/Button";
import Field from "../Components/Field";
import "./form.scss";

const Form = memo(() => {
    return (
        <section className="form-section" id="form">
            <div className="form-container">
                <div className="hero-side">
                    <div className="content-wrapper">
                        <h2 className="hero-title">
                            Découvrez Notre <br />
                            <span className="highlight">Catalogue Complet</span>
                        </h2>
                        <p className="hero-subtitle">
                            Explorez notre sélection d'huiles d'olive premium et 
                            découvrez l'excellence de nos produits artisanaux
                        </p>
                    </div>
                    
                    <div className="image-wrapper">
                        <div className="image-container">
                            <img 
                                src="/images/oil.png" 
                                alt="Huile d'olive en bouteille" 
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-side">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h3>Téléchargez le catalogue</h3>
                            <p>Remplissez le formulaire pour recevoir notre catalogue détaillé</p>
                        </div>

                        <form className="download-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="fields-container">
                                <Field 
                                    inputName="prenom" 
                                    Icon={<User size={16} weight="regular" />} 
                                    placeholder="Prénom" 
                                />
                                <Field 
                                    inputName="nom" 
                                    Icon={<User size={16} weight="regular" />} 
                                    placeholder="Nom" 
                                />
                                <Field 
                                    inputName="email" 
                                    Icon={<At size={16} weight="regular" />} 
                                    placeholder="Email" 
                                />
                                <Field 
                                    inputName="telephone" 
                                    Icon={<Phone size={16} weight="regular" />} 
                                    placeholder="Numéro de téléphone" 
                                />
                            </div>
                            
                            <Button 
                                buttonIcon={<DownloadSimple size={20} weight="regular" />}
                                buttonName="Télécharger le catalogue"
                                theme="button-comp-primary"
                                size="button-comp-small"
                                type="submit"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
});

Form.displayName = 'Form';

export default Form;

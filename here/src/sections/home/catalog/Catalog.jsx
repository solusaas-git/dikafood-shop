import { memo } from 'react';
import {
    ArrowDownRight,
    At,
    User,
    Phone,
    ClipboardText
} from "@phosphor-icons/react";
import Button from "../../../components/buttons/Button";
import Field from "../../../components/forms/Field";
import CatalogCover from "../../../components/catalog/CatalogCover";
import "./catalog.scss";

const Catalog = memo(() => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
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

                        <form className="download-form" onSubmit={handleSubmit}>
                            <div className="fields-container">
                                <Field
                                    inputName="prenom"
                                    Icon={<User size={20} weight="duotone" />}
                                    placeholder="Prénom"
                                />
                                <Field
                                    inputName="nom"
                                    Icon={<User size={20} weight="duotone" />}
                                    placeholder="Nom"
                                />
                                <Field
                                    inputName="email"
                                    Icon={<At size={20} weight="duotone" />}
                                    placeholder="Email"
                                    type="email"
                                />
                                <Field
                                    inputName="telephone"
                                    Icon={<Phone size={20} weight="duotone" />}
                                    placeholder="Numéro de téléphone"
                                    type="tel"
                                />
                            </div>

                            <Button
                                name="Télécharger le catalogue"
                                icon={<ArrowDownRight size={24} weight="bold" />}
                                theme="primary"
                                size="medium"
                                type="submit"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
});

Catalog.displayName = 'Catalog';

export default Catalog;
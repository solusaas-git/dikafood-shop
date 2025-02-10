import { memo } from 'react';
import {
    ArrowDownRight,
    At,
    User,
    Phone
} from "@phosphor-icons/react";
import Button from "../Components/Button";
import Field from "../Components/Field";
import CatalogCover from "./CatalogCover";
import "./form.scss";

const Form = memo(() => {
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
                            <h3>Téléchargez le catalogue</h3>
                            <p>Remplissez le formulaire pour recevoir notre catalogue détaillé</p>
                        </div>

                        <form className="download-form" onSubmit={(e) => e.preventDefault()}>
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
                                />
                                <Field
                                    inputName="telephone"
                                    Icon={<Phone size={20} weight="duotone" />}
                                    placeholder="Numéro de téléphone"
                                />
                            </div>

                            <Button
                                buttonIcon={<ArrowDownRight size={28} weight="bold" />}
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

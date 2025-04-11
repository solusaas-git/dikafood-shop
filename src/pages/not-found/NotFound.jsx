import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { House, ArrowLeft, Warning } from "@phosphor-icons/react";
import Button from '../../components/buttons/Button';
import './not-found.scss';

export default function NotFound() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const goHome = () => {
        navigate('/');
    };

    return (
        <main className="not-found-page">
            <Helmet>
                <title>Page non trouvée - DikaFood</title>
                <meta name="description" content="Désolé, la page que vous recherchez n'existe pas ou a été déplacée." />
            </Helmet>

            <div className="content">
                <div className="icon-wrapper">
                    <Warning weight="duotone" />
                </div>
                <h1>404</h1>
                <h2>Page non trouvée</h2>
                <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Vous pouvez retourner à la page précédente ou visiter notre page d'accueil.</p>

                <div className="actions">
                    <Button
                        icon={<ArrowLeft size={24} weight="duotone" />}
                        name="Retour"
                        theme="secondary"
                        onClick={goBack}
                    />
                    <Button
                        icon={<House size={24} weight="duotone" />}
                        name="Page d'accueil"
                        theme="primary"
                        onClick={goHome}
                    />
                </div>
            </div>
        </main>
    );
}
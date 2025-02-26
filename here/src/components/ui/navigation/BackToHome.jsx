import React from 'react';
import { House } from '@phosphor-icons/react';
import Button from '../../buttons/Button';
import './back-to-home.scss';

const BackToHome = () => {
    return (
        <div className="back-to-home">
            <Button
                to="/"
                icon={<House weight="duotone" size={24} />}
                name="Retour à l'accueil"
                theme="light"
                size="medium"
                className="back-button"
            />
        </div>
    );
};

export default BackToHome; 
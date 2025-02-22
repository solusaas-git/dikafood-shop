import React from 'react';
import './hero-content.scss';
import Button from '../../../../components/buttons/Button';
import { ArrowDownRight } from "@phosphor-icons/react";
import { useBreakpoint } from '../../../../hooks/useBreakpoint';

export default function HeroContent({ onScrollToForm }) {
    const { isMobile, isTablet } = useBreakpoint();

    return (
        <div className="hero-content">
            <h1>
                L'excellence alimentaire
                {/* <br /> */}
                {isMobile ? <br /> : " "}
                <span className="highlight"> marocaine </span>
                à votre porte
            </h1>
            <div className="cta-wrapper">
                <Button
                    icon={<ArrowDownRight
                        size={isMobile ? 20 : isTablet ? 22 : 24}
                        weight="duotone"
                    />}
                    name="Télécharger le catalogue"
                    theme="cta-hero"
                    onClick={onScrollToForm}
                    className={isMobile ? 'mobile' : isTablet ? 'tablet' : ''}
                />
            </div>
        </div>
    );
} 
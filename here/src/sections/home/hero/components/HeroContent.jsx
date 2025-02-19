import React from 'react';
import { ArrowDownRight } from "@phosphor-icons/react";
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/buttons/Button';
import './hero-content.scss';

export default function HeroContent({ onScrollToForm, isMobile }) {
    const { t } = useTranslation();

    return (
        <div className={`hero-content ${isMobile ? 'mobile' : ''}`}>
            <h1>
                {t('hero.title.part1')}
                <span className="highlight">{t('hero.title.highlight')}</span>
                {t('hero.title.part2')}
            </h1>
            <div className="cta-wrapper">
                <Button
                    icon={<ArrowDownRight size={isMobile ? 20 : 24} weight="duotone" />}
                    name={t('hero.cta')}
                    theme="cta-hero"
                    onClick={onScrollToForm}
                    className={isMobile ? 'mobile' : ''}
                />
            </div>
        </div>
    );
} 
import React from 'react';
import './hero-background.scss';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';

export default function HeroBackground() {
    const { isMobile, isTablet } = useBreakpoint();

    return (
        <div className={`hero-background ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
            <div className="overlay-gradient"></div>
        </div>
    );
}
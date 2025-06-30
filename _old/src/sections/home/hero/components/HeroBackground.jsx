import React from 'react';
import './hero-background.scss';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';

export default function HeroBackground() {
    const { isMobile, isTablet } = useBreakpoint();

    return (
        <div className={`hero-background ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
            <div className="background-pattern" />
            <div className="background-gradient"
                style={{
                    opacity: isMobile ? 0.85 : isTablet ? 0.75 : 0.6
                }}
            />
        </div>
    );
}
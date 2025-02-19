import React from 'react';
import './hero-background.scss';

export default function HeroBackground({ isMobile }) {
    return (
        <div className={`hero-background ${isMobile ? 'mobile' : ''}`}>
            <div className="overlay-gradient" />
            <div className="overlay-vignette" />
        </div>
    );
} 
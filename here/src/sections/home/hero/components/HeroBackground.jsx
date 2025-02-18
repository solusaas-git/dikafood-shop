import React from 'react';
import './hero-background.scss';

export default function HeroBackground() {
    return (
        <div className="hero-background">
            <div className="overlay-gradient" />
            <div className="overlay-vignette" />
        </div>
    );
} 
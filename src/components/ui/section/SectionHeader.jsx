import React from 'react';
import './section-header.scss';

export default function SectionHeader({ 
    icon: Icon, 
    title, 
    subtitle, 
    variant = 'light',
    isMobile = window.innerWidth <= 768 // Add mobile detection
}) {
    return (
        <div className={`section-header ${variant} ${isMobile ? 'mobile' : ''}`}>
            <div className="title-container">
                <div className="title-content">
                    <div className="title-wrapper">
                        {Icon && (
                            <Icon 
                                size={isMobile ? 36 : 48} 
                                weight="duotone" 
                                className="title-icon"
                            />
                        )}
                        <h2>{title}</h2>
                    </div>
                    {subtitle && <p>{subtitle}</p>}
                </div>
            </div>
        </div>
    );
} 
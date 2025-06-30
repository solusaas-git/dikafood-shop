import React from 'react';
import { ListChecks, Target, X } from '@phosphor-icons/react';
import './brand-tooltip.scss';

export default function BrandTooltip({ brand, position, isMobile, onClose }) {
    if (!brand) return null;

    // Create a default icon if brand.icon is undefined
    const BrandIcon = brand.icon || Target;

    const tooltipContent = (
        <div className="tooltip-content">
            <div className="brand-header">
                <div className="icon-wrapper">
                    <BrandIcon 
                        size={24}
                        color="var(--dark-green-7)"
                        weight="duotone"
                    />
                </div>
                <div className="brand-title">
                    <h3>{brand.title}</h3>
                    <span className="brand-type">{brand.type}</span>
                </div>
                {isMobile && (
                    <button 
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close tooltip"
                    >
                        <X weight="bold" />
                    </button>
                )}
            </div>
            <div className="description">
                <p>{brand.description}</p>
                <div className="specs">
                    <div className="spec-badge">
                        <span className="badge-label">
                            <ListChecks size={14} weight="bold" />
                            Caractéristiques
                        </span>
                        <span className="badge-value">{brand.characteristics}</span>
                    </div>
                    <div className="spec-badge">
                        <span className="badge-label">
                            <Target size={14} weight="bold" />
                            Utilisation
                        </span>
                        <span className="badge-value">{brand.usage}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="brand-tooltip mobile" data-active={Boolean(brand)}>
                {tooltipContent}
            </div>
        );
    }

    return (
        <div 
            className="brand-tooltip desktop"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            {tooltipContent}
        </div>
    );
} 
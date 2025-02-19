import React, { useState, useEffect } from 'react';
import { Buildings } from "@phosphor-icons/react";
import { brandsData } from '../../../data/brands';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import BrandTooltip from '../../../components/ui/tooltip/BrandTooltip';
import { Carousel, CarouselSlide } from '../../../components/ui/carousel/Carousel';
import './brands.scss';

const EMBLA_OPTIONS = {
    align: "center",
    loop: true,
    dragFree: false,
    containScroll: false,
    slidesToScroll: 1
};

export default function Brands() {
    const [tooltipData, setTooltipData] = useState({
        brand: null,
        position: { x: 0, y: 0 }
    });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseMove = (e, brand) => {
        if (!isMobile) {
            setTooltipData({
                brand,
                position: { x: e.clientX, y: e.clientY }
            });
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setTooltipData({ brand: null, position: { x: 0, y: 0 } });
        }
    };

    const handleCardClick = (brand) => {
        if (isMobile) {
            setTooltipData(prev => ({
                ...prev,
                brand: prev.brand === brand ? null : brand
            }));
        }
    };

    const handleTooltipClose = () => {
        setTooltipData({ brand: null, position: { x: 0, y: 0 } });
    };

    const renderBrandCard = (brand) => (
        <div
            className="brand-card"
            onMouseMove={(e) => handleMouseMove(e, brand)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleCardClick(brand)}
        >
            <div className="brand-image">
                <img 
                    src={brand.image} 
                    alt={`Logo ${brand.title}`}
                    draggable="false"
                />
            </div>
        </div>
    );

    return (
        <section className="brands-section">
            <div className="container">
                <SectionHeader 
                    icon={Buildings}
                    title="Nos Marques"
                    subtitle="Découvrez notre gamme complète d'huiles de qualité supérieure"
                    variant="light"
                    isMobile={isMobile}
                />

                {isMobile ? (
                    <Carousel 
                        className="brands-carousel"
                        opts={EMBLA_OPTIONS}
                        showControls={true}
                    >
                        {brandsData.map((brand) => (
                            <CarouselSlide key={brand.id}>
                                {renderBrandCard(brand)}
                            </CarouselSlide>
                        ))}
                    </Carousel>
                ) : (
                    <div className="brands-grid">
                        {brandsData.map((brand) => (
                            <React.Fragment key={brand.id}>
                                {renderBrandCard(brand)}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                <BrandTooltip 
                    brand={tooltipData.brand}
                    position={tooltipData.position}
                    isMobile={isMobile}
                    onClose={handleTooltipClose}
                />
            </div>
        </section>
    );
}

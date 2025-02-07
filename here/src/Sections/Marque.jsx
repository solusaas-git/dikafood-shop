import React, { useState, useRef, useEffect } from 'react';
import { SunHorizon, Waves, Plant } from "@phosphor-icons/react";
import BrandTooltip from '../Components/BrandTooltip';
import "./marque.scss";

export default function Marque() {
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeCard, setActiveCard] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const sectionRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState({});

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        setIsPaused(true);
        containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        containerRef.current.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
        setActiveCard(null);
        setIsDragging(false);
        setIsPaused(false);
        containerRef.current.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseEnter = (brand) => {
        setActiveCard(brand);
        setIsPaused(true);
    };

    const handleCardMouseMove = (e) => {
        if (activeCard) {
            console.log('Mouse moving on card:', activeCard.title);
            setTooltipPosition({
                x: e.clientX,
                y: e.clientY
            });
            console.log('Tooltip position:', tooltipPosition);
        }
    };

    const marques = [
        {
            title: "Oued Fès",
            icon: <Waves weight='duotone' size={32} />,
            type: "Huile d'olive extra vierge",
            description: "Représentant l'essence de la culture oléicole marocaine, Oued Fès offre une huile d'olive extra vierge aux notes fruitées et équilibrées.",
            characteristics: "Fruitée • Artisanale • Premium",
            usage: "Assaisonnement • Cuisson",
            image: "/images/brands/ouedfes-logo.svg",
        },
        {
            title: "Biladi",
            icon: <Plant weight='duotone' size={32} />,
            type: "Huile de grignons d'olive",
            description: "Huile de grignons d'olive Biladi, obtenue par extraction des résidus d'olives. Parfaite pour la cuisson quotidienne.",
            characteristics: "Stable • Économique • Polyvalente",
            usage: "Friture • Cuisson",
            image: "/images/brands/biladi-logo.svg",
        },
        {
            title: "Chourouk",
            icon: <SunHorizon weight='duotone' size={32} />,
            descp: <div className="description">
                Huile de grignons d'olive Chourouk, une solution économique et pratique pour la cuisine de tous les jours.<br/>
                <br/><b>•	Caractéristiques :</b> Polyvalente, bon rapport qualité-prix
                <br/><b>•	Utilisation :</b> Cuisine quotidienne
            </div>,
            image: "/images/brands/chourouk-logo.svg",
        },
        {
            title: "Nouarati",
            icon: <SunHorizon weight='duotone' size={32} />,
            descp: <div className="description">
                Huile de tournesol Nouarati, riche en vitamine E et acides gras essentiels. Une option saine pour votre cuisine.<br/>
                <br/><b>•	Caractéristiques :</b> 100% naturelle
                <br/><b>•	Utilisation :</b> Polyvalente
            </div>,
            image: "/images/brands/nouarati-logo.svg",
        },
        {
            title: "Dika Extra Vièrge",
            icon: <SunHorizon weight='duotone' size={32} />,
            descp: <div className="description">
                Huile d'olive extra vierge Dika, première pression à froid. Une qualité supérieure pour vos plats.<br/>
                <br/><b>•	Caractéristiques :</b> Pure, pressée à froid
                <br/><b>•	Utilisation :</b> Salades et assaisonnements
            </div>,
            image: "/images/brands/dika-logo.svg",
        }
    ];

    const duplicatedMarques = [...marques, ...marques, ...marques];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsPaused(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="marque-container">
            <div className='marque'>
                <div className="marque-title">
                    <div className="title-content">
                        <h2>Nos Marques</h2>
                        <p>Découvrez notre gamme complète d'huiles de qualité supérieure</p>
                    </div>
                </div>
                
                <div 
                    ref={containerRef}
                    className="brands-container"
                    role="region"
                    aria-label="Nos marques défilantes"
                    tabIndex="0"
                    style={{
                        animationPlayState: isPaused ? 'paused' : 'running',
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                >
                    {duplicatedMarques.map((brand, index) => (
                        <div 
                            key={`${brand.title}-${index}`}
                            className="brand-card"
                            role="article"
                            aria-label={`Marque ${brand.title}`}
                            tabIndex="0"
                            onMouseEnter={() => handleMouseEnter(brand)}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={handleCardMouseMove}
                        >
                            <div className="brand-image">
                                <img 
                                    src={brand.image} 
                                    alt={brand.title}
                                    onLoad={() => setImageLoaded(prev => ({...prev, [brand.title]: true}))}
                                    onError={(e) => {
                                        e.target.src = '/images/fallback-logo.svg';
                                        console.error(`Failed to load image for ${brand.title}`);
                                    }}
                                    className={!imageLoaded[brand.title] ? 'loading' : ''}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {activeCard && (
                <BrandTooltip 
                    brand={activeCard} 
                    position={tooltipPosition}
                />
            )}
        </div>
    );
}

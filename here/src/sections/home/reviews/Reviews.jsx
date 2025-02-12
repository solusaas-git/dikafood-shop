import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChatCircleText } from "@phosphor-icons/react";
import CardReview from '../../../components/cards/review/CardReview';
import reviewsData from '../../../data/reviews.json';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import "./reviews.scss";

export default function Reviews() {
    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                setIsPaused(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Quadruple the reviews array to ensure smooth infinite scroll
    const duplicatedReviews = [...reviewsData, ...reviewsData, ...reviewsData, ...reviewsData];

    return (
        <section className="reviews-section" ref={containerRef}>
            <div className="container">
                <SectionHeader 
                    icon={ChatCircleText}
                    title="Témoignages Clients"
                    subtitle="Découvrez ce que nos clients disent de nos produits"
                    variant="light"
                />
            </div>

            <div 
                className="reviews-carousel"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                <div className={`reviews-track ${isPaused ? 'paused' : ''}`}>
                    {duplicatedReviews.map((review, index) => (
                        <div 
                            key={`${review.id}-${index}`}
                            className="review-slide"
                        >
                            <CardReview review={review} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChatCircleText, CaretLeft, CaretRight } from "@phosphor-icons/react";
import CardReview from '../../../components/cards/review/CardReview';
import reviewsData from '../../../data/reviews.json';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import "./reviews.scss";

export default function Reviews() {
    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const containerRef = useRef(null);
    const trackRef = useRef(null);

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

    const checkScrollPosition = () => {
        if (trackRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
            setIsAtStart(scrollLeft <= 0);
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        const track = trackRef.current;
        if (track) {
            track.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);
        }
        return () => {
            if (track) {
                track.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            }
        };
    }, []);

    const scrollToPrev = () => {
        if (trackRef.current) {
            const cardWidth = trackRef.current.offsetWidth;
            trackRef.current.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollToNext = () => {
        if (trackRef.current) {
            const cardWidth = trackRef.current.offsetWidth;
            trackRef.current.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        }
    };

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

            <div className="reviews-carousel">
                <div 
                    ref={trackRef}
                    className={`reviews-track ${isPaused ? 'paused' : ''}`}
                >
                    {duplicatedReviews.map((review, index) => (
                        <div 
                            key={`${review.id}-${index}`}
                            className="review-slide"
                        >
                            <CardReview review={review} />
                        </div>
                    ))}
                </div>

                <button 
                    className={`carousel-control prev ${isAtStart ? 'hidden' : ''}`}
                    onClick={scrollToPrev}
                    aria-label="Previous reviews"
                >
                    <CaretLeft weight="bold" />
                </button>
                <button 
                    className={`carousel-control next ${isAtEnd ? 'hidden' : ''}`}
                    onClick={scrollToNext}
                    aria-label="Next reviews"
                >
                    <CaretRight weight="bold" />
                </button>
            </div>
        </section>
    );
}

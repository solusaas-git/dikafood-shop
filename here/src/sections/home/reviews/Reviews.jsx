import React, { useState, useRef, useEffect } from 'react';
import { ChatCircleText, CaretLeft, CaretRight } from "@phosphor-icons/react";
import CardReview from '../../../components/cards/review/CardReview';
import reviewsData from '../../../data/reviews.json';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import "./reviews.scss";

export default function Reviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const trackRef = useRef(null);

    // Update navigation state
    const updateNavigationState = () => {
        if (!trackRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
        setIsAtStart(scrollLeft <= 0);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    // Initialize and add scroll listener
    useEffect(() => {
        const track = trackRef.current;
        if (track) {
            track.addEventListener('scroll', updateNavigationState, { passive: true });
            window.addEventListener('resize', updateNavigationState, { passive: true });
            updateNavigationState();
        }

        return () => {
            if (track) {
                track.removeEventListener('scroll', updateNavigationState);
                window.removeEventListener('resize', updateNavigationState);
            }
        };
    }, []);

    // Handle navigation
    const scrollToSlide = (direction) => {
        if (!trackRef.current) return;

        const track = trackRef.current;
        const slides = track.getElementsByClassName('review-slide');
        if (!slides.length) return;

        const slideWidth = slides[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap);
        const scrollAmount = slideWidth + gap;

        const newScrollPosition = direction === 'next'
            ? track.scrollLeft + scrollAmount
            : track.scrollLeft - scrollAmount;

        track.scrollTo({
            left: newScrollPosition,
            behavior: 'smooth'
        });

        // Update current index
        const newIndex = direction === 'next'
            ? Math.min(currentIndex + 1, slides.length - 1)
            : Math.max(currentIndex - 1, 0);
        setCurrentIndex(newIndex);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyboard = (e) => {
            if (e.key === 'ArrowLeft') {
                scrollToSlide('prev');
            } else if (e.key === 'ArrowRight') {
                scrollToSlide('next');
            }
        };

        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [currentIndex]);

    return (
        <section className="reviews-section">
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
                    className="reviews-track"
                    onScroll={updateNavigationState}
                >
                    {reviewsData.map((review, index) => (
                        <div 
                            key={review.id}
                            className="review-slide"
                            role="tabpanel"
                            aria-label={`Review ${index + 1} of ${reviewsData.length}`}
                        >
                            <CardReview review={review} />
                        </div>
                    ))}
                </div>

                <button 
                    className={`carousel-control prev ${isAtStart ? 'hidden' : ''}`}
                    onClick={() => scrollToSlide('prev')}
                    aria-label="Previous reviews"
                    disabled={isAtStart}
                >
                    <CaretLeft weight="bold" />
                </button>
                <button 
                    className={`carousel-control next ${isAtEnd ? 'hidden' : ''}`}
                    onClick={() => scrollToSlide('next')}
                    aria-label="Next reviews"
                    disabled={isAtEnd}
                >
                    <CaretRight weight="bold" />
                </button>
            </div>
        </section>
    );
}

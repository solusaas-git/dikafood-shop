import { useState, useRef, useEffect } from 'react';
import { ChatCircleText } from "@phosphor-icons/react";
import CardReview from '../Components/CardReview';
import reviewsData from '../data/reviews.json';
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

    // Double the reviews array to ensure smooth infinite scroll
    const duplicatedReviews = [...reviewsData, ...reviewsData];

    return (
        <section className="reviews-section" ref={containerRef}>
            <div className="container">
                <div className="section-header">
                    <ChatCircleText size={32} weight="duotone" />
                    <h2>Témoignages Clients</h2>
                    <p>Découvrez ce que nos clients disent de nos produits</p>
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
            </div>
        </section>
    );
}

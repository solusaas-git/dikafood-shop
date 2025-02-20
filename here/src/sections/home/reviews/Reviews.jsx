import React, { useState, useEffect } from 'react';
import { ChatCircleText } from "@phosphor-icons/react";
import CardReview from '../../../components/cards/review/CardReview';
import reviewsData from '../../../data/reviews.json';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import { Carousel, CarouselSlide } from '../../../components/ui/carousel/Carousel';
import "./reviews.scss";

const getCarouselOptions = (isMobile) => ({
    align: isMobile ? 'center' : 'start',
    loop: true,
    dragFree: !isMobile,
    containScroll: isMobile ? true : false,
    slidesToScroll: 1,
    breakpoints: {
        1200: {
            align: 'start',
            containScroll: false
        },
        768: {
            align: 'center',
            containScroll: true
        }
    }
});

export default function Reviews() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Duplicate reviews for continuous scroll
    const extendedReviews = [...reviewsData, ...reviewsData, ...reviewsData];

    return (
        <section className={`reviews-section ${isMobile ? 'mobile' : ''}`}>
            <div className="container">
                <SectionHeader 
                    icon={ChatCircleText}
                    title="Témoignages Clients"
                    subtitle="Découvrez ce que nos clients disent de nos produits"
                    variant="light"
                    isMobile={isMobile}
                />
            </div>

            <div className="reviews-carousel">
                <Carousel 
                    opts={getCarouselOptions(isMobile)}
                    showControls={true}
                >
                    {extendedReviews.map((review, index) => (
                        <CarouselSlide key={`${review.id}-${index}`}>
                            <CardReview 
                                review={review} 
                                isMobile={isMobile}
                            />
                        </CarouselSlide>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}

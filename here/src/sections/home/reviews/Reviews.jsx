import React from 'react';
import { ChatCircleText } from "@phosphor-icons/react";
import CardReview from '../../../components/cards/review/CardReview';
import reviewsData from '../../../data/reviews.json';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import {
    Carousel,
    // CarouselContent,
    // CarouselItem,
    // CarouselPrevious,
    // CarouselNext,
} from '../../../components/ui/carousel';
import "./reviews.scss";

export default function Reviews() {
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

            <div className="relative px-8">
                <Carousel opts={{ loop: true }}>
                    {/* <CarouselContent>
                        {reviewsData.map((review) => (
                            <CarouselItem key={review.id}>
                                <CardReview review={review} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext /> */}
                </Carousel>
            </div>
        </section>
    );
}

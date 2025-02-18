import React from 'react';
import { ChatCircleText } from "@phosphor-icons/react";
import CardReview from '../../../components/cards/review/CardReview';
import reviewsData from '../../../data/reviews.json';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import Carousel from '../../../components/ui/carousel/Carousel';
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

            <Carousel
                items={reviewsData}
                renderItem={(review) => <CardReview review={review} />}
                className="reviews-carousel"
                itemWidth={360}
                gap={24}
                controlPosition="side"
            />
        </section>
    );
}

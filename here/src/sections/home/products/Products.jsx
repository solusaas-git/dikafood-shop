import React from 'react';
import { ShoppingBag } from "@phosphor-icons/react";
import { carouselProducts } from '../../../data/carousel-products';
import SectionHeader from '../../../components/ui/section/SectionHeader';
import Carousel from '../../../components/ui/carousel/Carousel';
import ProductCard from '../../../components/cards/product/ProductCard';
import "./products.scss";

export default function Products() {
    return (
        <section className="products-section">
            <div className="container">
                <SectionHeader 
                    icon={ShoppingBag}
                    title="Nos Produits"
                    subtitle="Découvrez notre gamme de produits de qualité supérieure"
                    variant="light"
                />
            </div>

            <Carousel
                items={carouselProducts}
                renderItem={(product) => (
                    <ProductCard
                        product={product}
                        activeVariant={product.variants[0]}
                    />
                )}
                className="products-carousel"
                itemWidth={320}
                gap={24}
                controlPosition="side"
            />
        </section>
    );
} 
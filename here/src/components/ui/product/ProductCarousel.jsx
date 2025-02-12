import React, { useState, useRef } from 'react';
import './product-carousel.scss';
import ProductCard from '../../../components/cards/product/ProductCard';

export default function ProductCarousel() {
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerRef = useRef(null);

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

    const products = [
        {
            id: 1,
            name: "Oued Fès Gold",
            price: "149.99 DH",
            image: "/images/products/ouedfes-1L.png",
            volume: "1L",
            brand: "Oued Fès"
        },
        {
            id: 3,
            name: "Huile Lousra",
            price: "199.99 DH",
            image: "/images/products/chourouk-25L.png",
            volume: "25L"

        },
        {
            id: 4,
            name: "Huile Lousra",
            price: "299.99 DH",
            image: "/images/products/dika-5L.png",
            volume: "5L"
        },
        {
            id: 5,
            name: "Huile Lousra",
            price: "299.99 DH",
            image: "/images/products/dika-500ML.png",
            volume: "500ML"
        },
        {
            id: 6,
            name: "Huile Lousra",
            price: "299.99 DH",
            image: "/images/products/nouarti-1L.png",
            volume: "1L"
        },
        {
            id: 7,
            name: "Huile Lousra",
            price: "299.99 DH",
            image: "/images/products/nouarti-2L.png",
            volume: "2L"
        },  
        {
            id: 8,
            name: "Huile Lousra",
            price: "299.99 DH",
            image: "/images/products/nouarti-5L.png",
            volume: "5L"
        }
    ];

    // Triple the products array to ensure seamless looping
    const duplicatedProducts = [...products, ...products, ...products];

    return (
        <div className="product-carousel">
            <div 
                ref={containerRef}
                className="product-container"
                style={{
                    animationPlayState: isPaused ? 'paused' : 'running',
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {duplicatedProducts.map((product, index) => (
                    <ProductCard
                        key={`${product.id}-${index}`}
                        productName={product.name}
                        productImg={product.image}
                        productVolume={product.volume}
                        productPrice={product.price}
                        theme="carousel"
                        onclick={(e) => {
                            if (!isDragging) {
                                console.log('Card clicked:', product);
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
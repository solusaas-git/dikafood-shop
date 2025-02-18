import React from 'react';
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import './carousel.scss';

export default function Carousel({ items, renderItem }) {
    return (
        <div className="carousel">
            <div className="carousel-track">
                {items.map((item, index) => (
                    <div key={item.id || index} className="carousel-item">
                        {renderItem(item)}
                    </div>
                ))}
            </div>

            <div className="carousel-controls">
                <button className="carousel-control prev" aria-label="Previous">
                    <CaretLeft weight="bold" />
                </button>
                <button className="carousel-control next" aria-label="Next">
                    <CaretRight weight="bold" />
                </button>
            </div>
        </div>
    );
} 
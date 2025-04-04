import "./accordion.scss";
import React, { useState } from 'react';
import { CaretDown, Plus, Minus } from "@phosphor-icons/react";

const Accordion = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? -1 : index);
    };

    return (
        <div className="accordion">
            {items.map((item, index) => (
                <div 
                    key={index} 
                    className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                >
                    <button
                        className="accordion-trigger"
                        onClick={() => toggleAccordion(index)}
                        aria-expanded={activeIndex === index}
                    >
                        <span className="accordion-title">{item.title}</span>
                        {activeIndex === index ? (
                            <Minus size={24} weight="bold" className="accordion-icon" />
                        ) : (
                            <Plus size={24} weight="bold" className="accordion-icon" />
                        )}
                    </button>
                    
                    <div className="accordion-content">
                        <div className="accordion-content-inner">
                            {item.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Accordion;

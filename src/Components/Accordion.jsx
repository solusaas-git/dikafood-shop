import "./accordion.scss";
import { ReactComponent as QuestionIcon } from "../assets/Question.svg"
import React, { useState } from 'react';

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(0);

    const handleToggle = (index) => {
        setOpenIndex(index);
    };

    return (
        <div className="accordions">
            <div className="accordion-container">
                {items.map((item, index) => (
                    <div key={index} className="accordion-item">
                        <div
                            className={index === openIndex ? "accordion-header active" :"accordion-header"}
                            onClick={() => handleToggle(index)}
                        >
                            <QuestionIcon />
                            <p>
                                {item.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {
                items.map((item, index) => {
                    if (openIndex === index) {
                        return (
                            <div className="accordion-content">
                                <p>
                                    {item.content}
                                </p>
                            </div>
                        )
                    }
                })
            }
        </div>
    );
};

export default Accordion;

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
                            className={index === openIndex ? "accordion-header active" : "accordion-header"}
                            onClick={() => handleToggle(index)}
                        >
                            <QuestionIcon />
                            <span className="header-text">
                                {item.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {
                items.map((item, index) => {
                    if (openIndex === index) {
                        return (
                            <div className="accordion-content" key={index}>
                                <div className="content-text">
                                    {item.content}
                                </div>
                            </div>
                        )
                    }
                    else return (<div key={index}></div>);
                })
            }
        </div>
    );
};

export default Accordion;

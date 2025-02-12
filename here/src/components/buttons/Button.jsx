import React from 'react';
import './button.scss'

export default function Button({ buttonName, buttonIcon, theme, size, link, btnRef, onClick }) {
    const classList = ["button-comp", size, theme]
    return (
        <button
            ref={btnRef}
            className={classList.join(" ")}
            onClick={(e) => {
                if (!(typeof onClick === "function")) {
                    return;
                }
                onClick(e);
            }}
        >
            <a href={link}>
                <p>
                    {buttonIcon}{buttonName}
                </p>
                <span>{buttonIcon}{buttonName}</span>
            </a>
        </button>
    )
}

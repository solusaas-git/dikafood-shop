import React from 'react';
import { Link } from 'react-router-dom';
import './button.scss';

const Button = ({ 
    name, 
    icon, 
    theme = 'primary',
    size = 'medium',
    to, 
    onClick,
    className,
    isActive,
    type = 'button',
    children 
}) => {
    const buttonClasses = [
        'button-comp',
        `button-comp-${theme}`,
        `button-comp-${size}`,
        isActive && 'active',
        className
    ].filter(Boolean).join(' ');

    const content = children || (
        <>
            {icon && icon}
            {name}
        </>
    );

    if (to) {
        return (
            <button className={buttonClasses}>
                <Link to={to}>{content}</Link>
            </button>
        );
    }

    return (
        <button 
            className={buttonClasses} 
            onClick={onClick}
            type={type}
        >
            {content}
        </button>
    );
};

export default Button;

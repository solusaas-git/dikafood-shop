import React from 'react';
import { CaretRight } from "@phosphor-icons/react";
import './btn.scss';

export default function Btn({ children, onClick, className }) {
    return (
        <button 
            className={`btn ${className || ''}`} 
            onClick={onClick}
        >
            {children}
            <CaretRight size={20} weight="bold" />
        </button>
    );
}

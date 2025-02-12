import React from 'react';
import './separator.scss';
import { Leaf } from "@phosphor-icons/react";

export default function Separator() {
    return (
        <div className="section-separator">
            <div className="separator-band">
                <div className="separator-content">
                    <div className="line"></div>
                    <div className="leaf-container">
                        <Leaf size={24} weight="fill" className="leaf" />
                    </div>
                    <div className="line"></div>
                </div>
            </div>
        </div>
    );
} 
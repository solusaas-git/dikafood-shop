import React from 'react';
import './steps-progress.scss';


const StepsProgress = ({ steps, currentStep }) => {
    return (
        <div className="steps-container">
            {steps.map((step, index) => (
                <div key={index} className="step" style={{backgroundColor : (index === (currentStep - 1) ? "#E2F0DB" : "#F2F2F2")}}>
                    <span
                        style={{
                            width: index < (currentStep - 1) ? '100%' : (index === (currentStep - 1) ? '25%' : '0%'),
                            backgroundColor: index < (currentStep - 1) ? 'var(--dark-green-8)' : (index === (currentStep - 1) ? 'var(--dark-green-8)' : 'transparent'),
                        }}
                    ></span>
                </div>
            ))}
        </div>
    );
};

export default StepsProgress;
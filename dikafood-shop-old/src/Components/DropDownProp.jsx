import React, { useEffect, useRef, useState } from 'react'
import { PiCaretDown } from 'react-icons/pi';
import "./drop-down-prop.scss"

export default function DropDownProp({ options, propertyName, defaultValue }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const dropDownRef = useRef()
    const handleClickOutside = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className="dropdown-prop" ref={dropDownRef}>
            <div className={isOpen ? "dropdown-toggle open" : "dropdown-toggle"} onClick={toggleDropdown}>
                <div className="parag">
                    <p>{propertyName}</p>
                </div>
                {selectedOption || defaultValue}
                <span className={isOpen ? 'arrow Up' : 'arrow'}>
                    <PiCaretDown className='arrow-up' />
                </span>
            </div>
            {isOpen && (
                <ul className="dropdown-menu">
                    {options.map((option, index) => (
                        <li key={index} onClick={() => {
                            handleOptionClick(option);
                        }}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

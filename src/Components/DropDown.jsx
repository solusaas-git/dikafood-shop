import "./drop-down.scss"
import { ReactComponent as ArrowIcon } from "../assets/arrow.svg"
import { useEffect, useRef, useState } from "react";


export default function DropDown({ options, defaultValue }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const classList = ["dropdown-toggle"]
    if (isOpen) {
        classList.push("open")
    }

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
        <div className="dropdown" ref={dropDownRef}>
            <div className={classList.join(" ")} onClick={toggleDropdown}>
                {selectedOption || defaultValue}
                <ArrowIcon className={isOpen ? 'arrow Up' : 'arrow'} />
            </div>
            {isOpen && (
                <ul className="dropdown-menu">
                    {options.map((option) => (
                        <li key={option.id} onClick={() => {
                            handleOptionClick(option.label);
                        }}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

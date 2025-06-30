import "./drop-down.scss"
import { useEffect, useRef, useState } from "react";
import { CaretUp } from "@phosphor-icons/react";


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
                <span className={isOpen ? 'arrow Up' : 'arrow'}>
                    <CaretUp weight="bold" />
                </span>

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

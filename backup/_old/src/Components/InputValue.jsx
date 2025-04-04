import { useState } from "react"
import "./input-value.scss"

export default function InputValue({defaultValue, labelName, inputName, option, inputRef, onChange}) {
    const classList = ["input-value", option]
    const [currentValue, setCurrentValue] = useState(defaultValue);
    const plus = (e) => {
        e.preventDefault();
        setCurrentValue(currentValue + 1);
    }
    const minus = (e) => {
        e.preventDefault();
        setCurrentValue(currentValue - 1);
    }
    return (
        <div className={classList.join(" ")}>
            <input type="number" id={inputName} name={inputName} value={currentValue} readOnly ref={inputRef} />
            <label htmlFor={inputName}>{labelName}</label>
            <button className="plus" onClick={(e)=>plus(e)}>+</button>
            <button disabled={currentValue === 1} className="minus" onClick={(e)=>minus(e)}>-</button>
        </div>
    )
}

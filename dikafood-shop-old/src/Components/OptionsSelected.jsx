import { PiArrowClockwise, PiCaretDown, PiCheck, PiTilde } from 'react-icons/pi'
import './options-selected.scss'
import { useEffect, useState } from 'react'

export default function OptionsSelected({ optionName, options, isSelectedOptions, setIsSelectedOptions }) {

    const onSelectOptions = (index) => {
        setIsSelectedOptions(prevState => {
            const newState = [...prevState]
            newState[index] = !newState[index]
            return newState
        })
    }

    const [theme, setTheme] = useState("")
    useEffect(() => {
        if (isSelectedOptions.every(o => o === true)) {
            setTheme("all")
        }
        else if (isSelectedOptions.some(o => o === true)) {
            setTheme("some")
        }
        else {
            setTheme("")
        }
    }, [isSelectedOptions, setTheme])

    const onSelectAll = () => {
        if (isSelectedOptions.every(o => o === true)) {
            setIsSelectedOptions(options.map((_, i) => false))
        }
        else {
            setIsSelectedOptions(options.map((_, i) => true))
        }
    }
    const onResetAll = () => {
        setIsSelectedOptions(options.map((_, i) => true))
    }
    const [isCollapse, setIsCollapse] = useState(false);
    return (
        <div className='options-selected-conatiner'>
            <div className="header">
                <div>
                    <span className={isCollapse ? "active" : ""} onClick={() => { setIsCollapse(p => !p) }}>
                        <PiCaretDown size={"16px"} />
                    </span>
                    <p>{optionName}</p>
                </div>
                <span className="icon" onClick={onResetAll}>
                    <PiArrowClockwise size={"16px"} />
                </span>
            </div>
            <div className={isCollapse ? "body collapse" :"body"}>
                <div className="option select-all" onClick={onSelectAll}>
                    <div className={`checkbox ${theme}`}>
                        {
                            theme === "" ?
                                <PiCheck size={"12"} color='#ccc' />

                                :
                                (
                                    theme === "all" ?
                                        <PiCheck size={"12"} color='white' />
                                        :
                                        <PiTilde size={"12"} color='white' />
                                )
                        }
                    </div>
                    <p>select All</p>
                </div>
                {
                    options.map((option, index) => (
                        <div className="option" key={index} onClick={() => onSelectOptions(index)}>
                            <div className={isSelectedOptions[index] === true ? "checkbox active" : "checkbox"}>
                                <PiCheck size={"12"} color={isSelectedOptions[index] === true ? "white" : "#ccc"} />
                            </div>
                            <p>{option}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

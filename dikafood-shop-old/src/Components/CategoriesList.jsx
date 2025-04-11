import { useState } from "react"
import "./categories-list.scss"
import { PiArrowLeft, PiArrowRight, PiGridFour, PiGridFourFill, PiTree, PiTreeEvergreen, PiTreeEvergreenFill, PiTreeFill, PiTreePalm, PiTreePalmFill } from 'react-icons/pi'

export default function CategoriesList() {
    const [currentCategIndex, setCurrentCategIndex] = useState(0);
    const categories = [
        { name: 'All', icon: <PiGridFour size={"20px"} color="var(--dark-green-8)" />, iconFill: <PiGridFourFill size={"20px"} color="var(--dark-green-8)" /> },
        { name: 'Category 1', icon: <PiTree size={"20px"} color="var(--dark-green-8)" />, iconFill: <PiTreeFill size={"20px"} color="var(--dark-green-8)" /> },
        { name: 'Category 2', icon: <PiTreePalm size={"20px"} color="var(--dark-green-8)" />, iconFill: <PiTreePalmFill size={"20px"} color="var(--dark-green-8)" /> },
        { name: 'Category 3', icon: <PiTreeEvergreen size={"20px"} color="var(--dark-green-8)" />, iconFill: <PiTreeEvergreenFill size={"20px"} color="var(--dark-green-8)" /> },
    ]
    return (
        <div className='categories-list'>
            <span>
                <PiArrowLeft size={"20px"} color="var(--dark-green-8)" />
            </span>
            <div className="categories">
                {
                    categories.map((categ, index) => (
                        <div 
                        key={index} 
                        className={index === currentCategIndex ? "active" : ""}
                        onClick={()=>setCurrentCategIndex(index)}>
                            <span>
                                {index === currentCategIndex ? categ.iconFill : categ.icon}
                            </span>
                            {categ.name}
                        </div>
                    ))
                }
            </div>
            <span>
                <PiArrowRight size={"20px"} color="var(--dark-green-8)" />
            </span>
        </div>
    )
}

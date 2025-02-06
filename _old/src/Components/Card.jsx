import { useEffect, useState } from "react";
import "./card.scss";

export default function Card({ options }) {
    const [isSelected , setIsSelected ] = useState([])
    useEffect(()=>{
        setIsSelected(options.map(()=>false))
    }, [options])

    const onSelect = (index) => {
        setIsSelected(prev => {
            const newSelected = new Array(prev.length).fill(false); 
            newSelected[index] = !prev[index]; 
            return newSelected;
        });
    };
    
    return (
        <>
            {
                options.map((option, index) => {
                    return (
                        <div className="card" key={index}>
                            <p>{option.title}</p>
                            <div className="options">
                                {
                                    option.options.map((option, index) => {
                                        return (
                                            <div 
                                            className={isSelected[index]? "option active" :"option"} 
                                            key={index}
                                            onClick={()=>onSelect(index)}
                                            >
                                                <div>
                                                    <span></span>
                                                </div>
                                                {option}
                                            </div>
                                        )
                                    }
                                    )
                                }
                            </div>
                        </div>
                    )
                })
            }
        </>

    )
}

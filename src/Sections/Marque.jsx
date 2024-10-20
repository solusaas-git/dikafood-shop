import React, { useState } from 'react'
import Tabs from '../Components/Tabs';
import { ReactComponent as Leaf } from "../assets/Leaf.svg"

import { SunHorizon, Waves, Plant } from "@phosphor-icons/react";
import "./marque.scss";

export default function Marque() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleClick = (index) => {
        setCurrentIndex(index);
    }
    const marques = [
        {
            title: "Chourouk",
            icon: <SunHorizon weight='regular' />,
            descp: "Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.",
            bgIcon: <SunHorizon width={250} height={250} weight='thin' className='icon' />,
            image1: "/images/sun-flower1.png",
            image2: "/images/sun-flower2.png"
        },
        {
            title: "OuadFes",
            icon: <Waves weight='regular' />,
            descp: "Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.",
            bgIcon: <Waves weight='thin' width={250} height={250} className='icon' />,
            image1: "/images/sun-flower1.png",
            image2: "/images/sun-flower2.png"
        },
        {
            title: "Dekafood",
            icon: <Plant weight='regular' />,
            descp: "Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.",
            bgIcon: <Plant width={250} height={250} weight='thin' className='icon' />,
            image1: "/images/sun-flower1.png",
            image2: "/images/sun-flower2.png"
        }
    ]
    return (
        <div className="marque-container">
            <div className='marque'>
                <div className="marque-title">
                    <span><Leaf weight='fill'
                     width={32}
                      height={32}
                      color='var(--dark-yellow-1)'
                      stroke='var(--dark-green-1)'
                       /></span>
                    <h2 className='title-small'>Nos Marques</h2>
                </div>
                <Tabs
                    titles={marques.map((marque) => ({ title: marque.title, icon: marque.icon }))}
                    currentIndex={currentIndex}
                    handleClick={handleClick}
                >
                    {
                        marques.map((marque, index) => (
                            <div className={index === currentIndex ? "content active" : "content"}>
                                <div className="text">
                                    <p>
                                        {marque.descp}
                                    </p>
                                </div>
                                {marque.bgIcon}
                                <div className="images">
                                    <img src={marque.image2} alt="" />
                                    <img src={marque.image1} alt="" />
                                </div>
                            </div>
                        ))
                    }
                </Tabs>
            </div>
        </div>
    )
}

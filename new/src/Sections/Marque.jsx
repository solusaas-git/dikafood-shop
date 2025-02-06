import React, { useState } from 'react'
import Tabs from '../Components/Tabs';
import { SunHorizon, Waves, Plant } from "@phosphor-icons/react";
import "./marque.scss";

export default function Marque() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleClick = (index) => {
        setCurrentIndex(index);
    }
    const marques = [
        
        {
            title: "Oued Fès",
            icon: <Waves weight='regular' />,
            descp: <p>
                Représentant l’essence même de la culture oléicole marocaine, Oued Fès vous offre une huile d’olive extra vierge aux notes fruitées et équilibrées. Issue d’un savoir-faire ancestral, cette huile respecte les méthodes traditionnelles de récolte et de pressage.<br/>
	<br/><b>•	Caractéristiques :</b> Saveur fruitée, production artisanale.
	<br/><b>•	Utilisation :</b> Parfait pour vos recettes les plus raffinées.
            </p>,
            bgIcon: <Waves weight='thin' width={250} height={250} className='icon' />,
            image1: "/images/ouedfes-logo.png",
            image2: "/images/ouedfes-bg.jpeg"
        },
        {
            title: "Biladi",
            icon: <Plant weight='regular' />,
            descp: <p>
                Biladi est une huile de grignons d’olive obtenue par extraction à partir des résidus d’olives. Légère et stable à haute température, elle est parfaite pour la cuisson quotidienne.<br/>
                <br/><b>•	Caractéristiques :</b> Riche en acides gras monoinsaturés, haute résistance à la chaleur.
                <br/><b>•	Utilisation :</b> Idéale pour la friture et les plats cuisinés.
            </p>,
            bgIcon: <Plant width={250} height={250} weight='thin' className='icon' />,
            image1: "/images/biladi-logo.png",
            image2: "/images/biladi-bg.jpeg"
        },
        {
            title: "Chourouk",
            icon: <SunHorizon weight='regular' />,
            descp: "Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.",
            bgIcon: <SunHorizon width={250} height={250} weight='thin' className='icon' />,
            image1: "/images/chourouk-logo.png",
            image2: "/images/chourouk-bg.jpeg"
        },
        {
            title: "Nouarati",
            icon: <SunHorizon weight='regular' />,
            descp: <p>
                L’huile de tournesol Nouarati est riche en vitamine E et en acides gras essentiels. Idéale pour la cuisson ou l’assaisonnement, elle se distingue par sa légèreté et sa pureté.<br/>
                <br/><b>•	Caractéristiques :</b> 100% naturelle, riche en nutriments.
                <br/><b>•	Utilisation :</b> Polyvalente, adaptée à tous types de cuisson.
            </p>,
            bgIcon: <SunHorizon width={250} height={250} weight='thin' className='icon' />,
            image1: "/images/nouarati-logo.png",
            image2: "/images/nouarati-bg.jpeg"
        },
        {
            title: "Dika Extra Vièrge",
            icon: <SunHorizon weight='regular' />,
            descp: <p>
                L’huile Dika est une huile d’olive extra vierge de qualité supérieure, obtenue par première pression à froid, à partir d’olives soigneusement sélectionnées dans les meilleurs vergers du Maroc. Grâce à sa richesse en antioxydants et ses saveurs intenses.<br/>
                <br/><b>•	Caractéristiques :</b> Pureté, pressée à froid, 100% naturelle.
                <br/><b>•	Utilisation :</b> Idéale pour assaisonner vos salades, grillades, et plats méditerranéens.
            </p>,
            bgIcon: <SunHorizon width={250} height={250} weight='thin' className='icon' />,
            image1: "/images/dika-logo.png",
            image2: "/images/dika-bg.jpeg"
        }
    ]
    return (
        <div className="marque-container">
            <div className='marque'>
                <div className="marque-title">
                    
                    <h2 className='title-small'>Nos Marques</h2>
                </div>
                <Tabs
                    titles={marques.map((marque) => ({ title: marque.title, icon: marque.icon }))}
                    currentIndex={currentIndex}
                    handleClick={handleClick}
                >
                    {
                        marques.map((marque, index) => (
                            <div key={index} className={index === currentIndex ? "content active" : "content"}>
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

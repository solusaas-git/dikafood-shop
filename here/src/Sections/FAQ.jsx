import Accordion from "../Components/Accordion";
import "./faq.scss";
import { Question } from "@phosphor-icons/react";
// import { Chats } from "@phosphor-icons/react"
 
export default function FAQ() {
    const items = [
        { title: "Quels types d'huiles proposez-vous chez DikaFood ?", content: <p>Nous offrons une gamme variée d'huiles de qualité supérieure :<br/>
            <br/><b>•	Huile d'olive extra vierge (marques Dika et Oued Fès)</b>
            <br/><b>•	Huile de tournesol (marque Nouarati)</b>
            <br/><b>•	Huile de grignons d'olive (marque Chourouk)</b>
            <br/><b>•	Huile de table</b></p> },
        { title: "Quelle est la particularité de votre huile d'olive extra vierge ?", content: "Notre huile d'olive extra vierge est obtenue par première pression à froid à partir d'olives soigneusement sélectionnées. Elle est pure, riche en antioxydants, et reconnue pour ses bienfaits pour la santé et ses saveurs équilibrées." },
        { title: "D'où proviennent vos huiles ?", content: "Nos huiles sont produites au Maroc, dans des régions réputées pour la qualité de leurs olives et graines, en utilisant des techniques respectueuses de l'environnement et des traditions locales." },
        { title: "Votre huile de tournesol est-elle adaptée à la cuisson ?", content: "Oui, notre huile de tournesol Nouarati est idéale pour la cuisson, la friture, et les préparations culinaires grâce à sa légèreté et sa haute résistance à la chaleur." },
        { title: "Proposez-vous des huiles biologiques ?", content: "Certaines de nos huiles, comme celles issues de la gamme Oued Fès, sont produites selon des pratiques proches de l'agriculture biologique, garantissant pureté et respect de l'environnement." },
        { title: "Pourquoi choisir vos huiles plutôt que d'autres ?", content: <p>Nos huiles se distinguent par :<br/>
            <br/><b>•	Une qualité premium issue de processus rigoureux.</b>
            <br/><b>•	Un respect des traditions marocaines et de l'environnement.</b>
            <br/><b>•	Une traçabilité et une transparence totale de la production à la mise en bouteille.</b></p> }
    ];
    return (
        <section className="faq-container">
            <div className="faq">
                <div className="faq-header">
                    <div className="title-container">
                        <div className="title-content">
                            <div className="title-wrapper">
                                <Question 
                                    size={48} 
                                    weight="duotone" 
                                    className="title-icon"
                                />
                                <h2>Questions Fréquentes</h2>
                            </div>
                            <p>Découvrez les réponses à vos questions sur nos huiles</p>
                        </div>
                    </div>
                </div>
                <Accordion items={items} />
            </div>
        </section>
    )
}

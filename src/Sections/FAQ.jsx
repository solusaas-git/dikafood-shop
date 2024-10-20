import Accordion from "../Components/Accordion";
import "./faq.scss";
import { ReactComponent as Chats } from "../assets/Chats.svg"
// import { Chats } from "@phosphor-icons/react"
 
export default function FAQ() {
    const items = [
        { title: "Comment est produite votre huile d'olive extra vierge ?", content: "1,Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk. Elle ajoute une profondeur unique à mes plats. Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk. Elle ajoute une profondeur unique à mes plats." },
        { title: "Comment est produite votre huile d'olive extra vierge ?", content: "2 Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk. Elle ajoute une profondeur unique à mes plats. Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk. Elle ajoute une profondeur unique à mes plats." },
        { title: "Comment est produite votre huile d'olive extra vierge ?", content: "3 Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk. Elle ajoute une profondeur unique à mes plats. Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk. Elle ajoute une profondeur unique à mes plats." },
        { title: "Comment est produite votre huile d'olive extra vierge ?", content: "4 Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk. Elle ajoute une profondeur unique à mes plats. Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk. Elle ajoute une profondeur unique à mes plats." }
    ];
    return (
        <div className="faq-container">
            <div className="faq">
                <div className="faq-header">
                    <span><Chats /></span>
                    <h2 className="title-small">Questions Fréquentes</h2>
                </div>
                <Accordion items={items} />
            </div>
        </div>
    )
}

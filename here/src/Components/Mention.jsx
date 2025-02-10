import "./mention.scss"
import Button from './Button'

export default function Mention() {
    const legalLinks = [
        { name: "Politique des cookies", link: "/cookies" },
        { name: "Mentions légales", link: "/legal" },
        { name: "Vie Privée", link: "/privacy" }
    ];

    return (
        <div className="mention-container">
            <div className="mention">
                <div className="copyright">
                    DikaFood © {new Date().getFullYear()} - tous droits réservés
                </div>
                <nav className="menu">
                    {legalLinks.map((item) => (
                        <Button 
                            key={item.link}
                            buttonName={item.name} 
                            link={item.link}
                            size="small" 
                            theme="button-comp-link green" 
                        />
                    ))}
                </nav>
            </div>
        </div>
    )
}

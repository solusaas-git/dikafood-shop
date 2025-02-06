import "./new-benefits.scss"
import { Tree, House, Medal, Leaf } from "@phosphor-icons/react";

export default function NewBenefits() {
    const benefits = [
        {
            Icon: <Tree size={32} weight="duotone" />,
            title: "Récolte Traditionnelle",
            descp: "Cueillette à la main pour préserver la qualité.",
        },
        {
            Icon: <House size={32} weight="duotone" />,
            title: "Pressage à Froid",
            descp: "Première pression à froid pour une huile riche en nutriments.",
        },
        {
            Icon: <Medal size={32} weight="duotone" />,
            title: "Qualité Premium",
            descp: "Un contrôle rigoureux à chaque étape.",
        },
        {
            Icon: <Leaf size={32} weight="duotone" />,
            title: "100% Naturel",
            descp: "Sans additifs ni conservateurs.",
        }
    ];

    return (
        <div className="new-benefits">
            <div className="container">
                <div className="section-header">
                    <h2>Notre Engagement Qualité</h2>
                    <p>Découvrez ce qui rend notre huile d'olive exceptionnelle</p>
                </div>
                <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="benefit-card">
                            <div className="content">
                                <div className="icon-wrapper">
                                    {benefit.Icon}
                                </div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.descp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

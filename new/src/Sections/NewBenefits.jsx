import "./new-benefits.scss"
import { ReactComponent as TreeIcon } from "../assets/tree.svg";
import { ReactComponent as HomeIcon } from "../assets/home.svg";
import { ReactComponent as Leaf } from "../assets/Leaf.svg"
import { ReactComponent as AuthenticIcon } from "../assets/authentique.svg";
import Benefit from "../Components/Benefit";
import Line from "../Components/Line";
import CurvedLine from "../Components/CurvedLine";
import { Fragment } from "react";

export default function NewBenefits() {
    const benefits = [
        {
            image1: "/images/image1.png",
            image2: "/images/image2.png",
            Icon: <TreeIcon />,
            title: "Récolte Manuelle",
            descp: "Nos olives sont cueillies à la main pour préserver toute leur fraîcheur et leur qualité."
        },
        {
            image1: "/images/image3.png",
            image2: "/images/image4.png",
            Icon: <HomeIcon />,
            title: "Pressage à Froid",
            descp: "Nos huiles d’olive sont obtenues par première pression à froid, un processus qui garantit une huile riche en nutriments."
        },
        {
            image1: "/images/image5.png",
            image2: "/images/image6.png",
            Icon: <AuthenticIcon />,
            title: "Engagement pour la Qualité",
            descp: "Nous contrôlons chaque étape du processus, de la culture à la mise en bouteille, pour vous offrir une huile exceptionnelle."
        }
    ]
    let theme = "";
    let lineTheme = "";
    return (
                        
        <div className="new-benefits">

            <Line theme={"top-left"} />
            <div className="container">
                <div className="benefits-container">
                    {
                        benefits.map((b, index) => {
                            if (index % 2 === 0) {
                                theme = "right"
                            }
                            else (
                                theme = "left"
                            )

                            if (index % 2 === 0) {
                                lineTheme = "left-to-right"
                            }
                            if (index % 2 !== 0) {
                                lineTheme = "right-to-left"
                            }
                            if (index === benefits.length - 1) {
                                lineTheme = "none"
                            }
                            return (
                                <Fragment key={index}>
                                    <Benefit
                                        theme={theme}
                                        key={index}
                                        img1={b.image1}
                                        img2={b.image2}
                                        icon={b.Icon}
                                        title={b.title}
                                        descp={b.descp} />
                                    <CurvedLine theme={lineTheme} />
                                </Fragment>
                            )
                        })
                    }
                </div>
            </div>
            <Line theme={(benefits.length - 1) % 2 === 0 ? "bottom-right" : "bottom-left"} />
        </div>
        
                        
        
    )
}

import "./new-benefits.scss"
import { ReactComponent as TreeIcon } from "../assets/tree.svg";
import { ReactComponent as HomeIcon } from "../assets/home.svg";
import { ReactComponent as AuthenticIcon } from "../assets/authentique.svg";
import Benefit from "../Components/Benefit";
import Line from "../Components/Line";
import CurvedLine from "../Components/CurvedLine";

export default function NewBenefits() {
    const benefits = [
        {
            image1: "/images/image1.png",
            image2: "/images/image2.png",
            Icon: <TreeIcon />,
            title: "Ouad Fes Huile d’Olive Extra Vièrge Le goût Authentique",
            descp: "Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats."
        },
        {
            image1: "/images/image3.png",
            image2: "/images/image4.png",
            Icon: <HomeIcon />,
            title: "Ouad Fes Huile d’Olive Extra Vièrge Le goût Authentique",
            descp: "Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats."
        },
        {
            image1: "/images/image5.png",
            image2: "/images/image6.png",
            Icon: <AuthenticIcon />,
            title: "Ouad Fes Huile d’Olive Extra Vièrge Le goût Authentique",
            descp: "Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats.Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.Elle ajoute une profondeur unique à mes plats."
        }
    ]
    let theme = "";
    let lineTheme = "";
    console.log(benefits.length - 1)
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
                                <>
                                    <Benefit
                                        theme={theme}
                                        key={index}
                                        img1={b.image1}
                                        img2={b.image2}
                                        icon={b.Icon}
                                        title={b.title}
                                        descp={b.descp} />
                                    <CurvedLine theme={lineTheme} />
                                </>
                            )
                        })
                    }
                </div>
            </div>
            <Line theme={(benefits.length - 1) % 2 === 0 ? "bottom-right" : "bottom-left"} />
        </div>
    )
}

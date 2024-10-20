import "./benefit.scss";

export default function Benefit({ theme, img1, img2, icon, title, descp }) {
    const classList = ["benefit", theme];
    return (
        <div className={classList.join(" ")}>
            <div className="images">
                <img src={img1} alt="" />
                <img src={img2} alt="" />
            </div>
            <div className="info">
                <div className="header">
                    <div className="lines">
                        <div className="line1"></div>
                        <div className="line2"></div>
                    </div>
                    <div className="icon">
                        {icon}
                    </div>
                </div>
                <div className="text">
                    <h5>{title}</h5>
                    <p>
                        {descp}
                    </p>
                </div>
            </div>
        </div>
    )
}

import { PiStarFill } from "react-icons/pi";
import "./card-review.scss";

export default function CardReview() {
    return (
        <div className="card-review-container">
            <div className="card-review">
                <div className="card-review-header">
                    <div className="rating">
                        <p>
                            Great Product
                        </p>
                        <div>
                            <span>
                                <PiStarFill color="#FF8000" fontSize={"12px"} />
                            </span>
                            4.8
                        </div>
                    </div>
                    <div className="info">
                        <p>Patrick Noah</p>
                        <p>Sept/2024</p>
                    </div>
                </div>
                <div className="card-review-comment">
                    <p>this is a card title this is a card title this is a card title this is a card title
                    this is a card title this is a card title</p>
                </div>
            </div>
        </div>
    )
}

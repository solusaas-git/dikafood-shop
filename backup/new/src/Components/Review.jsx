import "./review.scss";

export default function Review({ options}) {

    return (
        <>
            {options.map((option, i) => {
                const review = option;
                let theme = '';
                if(i % 2 !== 0 ){
                    theme = "reverse"
                }
                const classList = ["review", theme].join(" ");

                return (
                    <div key={i} className="review-content">
                        <div className={classList}>
                            <div className="review-header">
                                <div className="info-container">
                                    <img src={review.reviewImg} alt={`${review.reviewName}'s review`} />
                                    <div className="info">
                                        <p>{review.reviewName}</p>
                                        <img src={review.reviewRating} alt={`Rating: ${review.reviewRating}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="comment">
                                <p>{review.comment}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

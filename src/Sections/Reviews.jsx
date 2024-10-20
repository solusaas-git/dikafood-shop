import "./reviews.scss";
import reviewsInfo from "../data/reviews.json";
import { ReactComponent as ChatDots } from "../assets/chatDots.svg"
import Review from "../Components/Review";
import { useEffect, useRef, useState } from "react";


export default function Reviews() {
    const reviewsWrapperRef = useRef(null);
    const reviewsWrapper2Ref = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const wrapper = reviewsWrapperRef.current;
        const wrapper2 = reviewsWrapper2Ref.current;

        // Handle mouse events
        const handleMouseOver = () => setIsPaused(true);
        const handleMouseOut = () => setIsPaused(false);

        // Handle touch events
        const handleTouchStart = () => setIsPaused(true);
        const handleTouchEnd = () => setIsPaused(false);

        if (wrapper) {
            wrapper.addEventListener('mouseover', handleMouseOver);
            wrapper.addEventListener('mouseout', handleMouseOut);
            wrapper.addEventListener('touchstart', handleTouchStart);
            wrapper.addEventListener('touchend', handleTouchEnd);
        }

        if (wrapper2) {
            wrapper2.addEventListener('mouseover', handleMouseOver);
            wrapper2.addEventListener('mouseout', handleMouseOut);
            wrapper2.addEventListener('touchstart', handleTouchStart);
            wrapper2.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (wrapper) {
                wrapper.removeEventListener('mouseover', handleMouseOver);
                wrapper.removeEventListener('mouseout', handleMouseOut);
                wrapper.removeEventListener('touchstart', handleTouchStart);
                wrapper.removeEventListener('touchend', handleTouchEnd);
            }

            if (wrapper2) {
                wrapper2.removeEventListener('mouseover', handleMouseOver);
                wrapper2.removeEventListener('mouseout', handleMouseOut);
                wrapper2.removeEventListener('touchstart', handleTouchStart);
                wrapper2.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, []);
    
    return (
        <div className="reviews-div-container">
            <div className="reviews">
                <div className="container">
                    <div className="reviews-header">
                        <span>
                            <ChatDots
                                height={32}
                                width={32}
                                color="var(--dark-yellow-1)"
                                weight="fill"
                                stroke="var(--dark-green-1)"
                            />
                        </span>
                        <h2 className='title-small'>Customers Feedback</h2>
                    </div>
                    <div className="reviews-container">
                        <div
                            className="reviews-wrapper"
                            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                            ref={reviewsWrapperRef}>
                            <Review options={reviewsInfo} />
                        </div>
                        <div
                            className="reviews-wrapper2"
                            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                            ref={reviewsWrapper2Ref}>
                            <Review options={reviewsInfo} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

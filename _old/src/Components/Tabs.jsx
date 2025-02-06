import { Children, Fragment } from "react";
import "./tabs.scss";

export default function Tabs({ titles, currentIndex, handleClick, children }) {
    return (
        <div className="tabs-container">
            <div className="tabs">
                {
                    titles.map((title, index) => (
                        <div className={index === currentIndex ? "tab active" : "tab"}
                            key={index}
                            onClick={() => handleClick(index)}
                        >
                        {title.icon}
                        {title.title}
                        </div>
                    ))
                }
            </div>
            <div className="tabs-content">
                {
                    Children.map(children, child=>(
                        <Fragment key={child.key}>{child}</Fragment>
                    ))
                }
            </div>
        </div>
    )
}

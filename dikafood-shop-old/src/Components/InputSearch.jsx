import "./input-search.scss"
import { PiFunnel, PiMagnifyingGlass } from "react-icons/pi";

export default function InputSearch({ onOpen, isOpenFilter }) {
    return (
        <div className="input-search">
            <div className="input">
                <span>
                    <PiMagnifyingGlass size={"20px"} />
                </span>
                <input type="search" placeholder="search..." />
            </div>
            <div className="icons">
                <span onClick={onOpen} className={isOpenFilter ? "active" : ""}>
                    <PiFunnel size={"20px"} color={isOpenFilter ? "white" : "var(--dark-green-8)"} />
                    <p>filters</p>
                </span>
            </div>
        </div>
    )
}

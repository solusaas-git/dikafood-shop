import "./input-search.scss"
import { PiFunnel, PiMagnifyingGlass, PiSortAscending } from "react-icons/pi";

export default function InputSearch() {
    return (
        <div className="input-search">
            <div className="input">
                <span>
                    <PiMagnifyingGlass size={"20px"} color="var(--dark-green-6)" />
                </span>
                <input type="search" placeholder="Rechercher tous les produits" />
            </div>
            <div className="icons">
                <span>
                    <PiFunnel size={"20px"} color="var(--dark-green-6)" />
                </span>
                <span>
                    <PiSortAscending size={"20px"} color="var(--dark-green-6)" />
                </span>
            </div>
        </div>
    )
}

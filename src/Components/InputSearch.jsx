import "./input-search.scss"
import { ReactComponent as SearchIcon } from "../assets/search.svg";

export default function InputSearch() {
    return (
        <div className="input-search">
            <input type="search" placeholder="Rechercher tous les produits" />
            <SearchIcon />
        </div>
    )
}

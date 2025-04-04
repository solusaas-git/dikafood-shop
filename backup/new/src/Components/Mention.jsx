import "./mention.scss"
import Button from './Button'

export default function Mention() {
    return (
        <div className="mention-container">
            <div className="mention">
                <div className="copyright">DikaFood © 2024 - tous droits réservés</div>
                <div className="menu">
                    <Button buttonName={"Politique des cookies"} size={"small"} theme={"button-comp-link green"} />
                    <Button buttonName={"Mentions légales"} size={"small"} theme={"button-comp-link green"} />
                    <Button buttonName={"Vie Privée"} size={"small"} theme={"button-comp-link green"} />
                </div>
            </div>
        </div>
    )
}

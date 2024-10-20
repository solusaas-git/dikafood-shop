import Button from "../Components/Button"
import Field from "../Components/Field"
import "./form.scss"
import { DownloadSimple, At, User, Phone } from "@phosphor-icons/react";

export default function Form() {
    return (
        <div className="form-parent">
            <div className="form-container" id="form">
                <div>
                    <h2 className="title-small">telecharger le catalogue et decouvrir tous nos produits</h2>
                    <div>
                        <div className="bg"></div>
                        <img src="/images/oil.png" alt="" />
                    </div>
                </div>
                <h2 className="title-medium">telecharger le catalogue et decouvrir tous nos produits</h2>
                <form action="">
                    <div className="field-container">
                        <Field inputName={"Prénom"} Icon={<User size={"16px"} weight="regular" color="var(--dark-green-7)" />} placeholder={"prénom"} />
                        <Field inputName={"Nom"} Icon={<User size={"16px"} weight="regular" color="var(--dark-green-7)" />} placeholder={"nom"} />
                        <Field inputName={"email"} Icon={<At size={"16px"} weight="regular" color="var(--dark-green-7)" />} placeholder={"email"} />
                        <Field inputName={"numéro de téléphone"} Icon={<Phone size={"16px"} weight="regular" color="var(--dark-green-7)" />} placeholder={"numéro de téléphone"} />
                    </div>
                    <Button buttonIcon={<DownloadSimple size={"20px"} weight="regular" color="var(--dark-yellow-1)" />} buttonName={"Télécharger le catalogue"} theme={"button-comp-primary"} size={"button-comp-small"} />
                </form>
                <div className="img">
                    <div className="bg"></div>
                    <img src="/images/oil.png" alt="" />
                </div>

            </div>
        </div>
    )
}

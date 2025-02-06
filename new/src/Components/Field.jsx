import "./field.scss"

export default function Field({ Icon, inputName , placeholder}) {
    return (
        <div className="field">
            {Icon}
            <input type="text" id="inputField" name={inputName} placeholder={placeholder} required />
        </div>
    )
}

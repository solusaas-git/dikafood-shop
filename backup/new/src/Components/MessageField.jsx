import "./message-field.scss"
export default function MessageField({ icon, inputName, placeholder, btnName }) {
    return (
        <div className="message-field">
            <div>
                {icon}
                <textarea type="text" id="inputField" name={inputName} placeholder={placeholder} required />
            </div>
            <button>{icon}{btnName}</button>
        </div>
    )
}

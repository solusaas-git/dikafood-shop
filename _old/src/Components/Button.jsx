import './button.scss'

export default function Button({ buttonName, buttonIcon, theme, size, link, btnRef, onClick }) {
    const classList = ["button-comp", size, theme]
    return (
        <button
            ref={btnRef}
            className={classList.join(" ")}
            onClick={() => {
                if (!(typeof onClick === "function")) {
                    return;
                }
                onClick();
            }}
        >
            <a href={link}>
                <p>
                    {buttonIcon}{buttonName}
                </p>
                <span>{buttonIcon}{buttonName}</span>
            </a>
        </button>
    )
}

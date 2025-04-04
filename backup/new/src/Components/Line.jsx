import "./line.scss"

export default function Line({theme}) {
    const classList = ["line", theme]
    return (
        <div className={classList.join(" ")}>
        </div>
    )
}

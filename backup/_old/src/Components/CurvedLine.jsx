import "./curved-line.scss"

export default function CurvedLine({theme}) {
    const classList = ["curved-line", theme]
  return (
    <div className={classList.join(" ")}>
        <div></div>
        <div></div>
    </div>
  )
}

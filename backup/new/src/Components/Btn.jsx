import "./btn.scss"
import { ReactComponent as ArrowIcon } from "../assets/arrow.svg"

export default function Btn({ btnName, theme, onclick, isActive }) {
  const classList = ["btn", theme]
  if (isActive) {
    classList.push("active")
  }
  return (
    <button className={classList.join(" ")} onClick={() => {
      if (!(typeof onclick === "function")) { return; }
      onclick()
    }
    }>
      {btnName}
      <ArrowIcon className="arrow-icon" />
    </button>
  )
}

import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => document.body

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = antdResetCssText + tailwindcss
  return style
}

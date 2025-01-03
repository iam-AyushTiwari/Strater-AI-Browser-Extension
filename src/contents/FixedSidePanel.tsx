// import cssText from "data-text:~/contents/plasmo-overlay.css"
import PanelButtons from "components/PanelButtons"
import Providers from "components/Providers"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getStyle = () => {
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const PlasmoOverlay = () => {
  return (
    <Providers>
      <PanelButtons />
    </Providers>
  )
}

export default PlasmoOverlay

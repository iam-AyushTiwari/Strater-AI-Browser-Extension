import ChatBotDialog from "components/ChatBotDialog"
import Providers from "components/Providers"
import StraterAI from "components/StraterAI"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getStyle = () => {
  const baseFontSize = 12
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixels = parseFloat(remValue) * baseFontSize
    return `${pixels}px`
  })
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "strater-ai-chatbot"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const PlasmoOverlay = () => {
  return (
    <Providers>
      <StraterAI />
      <ChatBotDialog />
    </Providers>
  )
}

export default PlasmoOverlay

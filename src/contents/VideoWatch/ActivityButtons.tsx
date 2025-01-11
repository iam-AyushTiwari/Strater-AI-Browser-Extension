import { StyleProvider } from "@ant-design/cssinjs"
import Providers from "components/Providers"
import WatchVideoButtons from "components/WatchVideoButtons"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelectorAll("#above-the-fold #title")[0],
  insertPosition: "afterend"
})

export const getStyle = () => {
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "take-note-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const Main = () => {
  useEffect(() => {
    const buttons = document
      .querySelector("#take-note-csui")
      ?.shadowRoot?.querySelector("#plasmo-shadow-container")
    if (buttons !== undefined) {
      // @ts-ignore
      buttons.style.zIndex = "inherit"
    }
  }, [])
  return (
    <>
      <Providers>
        <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
          <WatchVideoButtons />
        </StyleProvider>
      </Providers>
    </>
  )
}

export default Main

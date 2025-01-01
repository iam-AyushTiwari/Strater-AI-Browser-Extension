import { StyleProvider } from "@ant-design/cssinjs"
import { Button, Modal, Space } from "antd"
import Folders from "components/Folders"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"

import { ThemeProvider } from "./theme"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelectorAll(
    ".style-scope.ytd-guide-section-renderer #header"
  )[0],
  insertPosition: "afterend"
})

export const getStyle = () => {
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "engage-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const Main = () => {
  return (
    <>
      <ThemeProvider>
        <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
          <div className="py-4 bg-inherit rounded-xl">
            <Folders />
          </div>
        </StyleProvider>
      </ThemeProvider>
    </>
  )
}

export default Main

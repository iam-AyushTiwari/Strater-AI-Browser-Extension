import { StyleProvider } from "@ant-design/cssinjs"
import Providers from "components/Providers"
import AddToBookmark from "components/videoPlayer/AddToBookmark"
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
  element: document.querySelector(".ytp-right-controls"),
  insertPosition: "beforebegin"
})

export const getStyle = () => {
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "take-bookmark-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const TakeNote = () => {
  useEffect(() => {
    const plusIcons = document.querySelectorAll("#take-bookmark-csui")

    if (plusIcons.length > 0) {
      plusIcons.forEach((plusIcon) => {
        const shadowContainer = plusIcon.shadowRoot?.querySelector(
          "#plasmo-shadow-container"
        ) as HTMLElement

        if (shadowContainer) {
          shadowContainer.style.zIndex = "inherit"
        }
      })
    }
  }, [])

  return (
    <Providers>
      <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
        <AddToBookmark />
      </StyleProvider>
    </Providers>
  )
}

export default TakeNote

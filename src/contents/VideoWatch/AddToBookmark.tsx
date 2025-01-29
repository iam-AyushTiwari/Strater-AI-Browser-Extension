import { StyleProvider } from "@ant-design/cssinjs"
import { Button, Tooltip } from "antd"
import NotesArea from "components/notesBar/NotesArea"
import Providers from "components/Providers"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import { Bookmark, Scissors } from "lucide-react"
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
        <div className="p-2 text-white flex justify-center items-center h-full">
          <Tooltip
            placement="top"
            title="Add to bookmark"
            className="cursor-pointer flex justify-center items-center mt-3 mx-2">
            <Bookmark size={24} />
          </Tooltip>
        </div>
      </StyleProvider>
    </Providers>
  )
}

export default TakeNote

import { StyleProvider } from "@ant-design/cssinjs"
import { Button } from "antd"
import NotesArea from "components/notesBar/NotesArea"
import Providers from "components/Providers"
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
  element: document.querySelector("#secondary .ytd-watch-flexy"),
  insertPosition: "beforebegin"
})

export const getStyle = () => {
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "take-note-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const TakeNote = () => {
  useEffect(() => {
    const plusIcons = document.querySelectorAll("#take-note-csui")

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
        <div className="w-full bg-neutral-900 border-2 border-zinc-800 rounded-xl text-white h-[800px] mb-2">
          <NotesArea />
        </div>
      </StyleProvider>
    </Providers>
  )
}

export default TakeNote

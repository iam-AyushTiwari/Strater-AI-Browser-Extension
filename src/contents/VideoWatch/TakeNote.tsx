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

export const getStyle = () => {
  const baseFontSize = 12
  const remRegex = /([\d.]+)rem/g
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  let newCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixels = parseFloat(remValue) * baseFontSize
    return `${pixels}px`
  })
  const style = document.createElement("style")
  style.textContent = antdResetCssText + newCssText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelector("#secondary.style-scope.ytd-watch-flexy"),
  insertPosition: "afterbegin"
})

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
    <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
      <Providers>
        <NotesArea />
      </Providers>
    </StyleProvider>
  )
}

export default TakeNote

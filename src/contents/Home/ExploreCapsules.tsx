import { StyleProvider } from "@ant-design/cssinjs"
import ExploreCapsules from "components/ExploreCapsules"
import FocusModeBtn from "components/FocusModeBtn"
import Folders from "components/Folders"
import Providers from "components/Providers"
import Switch from "components/Switch"
import { useRootContext } from "contextAPI/RootState"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelectorAll("#center")[0],
  insertPosition: "beforeend"
})

export const getStyle = () => {
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "explore-button-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const Main = () => {
  return (
    <>
      <Providers>
        <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
          <div className="px-4 flex gap-4 items-center justify-between">
            <ExploreCapsules />
            <FocusModeBtn />
            {/* <Switch /> */}
          </div>
        </StyleProvider>
      </Providers>
    </>
  )
}

export default Main

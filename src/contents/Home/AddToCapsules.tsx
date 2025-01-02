import { get } from "http"
import { StyleProvider } from "@ant-design/cssinjs"
import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import Providers from "components/Providers"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetInlineAnchorList,
  PlasmoGetShadowHostId
} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll("#dismissible #details")
  return Array.from(anchors).map((element) => ({
    element,
    insertPosition: "afterend"
  }))
}

export const getStyle = () => {
  let updatedCssText = tailwindcss.replaceAll(":root", ":host(plasmo-csui)")
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "add-to-capsules-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const Main = () => {
  return (
    <>
      <Providers>
        <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
          <div className="px-4 text-white absolute bottom-0 right-0">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </div>
        </StyleProvider>
      </Providers>
    </>
  )
}

export default Main

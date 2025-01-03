import { get } from "http"
import { inherits } from "util"
import { StyleProvider } from "@ant-design/cssinjs"
import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import Providers from "components/Providers"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
  PlasmoGetShadowHostId
} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

const HOST_ID = "add-to-capsules-csui"

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll("#dismissible #details")
  return Array.from(anchors).map((element, index) => {
    const shadowHostId = `${HOST_ID}-${index}`
    ;(element as HTMLElement).setAttribute("data-shadow-host-id", shadowHostId)
    return {
      element,
      insertPosition: "afterend"
    }
  })
}

export const getShadowHostId: PlasmoGetShadowHostId = (anchor) => {
  if (anchor instanceof HTMLElement) {
    return anchor.getAttribute("data-shadow-host-id") || HOST_ID
  }
  return HOST_ID
}

export const getStyle = (shadowHostId: string) => {
  const updatedCssText = tailwindcss.replaceAll(
    ":root",
    `:host(${shadowHostId})`
  )
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const Main = ({ shadowHostId }: { shadowHostId: string }) => {
  const container = document.getElementById(shadowHostId)?.shadowRoot

  if (container) {
    const style = getStyle(shadowHostId)
    if (!container.querySelector("style")) {
      container.appendChild(style) // Append styles only if they aren't already present
    }
  }

  return (
    <Providers>
      <StyleProvider container={container}>
        <div
          className="text-white absolute bottom-2 right-2 bg-red-500 rounded-full p-3 cursor-pointer"
          onClick={() => alert("Hello World!")}
          style={{ zIndex: "inherit !important" }}>
          {/* <Button type="primary" shape="circle" icon={<PlusOutlined />} /> */}
          <PlusOutlined style={{ fontSize: "10px", fontWeight: "bold" }} />
        </div>
      </StyleProvider>
    </Providers>
  )
}

export default Main

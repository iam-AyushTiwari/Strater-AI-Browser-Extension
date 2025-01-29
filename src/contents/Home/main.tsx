import { StyleProvider } from "@ant-design/cssinjs"
import { Button, Input, Popover } from "antd"
import Folders from "components/Folders"
import Providers from "components/Providers"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"
import { useEffect } from "react"
import { IoMdAdd } from "react-icons/io"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

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

const HOST_ID = "custom-sidebar-injected"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const Main = () => {
  // useEffect(() => {
  //   const head = document.querySelector("head")
  //   if (head) {
  //     const style = getStyle()
  //     head.appendChild(style)
  //     console.log("style added")
  //   } else {
  //     console.log("head not found")
  //   }
  // }, [])

  return (
    <>
      <Providers>
        <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
          <div className="py-4 gap-4 w-full">
            <div className="flex justify-between items-center text-white px-2">
              <span className="text-2xl">Capsules</span>
              <Popover
                zIndex={99999999999999999999}
                placement="left"
                content={
                  <div>
                    <Input
                      placeholder="Capsule Name"
                      style={{
                        width: 200,
                        border: "1px solid #ccc",
                        borderRadius: "5px"
                      }}
                    />
                    <Button type="primary" style={{ marginTop: "10px" }}>
                      Create
                    </Button>
                  </div>
                }
                trigger="click">
                <span className="cursor-pointer p-2 rounded-xl bg-zinc-700 hover:bg-zinc-600">
                  <IoMdAdd className="text-2xl" />
                </span>
              </Popover>
            </div>

            <Folders />
          </div>
        </StyleProvider>
      </Providers>
    </>
  )
}

export default Main

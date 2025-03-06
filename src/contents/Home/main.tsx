import { StyleProvider } from "@ant-design/cssinjs"
import { Button, Input, Popover, type TreeDataNode } from "antd"
import Folders from "components/Folders"
import Providers from "components/Providers"
import { MainContextProvider, useMainContext } from "contextAPI/MainContext"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"
import React, { useEffect, useState } from "react"
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
  return (
    <>
      <MainContextProvider>
        <Providers>
          <StyleProvider
            container={document.getElementById(HOST_ID).shadowRoot}>
            <div className="py-4 gap-4 w-full">
              <Folders />
            </div>
          </StyleProvider>
        </Providers>
      </MainContextProvider>
    </>
  )
}

export default Main

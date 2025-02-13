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

import Root from "./Root"

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
  // const [newItem, setNewItem] = useState<string | null>(null)
  // const [buttonClicked, setButtonClicked] = useState<boolean>(false)
  // const [treeData, setTreeData] = useState<TreeDataNode[]>([])
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

  // const handleCreateNewItem = (name: string) => {
  //   setNewItem(name) // Pass the new item name to Folders via prop
  //   setButtonClicked(true) // Set button clicked to true
  // }

  // useEffect(() => {
  //  storage.set("treeData",treeData)
  // },[])

  // const [passTreeData, setPassTreeData] = useState<TreeDataNode[]>([])

  // useEffect(() => {
  //   const fetchTreeData = async () => {
  //     const data:TreeDataNode[] = await storage.get("treeData");
  //     setPassTreeData(data);
  //   };
  //   fetchTreeData();
  // }, []);

  // console.log("passTreeData", passTreeData)

  return (
    <>
      <MainContextProvider>
        <Providers>
          <StyleProvider
            container={document.getElementById(HOST_ID).shadowRoot}>
            <div className="py-4 gap-4 w-full">
              <Folders />
            </div>
            <Root />
          </StyleProvider>
        </Providers>
      </MainContextProvider>
    </>
  )
}

export default Main

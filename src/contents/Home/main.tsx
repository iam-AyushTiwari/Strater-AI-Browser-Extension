import { StyleProvider } from "@ant-design/cssinjs"
import { Button, Input, Popover } from "antd"
import type { GetProps, TreeDataNode, TreeProps } from "antd"
import Folders from "components/Folders"
import Providers from "components/Providers"
import { RootStateProvider } from "contextAPI/RootState"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"
import { useEffect, useState } from "react"
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
  const [newItem, setNewItem] = useState<string | null>(null)
  const [buttonClicked, setButtonClicked] = useState<boolean>(false)
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
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

  const handleCreateNewItem = (name: string) => {
    setNewItem(name) // Pass the new item name to Folders via prop
    setButtonClicked(true) // Set button clicked to true
  }

  // useEffect(() => {
  //  storage.set("treeData",treeData)
  // },[])

  const [passTreeData, setPassTreeData] = useState<TreeDataNode[]>([])

  // useEffect(() => {
  //   const fetchTreeData = async () => {
  //     const data:TreeDataNode[] = await storage.get("treeData");
  //     setPassTreeData(data);
  //   };
  //   fetchTreeData();
  // }, []);

  console.log("passTreeData", passTreeData)

  return (
    <>
      <Providers>
        <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
          <div className="py-4 gap-4 w-full">
            <Folders
              newItem={buttonClicked ? newItem : null}
              onTreeUpdate={setTreeData}
              onItemAdded={() => {
                setNewItem(null)
                setButtonClicked(false)
              }}
            />
          </div>
        </StyleProvider>
      </Providers>
    </>
  )
}

export default Main

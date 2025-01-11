import { get } from "http"
import { PlusOutlined } from "@ant-design/icons"
import { Dropdown, FloatButton, Menu, type MenuProps } from "antd"
import Providers from "components/Providers"
import tailwindcss from "data-text:~style.css"
import antdResetCssText from "data-text:antd/dist/reset.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
  PlasmoGetShadowHostId
} from "plasmo"
import { useEffect } from "react"
import { BsClock, BsEye } from "react-icons/bs"
import { FaRegFolderOpen } from "react-icons/fa"

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

export const getStyle = (shadowHostId: string) => {
  const updatedCssText = tailwindcss.replaceAll(
    ":root",
    `:host(${shadowHostId})`
  )
  const style = document.createElement("style")
  style.textContent = antdResetCssText + updatedCssText
  return style
}

const HOST_ID = "add-to-button-csui"

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

const Main = () => {
  useEffect(() => {
    const plusIcons = document.querySelectorAll("#add-to-button-csui")

    if (plusIcons.length > 0) {
      plusIcons.forEach((plusIcon) => {
        const shadowContainer = plusIcon.shadowRoot?.querySelector(
          "#plasmo-shadow-container"
        ) as HTMLElement

        if (shadowContainer) {
          shadowContainer.style.zIndex = "inherit"
        }
      })
    } else {
      console.log("plusIcon not found")
    }
  }, [])

  const menuItems: MenuProps["items"] = [
    {
      label: (
        <div className="flex items-center justify-center">
          <FaRegFolderOpen className="text-xl mr-2" />
          <span>Add to Capsules</span>
        </div>
      ),
      key: "1"
    },
    {
      label: (
        <div className="flex items-center justify-center">
          <BsClock className="text-xl mr-2" />
          <span>Schedule Later</span>
        </div>
      ),
      key: "2"
    },
    {
      label: (
        <div className="flex items-center justify-center">
          <BsEye className="text-xl mr-2" />
          <span>Show Flash Card</span>
        </div>
      ),
      key: "3"
    }
  ]
  const menu = <Menu items={menuItems} className="text-white bg-slate-900" />

  return (
    <Providers>
      <Dropdown overlay={menu} trigger={["click"]}>
        <FloatButton
          shape="circle"
          className="text-white absolute bottom-2 right-2 bg-red-900 rounded-full p-2 cursor-pointer flex items-center justify-center"
          tooltip={"Strater Action"}
          icon={<PlusOutlined className="text-white text-2xl" />}
        />
      </Dropdown>
    </Providers>
  )
}

export default Main

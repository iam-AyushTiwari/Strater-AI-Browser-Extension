import { Drawer, FloatButton, Segmented, Tabs, type TabsProps } from "antd"
import tailwindcss from "data-text:~style.css"
import { Folder } from "lucide-react"
import React, { useEffect, useState } from "react"
import { BsBookmarks, BsLayoutTextSidebarReverse } from "react-icons/bs"
import { FaArrowRightFromBracket } from "react-icons/fa6"

import Providers from "./Providers"

const PanelButtons = () => {
  const onChange = (key: string) => {
    console.log(key)
  }
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <BsBookmarks className="text-white" />,
      children: "Folders"
    },
    {
      key: "2",
      label: <BsBookmarks className="text-white" />,
      children: "Notes Folder"
    },
    {
      key: "3",
      label: <BsBookmarks className="text-white" />,
      children: "Bookmarks"
    }
  ]

  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const shadowRoot = document.querySelector(".ant-drawer.ant-drawer-right")
    // const drawer = document.querySelector(".ant-drawer-mask")
    // const drawerStyle = document.createElement("style")
    // if (drawer) {
    //   drawerStyle.textContent = tailwindcss
    //   drawer.appendChild(drawerStyle)
    //   console.log("drawerStyle added")
    // } else {
    //   console.log("drawer not found")
    // }
    if (shadowRoot) {
      console.log("got the shadow root", shadowRoot)
      // @ts-ignore
      shadowRoot.style.zIndex = 99999999999
    } else {
      console.log("shadowRoot not found")
    }
  }, [open])
  return (
    <Providers>
      <Drawer
        placement="right"
        closable={false}
        onClose={onClose}
        style={{ backgroundColor: "#0f0f0f", color: "white" }}
        open={open}
        key={"top"}>
        <div className="py-4 flex items-center justify-center">
          <div
            className="bg-zinc-800 p-4 rounded-xl cursor-pointer hover:bg-zinc-700 absolute left-7"
            onClick={onClose}>
            <FaArrowRightFromBracket />
          </div>
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            indicator={{ size: (origin) => origin - 20 }}
            style={{ color: "white" }}
          />
        </div>
        <h1 className="text-red-500">Some content will appear here </h1>
      </Drawer>
      <div className="flex flex-col gap-4 top-32 right-5 fixed">
        {/* <FloatButton
          shape="circle"
          className="bg-inherit border-2 border-primary/60 flex items-center justify-center text-white rounded-full h-16 w-16 cursor-pointer"
          tooltip={"My Schedule"}
          icon={<GrSchedule className="text-white text-3xl" />}
          onClick={showDrawer}
        />
        <FloatButton
          shape="circle"
          className="bg-inherit border-2 border-primary/60 flex items-center justify-center text-white rounded-full h-16 w-16 cursor-pointer"
          tooltip={"Show Bookmarks"}
          icon={<BsBookmarks className="text-white text-3xl" />}
          onClick={showDrawer}
        /> */}
        <FloatButton
          shape="circle"
          className="bg-inherit border-2 border-primary/60 flex items-center justify-center text-white rounded-full h-16 w-16 cursor-pointer"
          tooltip={"Capsules Sidebar"}
          icon={<BsLayoutTextSidebarReverse className="text-white text-3xl" />}
          onClick={showDrawer}
        />
      </div>
    </Providers>
  )
}

export default PanelButtons

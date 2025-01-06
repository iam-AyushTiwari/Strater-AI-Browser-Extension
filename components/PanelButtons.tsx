import { Drawer, FloatButton } from "antd"
import React, { useEffect, useState } from "react"
import { BsBookmarks, BsLayoutTextSidebarReverse } from "react-icons/bs"
import { GrSchedule } from "react-icons/gr"

const PanelButtons = () => {
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const shadowRoot = document.querySelector(
      ".ant-drawer.ant-drawer-right.css-dev-only-do-not-override-hpgy62.ant-drawer-open"
    )
    if (shadowRoot) {
      console.log("got the shadow root", shadowRoot)
      // @ts-ignore
      shadowRoot.style.zIndex = 99999999999
    } else {
      console.log("shadowRoot not found")
    }
  }, [open])
  return (
    <div>
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
        key={"top"}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
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
    </div>
  )
}

export default PanelButtons

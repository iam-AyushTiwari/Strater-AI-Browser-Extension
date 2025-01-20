import { Drawer, FloatButton, Tabs, Tooltip, type TabsProps } from "antd"
import Folders from "components/Folders"
import tailwindcss from "data-text:~style.css"
import { BookmarkIcon, CloudCog, Edit3Icon, Folder, User } from "lucide-react"
import React, { useEffect, useState } from "react"
import { BsBookmarks, BsLayoutTextSidebarReverse } from "react-icons/bs"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import { HiArrowTurnRightDown } from "react-icons/hi2"

import { NotesFolder } from "./feed/NotesFolder"
import Providers from "./Providers"
import Account from "./sidebar/Account"
import Bookmark from "./sidebar/Bookmark"

const PanelButtons = () => {
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Tooltip title="Folders">
          <Folder className="text-white text-lg p-1" />
        </Tooltip>
      ),
      children: <Folders />
    },
    {
      key: "2",
      label: (
        <Tooltip title="Notes">
          <Edit3Icon className="text-white text-lg p-1" />
        </Tooltip>
      ),
      children: <NotesFolder />
    },
    {
      key: "3",
      label: (
        <Tooltip title="Bookmarks">
          <BookmarkIcon className="text-white text-lg p-1" />
        </Tooltip>
      ),
      children: <Bookmark />
    },
    {
      key: "4",
      label: (
        <Tooltip title="Account">
          <User className="text-white text-lg p-1" />
        </Tooltip>
      ),
      children: <Account />
    }
  ]

  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const shadowRoot = document.querySelector(".ant-drawer.ant-drawer-right")
    if (shadowRoot) {
      console.log("got the shadow root", shadowRoot)
      // @ts-ignore
      shadowRoot.style.zIndex = 99999999999
    } else {
      console.log("shadowRoot not found")
    }

    const sideBar = document.querySelector(".ant-drawer-body")
    if (sideBar && !applied) {
      // @ts-ignore
      const style = document.createElement("style")
      style.textContent = tailwindcss
      sideBar.appendChild(style)
      setApplied(true)
      console.log("got the sidebar", sideBar)
    } else {
      console.log("sideBar not found")
    }
  }, [open])

  return (
    <Providers>
      <Drawer
        placement="right"
        closable={false}
        onClose={onClose}
        zIndex={99999999999}
        // @ts-ignore
        getContainer={() => document.body}
        footer={
          <div className="rounded-lg w-full p-2 gap-2">
            <p className="text-center text-base flex items-center justify-center gap-2 text-zinc-300">
              Not connected to Strater yet? - Sync your contents to Strater
              <HiArrowTurnRightDown />
            </p>
            <div className="w-full bg-zinc-900 hover:bg-zinc-800/50 border-2 border-white mt-2 rounded-xl py-4 text-center cursor-pointer flex justify-center items-center gap-4">
              <CloudCog size={18} />
              <p>Connect to Strater</p>
            </div>
          </div>
        }
        style={{
          backgroundColor: "#0f0f0f",
          color: "white"
        }}
        open={open}
        key={"top"}>
        <Tooltip title={"Close"}>
          <div
            className="bg-zinc-800 p-3 rounded-xl cursor-pointer hover:bg-zinc-700 absolute z-[999999999999999] left-8 top-14"
            onClick={onClose}>
            <FaArrowRightFromBracket />
          </div>
        </Tooltip>
        <div className="flex justify-center items-center">
          <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            tabBarStyle={{
              borderRadius: "8px",
              overflow: "hidden"
            }}
            tabBarGutter={12}
            centered={true}
            style={{ color: "white", width: "100%" }}
          />
        </div>
      </Drawer>
      <div className="flex flex-col gap-4 top-32 right-5 fixed">
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

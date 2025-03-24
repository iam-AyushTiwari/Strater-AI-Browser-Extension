import { SyncOutlined } from "@ant-design/icons"
import { Drawer, FloatButton, Tabs, Tooltip, type TabsProps } from "antd"
import Folders from "components/Folders"
import tailwindcss from "data-text:~style.css"
import {
  BookmarkIcon,
  CloudCog,
  Edit3Icon,
  Folder,
  PanelRight,
  Plus,
  User
} from "lucide-react"
import React, { useEffect, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { BsBookmarks, BsLayoutTextSidebarReverse } from "react-icons/bs"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import { HiArrowTurnRightDown } from "react-icons/hi2"

import { Storage } from "@plasmohq/storage"

import { API_ENDPOINT, HOST_LINK } from "~constants"

import { NotesFolder } from "./feed/NotesFolder"
import Providers from "./Providers"
import Account from "./sidebar/Account"
import Bookmark from "./sidebar/Bookmark"

const storage = new Storage()

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
      children: (
        <>
          <Folders />
        </>
      )
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
  const [loader, setLoader] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      setLoader(true)
      const isUser = (await storage.get("user")) as any | undefined
      if (isUser !== undefined) {
        setUser(isUser)
        console.log("user in the storage: ", isUser)
        setLoader(false)
      } else {
        setUser(null)
        setLoader(false)
      }
    }
    fetchUser()
  }, [storage.get])

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
          !user ? (
            <div className="rounded-lg w-full p-2 gap-2">
              <p className="text-center text-base flex items-center justify-center gap-2 text-zinc-300">
                Not connected to Strater yet? - Sync your contents to Strater
                <HiArrowTurnRightDown />
              </p>
              <div
                className="w-full bg-zinc-900 hover:bg-zinc-800/50 border-2 border-white mt-2 rounded-xl py-4 text-center cursor-pointer flex justify-center items-center gap-4"
                onClick={() =>
                  window.open(
                    `${HOST_LINK}/sign-in?redirect_url=https%3A%2F%2Fwww.youtube.com`,
                    "_blank"
                  )
                }>
                <CloudCog size={18} />
                <p>Connect to Strater</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl w-full p-4 bg-zinc-900 shadow-lg border border-zinc-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="rounded-full h-16 w-16 bg-gradient-to-br from-slate-700 to-slate-600 text-white text-2xl font-semibold flex items-center justify-center shadow-md border border-zinc-800">
                      {user?.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-4 w-4 border-2 border-zinc-900"></div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">
                      {user?.fullName}
                    </p>
                    <p className="text-zinc-500 text-sm">{user?.email}</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2 shadow-md">
                  <SyncOutlined className="animate-spin" />
                  <span>Sync</span>
                </button>
              </div>
            </div>
          )
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
        <div className="flex justify-center items-center relative">
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
            style={{
              color: "white",
              width: "100%"
            }}
          />
        </div>
      </Drawer>
      <Tooltip title={"Strater Sidebar"} placement="left">
        <div
          className="gap-4 top-32 right-5 fixed bg-inherit border-2 border-primary/60 flex items-center justify-center text-white rounded-full h-16 w-16 cursor-pointer"
          onClick={showDrawer}>
          <PanelRight className="text-white" size={18} />
        </div>
      </Tooltip>
    </Providers>
  )
}

export default PanelButtons

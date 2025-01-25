import { Dropdown, Menu, Tree } from "antd"
import type { GetProps, TreeDataNode, TreeProps } from "antd"
import React, { useEffect, useState } from "react"
import { AiOutlineVideoCameraAdd } from "react-icons/ai"
import { IoColorPaletteOutline } from "react-icons/io5"
import {
  MdDeleteOutline,
  MdDriveFileRenameOutline,
  MdOndemandVideo
} from "react-icons/md"
import { RiFolderAddLine } from "react-icons/ri"

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>

const { DirectoryTree } = Tree

const menu = (
  <Menu>
    <Menu.Item key="1" icon={<RiFolderAddLine />}>
      Add Folder
    </Menu.Item>
    <Menu.Item key="2" icon={<AiOutlineVideoCameraAdd />}>
      Add Video
    </Menu.Item>
    <Menu.Item key="3" icon={<MdDriveFileRenameOutline />}>
      Rename
    </Menu.Item>
    <Menu.Item key="4" icon={<IoColorPaletteOutline />}>
      Change Color
    </Menu.Item>
    <Menu.Item key="5" icon={<MdDeleteOutline />}>
      Delete
    </Menu.Item>
  </Menu>
)

const onContextMenu: TreeProps["onContextMenu"] = (info) => {
  console.log("Trigger ContextMenu", info)
}

const treeData: TreeDataNode[] = [
  {
    title: (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          className="text-white bg-[#4d0a50] px-2 mb-1 rounded-lg flex items-center justify-between py-2"
          onContextMenu={onContextMenu}>
          <h2 className="break-words font-semibold line-clamp-1">
            Complete Web Development
          </h2>
          <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
            4 items
          </span>
        </div>
      </Dropdown>
    ),
    key: "0-0",
    className: "cursor-pointer",
    children: [
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="text-white bg-[#0a3b50] px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}>
              <h2 className="break-words font-semibold line-clamp-1">Basics</h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                2 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "0-0-0",
        className: "cursor-pointer",
        children: [
          {
            title: "How to start web dev",
            key: "0-0-0-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          }
        ]
      }
    ]
  }
]

const Folders: React.FC = () => {
  const onSelect: TreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info)
  }

  const onExpand: TreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info)
  }

  // fetching the capsuels data from teh backend andh thewo rld of thea

  const [capsules, setCapsules] = useState([])
  const [user, setUser] = useState([])

  useEffect(() => {
    fetch("https://strater-app.vercel.app/api/Capsules/fetch_capsules", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setCapsules(data)
      })
  }, [])

  useEffect(() => {
    fetch("https://strater-app.vercel.app/api/User/fetch_me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "https://www.youtube.com/"
      }
    }).then((res) => {
      res.json().then((data) => {
        setUser(data)
        console.log("user ******", data)
      })
    })
  }, [])

  useEffect(() => {
    console.log("User fetched from the beackend", user)
  }, [user])

  useEffect(() => {
    console.log("Capsules fetched from the beackend", capsules)
  }, [capsules])

  return (
    <Tree
      multiple
      draggable
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={treeData}
      // // @ts-ignore
      // titleRender={(value) => <span style={{ width: "100%" }}>{value}</span>}
      className="rounded-xl"
      style={{
        color: "white"
      }}
    />
  )
}

export default Folders

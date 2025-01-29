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

const handler = () => {}

const treeData: TreeDataNode[] = [
  {
    title: (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          className="text-white w-full bg-[#4d0a50] px-2 mb-1 rounded-lg flex items-center justify-between py-2"
          onContextMenu={onContextMenu}
          onClick={handler}
        >
          <h2 className="break-words font-semibold line-clamp-1">
            Complete Web Development
          </h2>
          <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
            8 items
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
              className="bg-[#28d8ff] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}
            >
              <h2 className="break-words font-semibold line-clamp-1">Basics</h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                3 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "0-0-0",
        className: "cursor-pointer px-2 py-2",
        children: [
         
          {
            title: (
              <Dropdown overlay={menu} trigger={["contextMenu"]}>
                <div
                  className="bg-[#ff6347] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
                  onContextMenu={onContextMenu}
                >
                  <h2 className="break-words font-semibold line-clamp-1">Advanced HTML</h2>
                  <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                    2 items
                  </span>
                </div>
              </Dropdown>
            ),
            key: "0-0-0-3",
            className: "cursor-pointer px-2 py-2",
            children: [
              {
                title: "HTML Forms",
                key: "0-0-0-3-0",
                isLeaf: true,
                switcherIcon: <MdOndemandVideo className="mt-2" />,
              },
              {
                title: "HTML5 Features",
                key: "0-0-0-3-1",
                isLeaf: true,
                switcherIcon: <MdOndemandVideo className="mt-2" />,
              },
            ],
          },
          {
            title: "How to start web dev",
            key: "0-0-0-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
          {
            title: "Introduction to HTML",
            key: "0-0-0-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
          {
            title: "CSS Basics",
            key: "0-0-0-2",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
        ],
      },
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#f28c28] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}
            >
              <h2 className="break-words font-semibold line-clamp-1">
                JavaScript
              </h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                2 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "0-0-1",
        className: "cursor-pointer px-2 py-2",
        children: [
          {
            title: "JavaScript Fundamentals",
            key: "0-0-1-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
          {
            title: "DOM Manipulation",
            key: "0-0-1-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
        ],
      },
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#50c878] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}
            >
              <h2 className="break-words font-semibold line-clamp-1">React</h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                2 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "0-0-2",
        className: "cursor-pointer px-2 py-2",
        children: [
          {
            title: "React Basics",
            key: "0-0-2-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
          {
            title: "State and Props",
            key: "0-0-2-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
        ],
      },
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#db7093] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}
            >
              <h2 className="break-words font-semibold line-clamp-1">API</h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                1 item
              </span>
            </div>
          </Dropdown>
        ),
        key: "0-0-3",
        className: "cursor-pointer px-2 py-2",
        children: [
          {
            title: "Fetching Data with API",
            key: "0-0-3-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
        ],
      },
    ],
  },
];

const Folders: React.FC = () => {
  const onSelect: TreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info)
  }

  const onExpand: TreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info)
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search Capsules..."
        className="w-full p-3 text-white bg-zinc-800 rounded-xl outline-none text-2xl placeholder:text-gray-400 my-2"
      />

      <Tree
        multiple
        draggable
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
        blockNode={true}
        // // @ts-ignore
        // titleRender={(value) => <span style={{ width: "100%" }}>{value}</span>}
        className="rounded-xl mt-1 mb-1 "
        style={{
          color: "white"
        }}
      />
    </>
  )
}

export default Folders

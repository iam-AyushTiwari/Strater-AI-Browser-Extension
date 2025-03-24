import { StyleProvider } from "@ant-design/cssinjs"
import { Button, Dropdown, Menu, Popover, Tooltip, Tree } from "antd"
import type { GetProps, TreeDataNode, TreeProps } from "antd"
import React, { useEffect, useState } from "react"
import { AiOutlineVideoCameraAdd } from "react-icons/ai"
import { IoMdAdd } from "react-icons/io"
import { IoColorPaletteOutline } from "react-icons/io5"
import {
  MdDeleteOutline,
  MdDriveFileRenameOutline,
  MdOndemandVideo
} from "react-icons/md"
import { RiFolderAddLine } from "react-icons/ri"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>

const popoverData = () => {
  return (
    <div style={{ 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.3rem',
      backgroundColor: '#0a0a0a',
      borderRadius:"2px",
      height:"100%"
    }}>
      <h1 style={{
        fontWeight: 600,
        color: '#ffffff',
        fontSize: '1.75rem',
        lineHeight: '1.5rem'
      }}>
        Add to Capsule
      </h1>
      
      <input style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        outline: 'none',
        border: '1px solid #333333',
        fontSize: '1.3rem',
        transition: 'all 0.2s',
      }}
        placeholder="Your Capsule Name"
      />
      
      <button style={{
        backgroundColor: '#FF0042',
        color: '#ffffff',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%',
        border: 'none',
        fontWeight: 500,
        fontSize: '1.1rem',
        transition: 'all 0.2s',
      }}>
        Add to Capsule
      </button>
    </div>
  )
}

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

const NotesData: TreeDataNode[] = [
  {
    title: (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          className="text-white w-full bg-[#4d0a50] px-2 mb-1 rounded-lg flex items-center justify-between py-2"
          onContextMenu={onContextMenu}
          onClick={handler}>
          <h2 className="break-words font-semibold line-clamp-1">
            Complete Web Development Notes
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
              onContextMenu={onContextMenu}>
              <h2 className="break-words font-semibold line-clamp-1">Basics Notes</h2>
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
                  onContextMenu={onContextMenu}>
                  <h2 className="break-words font-semibold line-clamp-1">
                    Advanced HTML Notes
                  </h2>
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
                title: "HTML Forms Notes",
                key: "0-0-0-3-0",
                isLeaf: true,
                switcherIcon: <MdOndemandVideo className="mt-2" />
              },
              {
                title: "HTML5 Features Notes",
                key: "0-0-0-3-1",
                isLeaf: true,
                switcherIcon: <MdOndemandVideo className="mt-2" />
              }
            ]
          },
          {
            title: "How to start web dev Notes",
            key: "0-0-0-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "Introduction to HTML Notes",
            key: "0-0-0-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "CSS Notes",
            key: "0-0-0-2",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          }
        ]
      },
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#f28c28] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}>
              <h2 className="break-words font-semibold line-clamp-1">
                JavaScript Notes
              </h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                3 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "0-0-1",
        className: "cursor-pointer px-2 py-2",
        children: [
          {
            title: "JavaScript Fundamentals Notes",
            key: "0-0-1-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "DOM Manipulation Notes",
            key: "0-0-1-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "ES6 Features Notes",
            key: "0-0-1-2",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          }
        ]
      },
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#50c878] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}>
              <h2 className="break-words font-semibold line-clamp-1">React</h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                3 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "0-0-2",
        className: "cursor-pointer px-2 py-2",
        children: [
          {
            title: "React Basics Notes",
            key: "0-0-2-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "State and Props Notes",
            key: "0-0-2-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "React Router Notes",
            key: "0-0-2-2",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          }
        ]
      },
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#db7093] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}>
              <h2 className="break-words font-semibold line-clamp-1">API Notes</h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                2 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "0-0-3",
        className: "cursor-pointer px-2 py-2",
        children: [
          {
            title: "Fetching Data with API Notes",
            key: "0-0-3-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "Axios Integration Notes",
            key: "0-0-3-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          }
        ]
      }
    ]
  },
  {
    title: (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          className="bg-[#2b6777] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
          onContextMenu={onContextMenu}>
          <h2 className="break-words font-semibold line-clamp-1">
            Data Science Mastery Notes
          </h2>
          <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
            4 items
          </span>
        </div>
      </Dropdown>
    ),
    key: "1-0",
    className: "cursor-pointer",
    children: [
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#ffab40] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}>
              <h2 className="break-words font-semibold line-clamp-1">
                Python Programming Notes
              </h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                2 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "1-0-0",
        className: "cursor-pointer px-2 py-2",
        children: [
          {
            title: "Introduction to Python Notes",
            key: "1-0-0-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "Data Structures in Python Notes",
            key: "1-0-0-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          }
        ]
      },
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#ffa726] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}>
              <h2 className="break-words font-semibold line-clamp-1">
                Data Analysis Notes
              </h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                2 items
              </span>
            </div>
          </Dropdown>
        ),
        key: "1-0-1",
        className: "cursor-pointer px-2 py-2",
        children: [
          {
            title: "Introduction to Pandas Notes",
            key: "1-0-1-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          },
          {
            title: "Data Cleaning Techniques Notes",
            key: "1-0-1-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />
          }
        ]
      }
    ]
  }
]

// interface FoldersProps {
//   newItem: string | null
//   onItemAdded: () => void
//   onTreeUpdate: (data: TreeDataNode[]) => void
//   // treeData1: TreeDataNode[];
// }

const NotesFolders: React.FC = ({}) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchData, setSearchData] = useState<TreeDataNode[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [localTreeData, setLocalTreeData] = useState<TreeDataNode[]>(NotesData)

  // Handle new item prop changes
  // useEffect(() => {
  //   if (newItem) {
  //     const newTree = [
  //       ...treeData,
  //       {
  //         key: `new-${Date.now()}`,
  //         title: (
  //           <Dropdown overlay={menu} trigger={["contextMenu"]}>
  //             <div className="bg-[#ffa726] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2">
  //               <h2 className="break-words font-semibold line-clamp-1">
  //                 {newItem}
  //               </h2>
  //               <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
  //                 0 items
  //               </span>
  //             </div>
  //           </Dropdown>
  //         ),
  //         children: []
  //       }
  //     ]
  //     // treeData = newTree;
  //     setLocalTreeData(newTree)
  //     onTreeUpdate(newTree) // Pass updated tree back
  //     onItemAdded()
  //   }
  // }, [newItem])

  console.log("tree data hun123", NotesData)

  const onSelect: TreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info)
  }

  const onExpand: TreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info)
  }

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log(info)
  }

  const filterTreeData = (
    data: TreeDataNode[],
    term: string
  ): TreeDataNode[] => {
    return data
      .map((node) => {
        let matchesSearch = false

        if (React.isValidElement(node.title)) {
          const titleElement = node.title as React.ReactElement
          const h2Element = titleElement.props?.children?.props?.children[0]
          if (React.isValidElement(h2Element) && h2Element.type === "h2") {
            const titleText = (h2Element as React.ReactElement).props.children
              .toString()
              .toLowerCase()
            matchesSearch = titleText.includes(term.toLowerCase())
          }
        } else if (typeof node.title === "string") {
          matchesSearch = node.title.toLowerCase().includes(term.toLowerCase())
        }

        const filteredChildren = node.children
          ? filterTreeData(node.children, term)
          : []

        if (matchesSearch) {
          // If the node matches, return it with all its original children
          return {
            ...node,
            expanded: term !== ""
          }
        } else if (filteredChildren.length > 0) {
          // If any children match, return the node with filtered children
          return {
            ...node,
            children: filteredChildren,
            expanded: term !== ""
          }
        }
        return null
      })
      .filter(Boolean) as TreeDataNode[]
  }

  useEffect(() => {
    const filteredData = filterTreeData(NotesData, searchTerm)
    setSearchData(filteredData)
  }, [searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <>
      <StyleProvider
        container={
          document.getElementById("custom-sidebar-injected").shadowRoot
        }>
        <div className="flex justify-between items-center text-white px-2">
          <span className="text-2xl">Capsules</span>
          <Tooltip
            getPopupContainer={() =>
              // @ts-ignore
              document.querySelector("open-capsule")
            }
            placement="right"
            color="#0a0a0a"
            title={popoverData}
            trigger="click">
            <span className="cursor-pointer open-capsule p-2 rounded-xl bg-zinc-700 hover:bg-zinc-600">
              <IoMdAdd className="text-2xl" />
            </span>
          </Tooltip>
        </div>
      </StyleProvider>
      <input
        type="text"
        placeholder="Search Capsules..."
        className="w-full p-3 text-white bg-zinc-800 rounded-xl outline-none text-2xl placeholder:text-gray-400 my-2"
        value={searchTerm}
        onChange={handleSearch}
      />

      {searchTerm && (
        <div className="mb-4 bg-zinc-800 rounded-xl p-2">
          <h1 className="mt-1 mb-1 text-white text-2xl font-medium">
            Search Results...{" "}
          </h1>
          <Tree
            multiple
            draggable
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={searchData}
            blockNode={true}
            onDrop={onDrop}
            className="rounded-xl mt-1 mb-1"
            style={{
              color: "white"
            }}
          />
        </div>
      )}

      <Tree
        multiple
        draggable
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={NotesData} //will change
        blockNode={true}
        onDrop={onDrop}
        className="rounded-xl mt-1 mb-2"
        style={{
          color: "white"
        }}
      />
    </>
  )
}

export default NotesFolders


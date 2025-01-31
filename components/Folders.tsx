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
                  <h2 className="break-words font-semibold line-clamp-1">
                    Advanced HTML
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
            title: "CSS",
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
                3 items
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
          {
            title: "ES6 Features",
            key: "0-0-1-2",
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
                3 items
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
          {
            title: "React Router",
            key: "0-0-2-2",
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
                2 items
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
          {
            title: "Axios Integration",
            key: "0-0-3-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
        ],
      },
    ],
  },
  {
    title: (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          className="bg-[#2b6777] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
          onContextMenu={onContextMenu}
        >
          <h2 className="break-words font-semibold line-clamp-1">
            Data Science Mastery
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
              onContextMenu={onContextMenu}
            >
              <h2 className="break-words font-semibold line-clamp-1">
                Python Programming
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
            title: "Introduction to Python",
            key: "1-0-0-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
          {
            title: "Data Structures in Python",
            key: "1-0-0-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
        ],
      },
      {
        title: (
          <Dropdown overlay={menu} trigger={["contextMenu"]}>
            <div
              className="bg-[#ffa726] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
              onContextMenu={onContextMenu}
            >
              <h2 className="break-words font-semibold line-clamp-1">
                Data Analysis
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
            title: "Introduction to Pandas",
            key: "1-0-1-0",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
          {
            title: "Data Cleaning Techniques",
            key: "1-0-1-1",
            isLeaf: true,
            switcherIcon: <MdOndemandVideo className="mt-2" />,
          },
        ],
      },
    ],
  },
];



const Folders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchData, setSearchData] = useState<TreeDataNode[]>([])

  const onSelect: TreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info)
  }

  const onExpand: TreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info)
  }
  
  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info)
  }

  const filterTreeData = (data: TreeDataNode[], term: string): TreeDataNode[] => {
    return data.map(node => {
      let matchesSearch = false;
      
      if (React.isValidElement(node.title)) {
        const titleElement = node.title as React.ReactElement;
        const h2Element = titleElement.props?.children?.props?.children[0];
        if (React.isValidElement(h2Element) && h2Element.type === 'h2') {
          const titleText = (h2Element as React.ReactElement).props.children.toString().toLowerCase();
          matchesSearch = titleText.includes(term.toLowerCase());
        }
      } else if (typeof node.title === 'string') {
        matchesSearch = node.title.toLowerCase().includes(term.toLowerCase());
      }
  
      const filteredChildren = node.children ? filterTreeData(node.children, term) : [];
      
      if (matchesSearch) {
        // If the node matches, return it with all its original children
        return {
          ...node,
          expanded: term !== ''
        };
      } else if (filteredChildren.length > 0) {
        // If any children match, return the node with filtered children
        return {
          ...node,
          children: filteredChildren,
          expanded: term !== ''
        };
      }
      return null;
    }).filter(Boolean) as TreeDataNode[];
  };
  
  

  useEffect(() => {
    const filteredData = filterTreeData(treeData, searchTerm)
    setSearchData(filteredData)
  }, [searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search Capsules..."
        className="w-full p-3 text-white bg-zinc-800 rounded-xl outline-none text-2xl placeholder:text-gray-400 my-2"
        value={searchTerm}
        onChange={handleSearch}
      />

      {searchTerm && (
        <div className="mb-4 bg-zinc-800 rounded-xl p-2">
          <h1 className="mt-1 mb-1 text-white text-2xl font-medium">Search Results... </h1>
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
        treeData={treeData}
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

export default Folders

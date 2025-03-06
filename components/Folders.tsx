import { StyleProvider } from "@ant-design/cssinjs"
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Popover,
  Tooltip,
  Tree
} from "antd"
import type { GetProps, TreeDataNode, TreeProps } from "antd"
import { LoaderCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import { AiOutlineVideoCameraAdd } from "react-icons/ai"
import { HiH1 } from "react-icons/hi2"
import { IoMdAdd } from "react-icons/io"
import { IoColorPaletteOutline } from "react-icons/io5"
import {
  MdDeleteOutline,
  MdDriveFileRenameOutline,
  MdOndemandVideo
} from "react-icons/md"
import { RiFolderAddLine } from "react-icons/ri"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>

const popoverData = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="font-semibold">Add to Bookmark</h1>
      <input
        className="bg-zinc-950 text-xl text-white px-4 py-4 rounded-xl focus:outline-none"
        type="text"
        placeholder="Your Bookmark Name"
      />
      <Button type="primary" block>
        Add to Bookmark
      </Button>
    </div>
  )
}

// const treeData: TreeDataNode[] = [
//   {
//     title: (
//       <Dropdown overlay={menu} trigger={["contextMenu"]}>
//         <div
//           className="text-white w-full bg-[#4d0a50] px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//           onContextMenu={onContextMenu}
//           onClick={handler}>
//           <h2 className="break-words font-semibold line-clamp-1">
//             Complete Web Development
//           </h2>
//           <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//             8 items
//           </span>
//         </div>
//       </Dropdown>
//     ),
//     key: "0-0",
//     className: "cursor-pointer",
//     children: [
//       {
//         title: (
//           <Dropdown overlay={menu} trigger={["contextMenu"]}>
//             <div
//               className="bg-[#28d8ff] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//               onContextMenu={onContextMenu}>
//               <h2 className="break-words font-semibold line-clamp-1">Basics</h2>
//               <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//                 3 items
//               </span>
//             </div>
//           </Dropdown>
//         ),
//         key: "0-0-0",
//         className: "cursor-pointer px-2 py-2",
//         children: [
//           {
//             title: (
//               <Dropdown overlay={menu} trigger={["contextMenu"]}>
//                 <div
//                   className="bg-[#ff6347] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//                   onContextMenu={onContextMenu}>
//                   <h2 className="break-words font-semibold line-clamp-1">
//                     Advanced HTML
//                   </h2>
//                   <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//                     2 items
//                   </span>
//                 </div>
//               </Dropdown>
//             ),
//             key: "0-0-0-3",
//             className: "cursor-pointer px-2 py-2",
//             children: [
//               {
//                 title: "HTML Forms",
//                 key: "0-0-0-3-0",
//                 isLeaf: true,
//                 switcherIcon: <MdOndemandVideo className="mt-2" />
//               },
//               {
//                 title: "HTML5 Features",
//                 key: "0-0-0-3-1",
//                 isLeaf: true,
//                 switcherIcon: <MdOndemandVideo className="mt-2" />
//               }
//             ]
//           },
//           {
//             title: "How to start web dev",
//             key: "0-0-0-0",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "Introduction to HTML",
//             key: "0-0-0-1",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "CSS",
//             key: "0-0-0-2",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           }
//         ]
//       },
//       {
//         title: (
//           <Dropdown overlay={menu} trigger={["contextMenu"]}>
//             <div
//               className="bg-[#f28c28] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//               onContextMenu={onContextMenu}>
//               <h2 className="break-words font-semibold line-clamp-1">
//                 JavaScript
//               </h2>
//               <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//                 3 items
//               </span>
//             </div>
//           </Dropdown>
//         ),
//         key: "0-0-1",
//         className: "cursor-pointer px-2 py-2",
//         children: [
//           {
//             title: "JavaScript Fundamentals",
//             key: "0-0-1-0",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "DOM Manipulation",
//             key: "0-0-1-1",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "ES6 Features",
//             key: "0-0-1-2",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           }
//         ]
//       },
//       {
//         title: (
//           <Dropdown overlay={menu} trigger={["contextMenu"]}>
//             <div
//               className="bg-[#50c878] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//               onContextMenu={onContextMenu}>
//               <h2 className="break-words font-semibold line-clamp-1">React</h2>
//               <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//                 3 items
//               </span>
//             </div>
//           </Dropdown>
//         ),
//         key: "0-0-2",
//         className: "cursor-pointer px-2 py-2",
//         children: [
//           {
//             title: "React Basics",
//             key: "0-0-2-0",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "State and Props",
//             key: "0-0-2-1",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "React Router",
//             key: "0-0-2-2",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           }
//         ]
//       },
//       {
//         title: (
//           <Dropdown overlay={menu} trigger={["contextMenu"]}>
//             <div
//               className="bg-[#db7093] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//               onContextMenu={onContextMenu}>
//               <h2 className="break-words font-semibold line-clamp-1">API</h2>
//               <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//                 2 items
//               </span>
//             </div>
//           </Dropdown>
//         ),
//         key: "0-0-3",
//         className: "cursor-pointer px-2 py-2",
//         children: [
//           {
//             title: "Fetching Data with API",
//             key: "0-0-3-0",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "Axios Integration",
//             key: "0-0-3-1",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           }
//         ]
//       }
//     ]
//   },
//   {
//     title: (
//       <Dropdown overlay={menu} trigger={["contextMenu"]}>
//         <div
//           className="bg-[#2b6777] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//           onContextMenu={onContextMenu}>
//           <h2 className="break-words font-semibold line-clamp-1">
//             Data Science Mastery
//           </h2>
//           <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//             4 items
//           </span>
//         </div>
//       </Dropdown>
//     ),
//     key: "1-0",
//     className: "cursor-pointer",
//     children: [
//       {
//         title: (
//           <Dropdown overlay={menu} trigger={["contextMenu"]}>
//             <div
//               className="bg-[#ffab40] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//               onContextMenu={onContextMenu}>
//               <h2 className="break-words font-semibold line-clamp-1">
//                 Python Programming
//               </h2>
//               <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//                 2 items
//               </span>
//             </div>
//           </Dropdown>
//         ),
//         key: "1-0-0",
//         className: "cursor-pointer px-2 py-2",
//         children: [
//           {
//             title: "Introduction to Python",
//             key: "1-0-0-0",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "Data Structures in Python",
//             key: "1-0-0-1",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           }
//         ]
//       },
//       {
//         title: (
//           <Dropdown overlay={menu} trigger={["contextMenu"]}>
//             <div
//               className="bg-[#ffa726] w-full text-white px-2 mb-1 rounded-lg flex items-center justify-between py-2"
//               onContextMenu={onContextMenu}>
//               <h2 className="break-words font-semibold line-clamp-1">
//                 Data Analysis
//               </h2>
//               <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
//                 2 items
//               </span>
//             </div>
//           </Dropdown>
//         ),
//         key: "1-0-1",
//         className: "cursor-pointer px-2 py-2",
//         children: [
//           {
//             title: "Introduction to Pandas",
//             key: "1-0-1-0",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           },
//           {
//             title: "Data Cleaning Techniques",
//             key: "1-0-1-1",
//             isLeaf: true,
//             switcherIcon: <MdOndemandVideo className="mt-2" />
//           }
//         ]
//       }
//     ]
//   }
// ]

const Folders: React.FC = ({}) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchData, setSearchData] = useState<TreeDataNode[]>([])
  const [localTreeData, setLocalTreeData] = useState<TreeDataNode[]>([])
  const [loading, setLoading] = useState(true)

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [selectedCapsule, setSelectedCapsule] = useState(null)

  const showAddModal = (parentCapsule, isVideo = false) => {
    setSelectedCapsule(parentCapsule)
    setIsAddModalVisible(true)
  }

  const showRenameModal = (capsule) => {
    setSelectedCapsule(capsule)
    setIsRenameModalVisible(true)
  }

  const showDeleteModal = (capsule) => {
    setSelectedCapsule(capsule)
    setIsDeleteModalVisible(true)
  }

  const hideModals = () => {
    setIsAddModalVisible(false)
    setIsRenameModalVisible(false)
    setIsDeleteModalVisible(false)
    setSelectedCapsule(null)
  }

  const addCapsule = async (values) => {
    try {
      const newCapsule = {
        title: values.title,
        parentId: selectedCapsule?._id
      }
      const response = await sendToBackground({
        name: "capsules",
        body: { action: "ADD_CAPSULES", data: newCapsule }
      })
      if (response.success) {
        message.success("Capsule added successfully")
        setLocalTreeData(transformCapsulesToTreeDataNodes(response.data))
      } else {
        message.error("Failed to add capsule")
      }
    } catch (error) {
      console.error("Error adding capsule:", error)
      message.error("An error occurred while adding the capsule")
    }
    hideModals()
  }

  const renameCapsule = async (values) => {
    try {
      const updatedCapsule = { ...selectedCapsule, title: values.title }
      const response = await sendToBackground({
        name: "capsules",
        body: { action: "UPDATE_CAPSULE", data: updatedCapsule }
      })
      if (response.success) {
        message.success("Capsule renamed successfully")
        setLocalTreeData(transformCapsulesToTreeDataNodes(response.data))
      } else {
        message.error("Failed to rename capsule")
      }
    } catch (error) {
      console.error("Error renaming capsule:", error)
      message.error("An error occurred while renaming the capsule")
    }
    hideModals()
  }

  const deleteCapsule = async () => {
    try {
      const response = await sendToBackground({
        name: "capsules",
        body: { action: "DELETE_CAPSULE", data: { id: selectedCapsule._id } }
      })
      if (response.success) {
        message.success("Capsule deleted successfully")
        setLocalTreeData(transformCapsulesToTreeDataNodes(response.data))
      } else {
        message.error("Failed to delete capsule")
      }
    } catch (error) {
      console.error("Error deleting capsule:", error)
      message.error("An error occurred while deleting the capsule")
    }
    hideModals()
  }

  const menu = (capsule) => (
    <Menu>
      <Menu.Item
        key="1"
        icon={<RiFolderAddLine />}
        onClick={() => showAddModal(capsule)}>
        Add Folder
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<AiOutlineVideoCameraAdd />}
        onClick={() => showAddModal(capsule, true)}>
        Add Video
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<MdDriveFileRenameOutline />}
        onClick={() => showRenameModal(capsule)}>
        Rename
      </Menu.Item>
      <Menu.Item key="4" icon={<IoColorPaletteOutline />}>
        Change Color
      </Menu.Item>
      <Menu.Item
        key="5"
        icon={<MdDeleteOutline />}
        onClick={() => showDeleteModal(capsule)}>
        Delete
      </Menu.Item>
    </Menu>
  )

  const transformCapsulesToTreeDataNodes = (
    capsules: any[]
  ): TreeDataNode[] => {
    if (!Array.isArray(capsules)) {
      console.error("capsules is not an array:", capsules)
      return []
    }
    return capsules.map((capsule) => ({
      key: capsule._id,
      title: (
        <Dropdown overlay={menu(capsule)} trigger={["contextMenu"]}>
          <div
            className="text-white w-full bg-[#4d0a50] px-2 mb-1 rounded-lg flex items-center justify-between py-2"
            onContextMenu={(e) => e.preventDefault()}
            onClick={() => {}}>
            <h2 className="break-words font-semibold line-clamp-1">
              {capsule.title}
            </h2>
            <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
              {capsule.children
                ? `${capsule.children.length} items`
                : `${capsule.videos?.length || 0} items`}
            </span>
          </div>
        </Dropdown>
      ),
      children: capsule.children
        ? transformCapsulesToTreeDataNodes(capsule.children)
        : undefined,
      isLeaf: !(capsule.children && capsule.children.length > 0)
    }))
  }

  useEffect(() => {
    const fetchCapsules = async () => {
      console.log("Started fetching the capsules")
      setLoading(true)
      try {
        const response = await sendToBackground({
          name: "capsules",
          body: { action: "GET_CAPSULES" }
        })
        console.log("Response from the background:", response)

        if (response?.success && Array.isArray(response.data.data)) {
          const capsules = response.data as any[]
          console.log("Capsules fetched from background: FOLDERS363", capsules)
          const newTreeData: TreeDataNode[] =
            // @ts-ignore
            transformCapsulesToTreeDataNodes(capsules.data)
          setLocalTreeData(newTreeData)
          console.log("Transformed tree data:", newTreeData)
        } else {
          console.error("Invalid response data:", response?.data)
        }
      } catch (error) {
        console.error("Error fetching capsules:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCapsules()
  }, [])

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
    const filteredData = filterTreeData(localTreeData, searchTerm)
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
            color="#282828"
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

      {!loading ? (
        <Tree
          multiple
          draggable
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={localTreeData} //will change
          blockNode={true}
          onDrop={onDrop}
          className="rounded-xl mt-1 mb-2"
          style={{
            color: "white"
          }}
        />
      ) : (
        <>
          <div className="w-full h-full flex justify-center items-center p-4 mb-4">
            <LoaderCircle color="#a7005a" className="animate-spin" />
          </div>
        </>
      )}

      <Modal
        title="Add New Capsule"
        visible={isAddModalVisible}
        onCancel={hideModals}
        footer={null}>
        <Form onFinish={addCapsule}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}>
            <Input placeholder="Capsule Title" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Rename Modal */}
      <Modal
        title="Rename Capsule"
        visible={isRenameModalVisible}
        onCancel={hideModals}
        footer={null}>
        <Form
          onFinish={renameCapsule}
          initialValues={{ title: selectedCapsule?.title }}>
          <Form.Item
            name="title"
            rules={[
              { required: true, message: "Please input the new title!" }
            ]}>
            <Input placeholder="New Title" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Rename
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete Capsule"
        visible={isDeleteModalVisible}
        onOk={deleteCapsule}
        onCancel={hideModals}>
        <p>Are you sure you want to delete this capsule?</p>
      </Modal>
    </>
  )
}

export default Folders

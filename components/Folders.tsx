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
  Radio,
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

// Define allowed colors
const allowedColors = [
  "Red",
  "Pink",
  "Purple",
  "DeepPurple",
  "Indigo",
  "Blue",
  "LightBlue",
  "Cyan"
]

// Color mapping for visual display
const colorMap = {
  Red: "#f16c7f",
  Pink: "#ea94bb",
  Purple: "#b384bb",
  DeepPurple: "#7B6FED",
  Indigo: "#4886DD",
  Blue: "#23bfe7",
  LightBlue: "#a6ccf5",
  Cyan: "#67c6c0"
}

const popoverData = () => {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.3rem",
        backgroundColor: "#0a0a0a",
        borderRadius: "2px",
        height: "100%"
      }}>
      <h1
        style={{
          fontWeight: 600,
          color: "#ffffff",
          fontSize: "1.75rem",
          lineHeight: "1.5rem"
        }}>
        Add to Capsule
      </h1>

      <input
        style={{
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          outline: "none",
          border: "1px solid #333333",
          fontSize: "1.3rem",
          transition: "all 0.2s"
        }}
        placeholder="Your Capsule Name"
      />

      <button
        style={{
          backgroundColor: "#FF0042",
          color: "#ffffff",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
          border: "none",
          fontWeight: 500,
          fontSize: "1.1rem",
          transition: "all 0.2s"
        }}>
        Add to Capsule
      </button>
    </div>
  )
}

const Folders: React.FC = ({}) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchData, setSearchData] = useState<TreeDataNode[]>([])
  const [localTreeData, setLocalTreeData] = useState<TreeDataNode[]>([])
  const [loading, setLoading] = useState(true)

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isChangeColorModalVisible, setIsChangeColorModalVisible] =
    useState(false)
  const [selectedCapsule, setSelectedCapsule] = useState(null)

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

  const showAddModal = (parentCapsule, isVideo = false) => {
    setSelectedCapsule(parentCapsule)
    setIsAddModalVisible(true)
  }

  const showRenameModal = (capsule) => {
    setSelectedCapsule(capsule)
    setIsRenameModalVisible(true)
  }

  const showChangeColorModal = (capsule) => {
    setSelectedCapsule(capsule)
    setIsChangeColorModalVisible(true)
  }

  const showDeleteModal = (capsule) => {
    setSelectedCapsule(capsule)
    setIsDeleteModalVisible(true)
  }

  const hideModals = () => {
    setIsAddModalVisible(false)
    setIsRenameModalVisible(false)
    setIsDeleteModalVisible(false)
    setIsChangeColorModalVisible(false)
    setSelectedCapsule(null)
  }

  // Helper function to add a capsule to a parent in the tree
  const addCapsuleToParent = (treeData, parentId, newCapsule) => {
    return treeData.map((node) => {
      if (node.key === parentId) {
        // Found the parent, add the new capsule to its children
        return {
          ...node,
          children: [
            ...(node.children || []),
            transformCapsulesToTreeDataNodes([newCapsule])[0]
          ],
          isLeaf: false
        }
      } else if (node.children) {
        // Check children recursively
        return {
          ...node,
          children: addCapsuleToParent(node.children, parentId, newCapsule)
        }
      }
      return node
    })
  }

  // Helper function to update a capsule in the tree
  const updateCapsuleInTree = (treeData, capsuleId, updates) => {
    return treeData.map((node) => {
      if (node.key === capsuleId) {
        // Create a new node with updated properties
        const updatedNode = { ...node }

        // If we're updating the title or color, we need to update the title React element
        if (updates.title || updates.color) {
          const oldTitle = React.isValidElement(node.title)
            ? node.title.props.children.props.children[0].props.children
            : "Untitled"

          const newTitle = updates.title || oldTitle
          const newColor =
            updates.color ||
            (React.isValidElement(node.title)
              ? node.title.props.children.props.style.backgroundColor
              : "#b384bb")

          updatedNode.title = (
            <Dropdown overlay={menu(selectedCapsule)} trigger={["contextMenu"]}>
              <div
                className={`text-white w-full px-2 mb-1 rounded-lg flex items-center justify-between py-2`}
                style={{ cursor: "pointer", backgroundColor: newColor }}
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => {}}>
                <h2 className="break-words font-semibold line-clamp-1">
                  {newTitle}
                </h2>
                <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                  {getItemCount(selectedCapsule)} items
                </span>
              </div>
            </Dropdown>
          )
        }

        return updatedNode
      } else if (node.children) {
        // Check children recursively
        return {
          ...node,
          children: updateCapsuleInTree(node.children, capsuleId, updates)
        }
      }
      return node
    })
  }

  const addCapsule = async (values) => {
    try {
      const newCapsule = {
        title: values.title,
        parent: selectedCapsule?._id || null,
        color: colorMap[values.color] || colorMap.Purple
      }

      // Optimistically add to local state first for instant UI update
      const tempId = `temp-${Date.now()}`
      const tempCapsule = {
        _id: tempId,
        title: values.title,
        color: colorMap[values.color] || colorMap.Purple,
        children: [],
        videos: [],
        parentId: selectedCapsule?._id
      }

      // Clone current tree data and add new capsule
      let updatedTreeData = [...localTreeData]

      // If adding to a parent, find and update that parent
      if (selectedCapsule) {
        updatedTreeData = addCapsuleToParent(
          updatedTreeData,
          selectedCapsule._id,
          tempCapsule
        )
      } else {
        // Add to root level
        updatedTreeData.push(transformCapsulesToTreeDataNodes([tempCapsule])[0])
      }

      // Update UI immediately
      setLocalTreeData(updatedTreeData)

      console.log(
        "This we're sending to background to add capsule: ",
        newCapsule
      )
      const response = await sendToBackground({
        name: "capsules",
        body: { action: "ADD_CAPSULES", data: newCapsule }
      })

      if (response.success) {
        message.success("Capsule added successfully")
        // Update with the real data from the server
        setLocalTreeData(transformCapsulesToTreeDataNodes(response.data))
      } else {
        message.error("Failed to add capsule")
        // Revert the optimistic update
        fetchCapsules()
      }
    } catch (error) {
      console.error("Error adding capsule:", error)
      message.error("An error occurred while adding the capsule")
      // Revert the optimistic update
      fetchCapsules()
    }
    hideModals()
  }

  const renameCapsule = async (values) => {
    try {
      // Optimistically update UI
      const updatedTreeData = updateCapsuleInTree(
        localTreeData,
        selectedCapsule._id,
        {
          title: values.title
        }
      )
      setLocalTreeData(updatedTreeData)

      // Send to backend
      const response = await sendToBackground({
        name: "capsules",
        body: {
          action: "UPDATE_CAPSULE",
          data: {
            capsuleId: selectedCapsule._id,
            title: values.title
          }
        }
      })

      if (response.success) {
        message.success("Capsule renamed successfully")
      } else {
        message.error("Failed to rename capsule")
        fetchCapsules() // Revert changes
      }
    } catch (error) {
      console.error("Error renaming capsule:", error)
      message.error("An error occurred while renaming the capsule")
      fetchCapsules() // Revert changes
    }
    hideModals()
  }

  const changeColor = async (values) => {
    try {
      // Optimistically update UI
      const updatedTreeData = updateCapsuleInTree(
        localTreeData,
        selectedCapsule._id,
        {
          color: colorMap[values.color]
        }
      )
      setLocalTreeData(updatedTreeData)

      // Send to backend
      const response = await sendToBackground({
        name: "capsules",
        body: {
          action: "UPDATE_CAPSULE",
          data: {
            capsuleId: selectedCapsule._id,
            color: colorMap[values.color]
          }
        }
      })

      if (response.success) {
        message.success("Color updated successfully")
      } else {
        message.error("Failed to update color")
        fetchCapsules() // Revert changes
      }
    } catch (error) {
      console.error("Error updating color:", error)
      message.error("An error occurred while updating the color")
      fetchCapsules() // Revert changes
    }
    hideModals()
  }

  const deleteCapsule = async () => {
    try {
      const response = await sendToBackground({
        name: "capsules",
        body: {
          action: "DELETE_CAPSULE",
          data: {
            capsuleId: selectedCapsule._id
          }
        }
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
      <Menu.Item
        key="4"
        icon={<IoColorPaletteOutline />}
        onClick={() => showChangeColorModal(capsule)}>
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

  const getItemCount = (capsule) => {
    const childrenCount = capsule?.children ? capsule.children.length : 0
    const videosCount = capsule?.videos ? capsule.videos.length : 0
    return childrenCount + videosCount
  }

  const transformCapsulesToTreeDataNodes = (
    capsules: any[]
  ): TreeDataNode[] => {
    if (!Array.isArray(capsules)) {
      console.error("capsules is not an array:", capsules)
      return []
    }

    return capsules.map((capsule) => {
      // Create node for the capsule itself
      const node: TreeDataNode = {
        key: capsule._id,
        title: (
          <Dropdown overlay={menu(capsule)} trigger={["contextMenu"]}>
            <div
              className={`text-white w-full px-2 mb-1 rounded-lg flex items-center justify-between py-2`}
              style={{
                cursor: "pointer",
                backgroundColor: colorMap[capsule.color]
              }}
              onContextMenu={(e) => e.preventDefault()}
              onClick={() => {}}>
              <h2 className="break-words font-semibold line-clamp-1">
                {capsule.title}
              </h2>
              <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                {getItemCount(capsule)} items
              </span>
            </div>
          </Dropdown>
        ),
        children: [],
        isLeaf: false
      }

      // Add child capsules if they exist
      if (capsule.children && capsule.children.length > 0) {
        node.children = [...transformCapsulesToTreeDataNodes(capsule.children)]
      }

      // Add videos if they exist
      if (capsule.videos && capsule.videos.length > 0) {
        const videoNodes = capsule.videos.map((video) => ({
          key: `video-${video._id}`,
          title: video.title,
          isLeaf: true,
          switcherIcon: <MdOndemandVideo className="mt-2" />
        }))

        node.children = [...(node.children || []), ...videoNodes]
      }

      // If no children or videos, mark as leaf
      if (
        (!capsule.children || capsule.children.length === 0) &&
        (!capsule.videos || capsule.videos.length === 0)
      ) {
        node.isLeaf = true
        node.children = undefined
      }

      return node
    })
  }

  useEffect(() => {
    fetchCapsules()
  }, [])

  const onSelect: TreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info)
    const key = keys[0]?.toString() || ""
    if (key.startsWith("video-")) {
      // Handle video selection
      const videoId = key.replace("video-", "")
      console.log("Video selected:", videoId)
      // Add your video playback logic here
    } else {
      // Handle folder selection
      console.log("Folder selected:", key)
    }
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
      <StyleProvider>
        <div className="flex justify-between items-center text-white px-2">
          <span className="text-2xl">Capsules</span>
          <Tooltip
            // zIndex={999999999999999999999999999999999999999999999999999999999999999999999999999999999999999}
            getPopupContainer={() =>
              // @ts-ignore
              document.querySelector("open-capsule")
            }
            color={"#0a0a0a"}
            placement="right"
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
        <Form onFinish={addCapsule} initialValues={{ color: "Purple" }}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}>
            <Input placeholder="Capsule Title" />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please select a color!" }]}>
            <Radio.Group>
              {allowedColors.map((color) => (
                <Radio.Button
                  key={color}
                  value={color}
                  style={{
                    backgroundColor: colorMap[color],
                    marginRight: "5px",
                    marginBottom: "5px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "none"
                  }}
                />
              ))}
            </Radio.Group>
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

      <Modal
        title="Change Capsule Color"
        visible={isChangeColorModalVisible}
        onCancel={hideModals}
        footer={null}>
        <Form onFinish={changeColor} initialValues={{ color: "Purple" }}>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please select a color!" }]}>
            <Radio.Group>
              {allowedColors.map((color) => (
                <Radio.Button
                  key={color}
                  value={color}
                  style={{
                    backgroundColor: colorMap[color],
                    marginRight: "5px",
                    marginBottom: "5px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "none"
                  }}
                />
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Color
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Folders

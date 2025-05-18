"use client"

import { StyleProvider } from "@ant-design/cssinjs"
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Radio,
  Tooltip,
  Tree
} from "antd"
import type { GetProps, TreeDataNode, TreeProps } from "antd"
import { LoaderCircle } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { AiOutlineVideoCameraAdd } from "react-icons/ai"
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

// Add new capsule popover content
const AddCapsulePopover = ({ onAddCapsule }) => {
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("Purple")

  const handleSubmit = () => {
    if (!title.trim()) {
      message.error("Please enter a capsule name")
      return
    }
    onAddCapsule({ title, color })
    setTitle("")
  }

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
        Capsule Name
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {allowedColors.map((colorName) => (
          <div
            key={colorName}
            onClick={() => setColor(colorName)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: colorMap[colorName],
              cursor: "pointer",
              border: color === colorName ? "2px solid white" : "none"
            }}
          />
        ))}
      </div>

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
        }}
        onClick={handleSubmit}>
        Add new Capsule
      </button>
    </div>
  )
}

const Folders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchData, setSearchData] = useState<TreeDataNode[]>([])
  const [localTreeData, setLocalTreeData] = useState<TreeDataNode[]>([])
  const [loading, setLoading] = useState(true)
  const [capsuleCache, setCapsuleCache] = useState<Record<string, any>>({})

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isChangeColorModalVisible, setIsChangeColorModalVisible] =
    useState(false)
  const [selectedCapsule, setSelectedCapsule] = useState(null)
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  // Memoized function to transform capsules to tree data nodes
  const transformCapsulesToTreeDataNodes = useCallback(
    (capsules: any[]): TreeDataNode[] => {
      if (!Array.isArray(capsules)) {
        console.error("capsules is not an array:", capsules)
        return []
      }

      return capsules.map((capsule) => {
        // Cache the capsule data for quick access
        capsuleCache[capsule._id] = capsule

        // Create node for the capsule itself
        const node: TreeDataNode = {
          key: capsule._id,
          title: (
            <Dropdown
              overlay={() => menu(capsule)}
              trigger={["contextMenu"]}
              // @ts-ignore
              getPopupContainer={(triggerNode) => triggerNode.parentNode}>
              <div
                className={`text-white w-full px-2 mb-1 rounded-lg flex items-center justify-between py-2`}
                style={{
                  cursor: "pointer",
                  backgroundColor: colorMap[capsule.color] || "#b384bb"
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setSelectedCapsule(capsule)
                }}
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
          node.children = [
            ...transformCapsulesToTreeDataNodes(capsule.children)
          ]
        }

        // Add videos if they exist
        if (capsule.videos && capsule.videos.length > 0) {
          const videoNodes = capsule.videos.map((video) => ({
            key: `video-${video._id}`,
            title: (
              <div className="text-white px-2 py-1 flex items-center gap-2">
                <MdOndemandVideo className="text-gray-400" />
                <span className="line-clamp-1">{video.title}</span>
              </div>
            ),
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
    },
    [capsuleCache]
  )

  // Function to fetch capsules with caching
  const fetchCapsules = useCallback(
    async (forceRefresh = false) => {
      console.log("Started fetching the capsules")
      setLoading(true)

      try {
        // Try to get from cache first if not forcing refresh
        if (!forceRefresh) {
          const cachedCapsules = await storage.get("capsules")
          const cacheTimestamp = await storage.get("capsulesCacheTimestamp")

          // Use cache if it exists and is less than 5 minutes old
          if (
            cachedCapsules &&
            cacheTimestamp &&
            // @ts-ignore
            Date.now() - cacheTimestamp < 5 * 60 * 1000
          ) {
            console.log("Using cached capsules data")
            // @ts-ignore
            const newTreeData = transformCapsulesToTreeDataNodes(cachedCapsules)
            setLocalTreeData(newTreeData)
            setLoading(false)

            // Refresh in background
            refreshCapsulesInBackground()
            return
          }
        }

        // Fetch from API
        const response = await sendToBackground({
          name: "capsules",
          body: { action: "GET_CAPSULES" }
        })

        console.log("Response from the background:", response)

        if (
          response?.success &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          const capsules = response.data.data
          console.log("Capsules fetched from background:", capsules)

          // Update cache
          await storage.set("capsules", capsules)
          await storage.set("capsulesCacheTimestamp", Date.now())

          // Update UI
          const newTreeData = transformCapsulesToTreeDataNodes(capsules)
          setLocalTreeData(newTreeData)
        } else {
          console.error("Invalid response data:", response)
          message.error("Failed to fetch capsules")
        }
      } catch (error) {
        console.error("Error fetching capsules:", error)
        message.error("Error loading capsules")
      } finally {
        setLoading(false)
      }
    },
    [transformCapsulesToTreeDataNodes]
  )

  // Background refresh without blocking UI
  const refreshCapsulesInBackground = async () => {
    try {
      const response = await sendToBackground({
        name: "capsules",
        body: { action: "GET_CAPSULES", forceRefresh: true }
      })

      if (
        response?.success &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        const capsules = response.data.data

        // Update cache
        await storage.set("capsules", capsules)
        await storage.set("capsulesCacheTimestamp", Date.now())

        // Update UI without showing loading state
        const newTreeData = transformCapsulesToTreeDataNodes(capsules)
        setLocalTreeData(newTreeData)
      }
    } catch (error) {
      console.error("Background refresh error:", error)
    }
  }

  // Modal control functions
  const showAddModal = (parentCapsule, isVideo = false) => {
    setSelectedCapsule(parentCapsule)
    setIsAddingVideo(isVideo)
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
    setIsAddingVideo(false)
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
        // Get the capsule data
        const capsule = capsuleCache[capsuleId]
        if (!capsule) return node

        // Apply updates to the capsule
        const updatedCapsule = { ...capsule, ...updates }

        // Update cache
        capsuleCache[capsuleId] = updatedCapsule

        // Create updated node
        return {
          ...node,
          title: (
            <Dropdown
              overlay={() => menu(updatedCapsule)}
              trigger={["contextMenu"]}
              // @ts-ignore
              getPopupContainer={(triggerNode) => triggerNode.parentNode}>
              <div
                className={`text-white w-full px-2 mb-1 rounded-lg flex items-center justify-between py-2`}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    colorMap[updates.color] ||
                    colorMap[capsule.color] ||
                    "#b384bb"
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setSelectedCapsule(updatedCapsule)
                }}
                onClick={() => {}}>
                <h2 className="break-words font-semibold line-clamp-1">
                  {updates.title || capsule.title}
                </h2>
                <span className="text-sm opacity-80 font-medium ml-4 flex items-center">
                  {getItemCount(updatedCapsule)} items
                </span>
              </div>
            </Dropdown>
          )
        }
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

  // Helper function to remove a capsule from the tree
  const removeCapsuleFromTree = (treeData, capsuleId) => {
    return treeData
      .filter((node) => node.key !== capsuleId)
      .map((node) => {
        if (node.children) {
          return {
            ...node,
            children: removeCapsuleFromTree(node.children, capsuleId)
          }
        }
        return node
      })
  }

  // CRUD operations
  const addCapsule = async (values) => {
    try {
      const newCapsule = {
        title: values.title,
        parent: selectedCapsule?._id || null,
        color: values.color || "Purple"
      }

      // Optimistically add to local state first for instant UI update
      const tempId = `temp-${Date.now()}`
      const tempCapsule = {
        _id: tempId,
        title: values.title,
        color: values.color || "Purple",
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

      // Update cache
      const cachedCapsules = (await storage.get("capsules")) || []
      if (selectedCapsule) {
        // Find and update parent in cache
        const updateParentInCache = (capsules) => {
          return capsules.map((capsule) => {
            if (capsule._id === selectedCapsule._id) {
              return {
                ...capsule,
                children: [...(capsule.children || []), tempCapsule]
              }
            } else if (capsule.children && capsule.children.length > 0) {
              return {
                ...capsule,
                children: updateParentInCache(capsule.children)
              }
            }
            return capsule
          })
        }

        await storage.set("capsules", updateParentInCache(cachedCapsules))
      } else {
        // Add to root level in cache
        await storage.set("capsules", [...cachedCapsules, tempCapsule])
      }

      console.log("Sending to background to add capsule:", newCapsule)
      const response = await sendToBackground({
        name: "capsules",
        body: { action: "ADD_CAPSULES", data: newCapsule }
      })

      if (response.success) {
        message.success("Capsule added successfully")
        // Refresh to get the real data from the server
        fetchCapsules(true)
      } else {
        message.error("Failed to add capsule")
        // Revert the optimistic update
        fetchCapsules(true)
      }
    } catch (error) {
      console.error("Error adding capsule:", error)
      message.error("An error occurred while adding the capsule")
      // Revert the optimistic update
      fetchCapsules(true)
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

      // Update cache
      const cachedCapsules = (await storage.get("capsules")) || []
      const updateCapsuleInCache = (capsules) => {
        return capsules.map((capsule) => {
          if (capsule._id === selectedCapsule._id) {
            return {
              ...capsule,
              title: values.title
            }
          } else if (capsule.children && capsule.children.length > 0) {
            return {
              ...capsule,
              children: updateCapsuleInCache(capsule.children)
            }
          }
          return capsule
        })
      }

      await storage.set("capsules", updateCapsuleInCache(cachedCapsules))

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
        fetchCapsules(true) // Revert changes
      }
    } catch (error) {
      console.error("Error renaming capsule:", error)
      message.error("An error occurred while renaming the capsule")
      fetchCapsules(true) // Revert changes
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
          color: values.color
        }
      )
      setLocalTreeData(updatedTreeData)

      // Update cache
      const cachedCapsules = (await storage.get("capsules")) || []
      const updateCapsuleInCache = (capsules) => {
        return capsules.map((capsule) => {
          if (capsule._id === selectedCapsule._id) {
            return {
              ...capsule,
              color: values.color
            }
          } else if (capsule.children && capsule.children.length > 0) {
            return {
              ...capsule,
              children: updateCapsuleInCache(capsule.children)
            }
          }
          return capsule
        })
      }

      await storage.set("capsules", updateCapsuleInCache(cachedCapsules))

      // Send to backend
      const response = await sendToBackground({
        name: "capsules",
        body: {
          action: "UPDATE_CAPSULE",
          data: {
            capsuleId: selectedCapsule._id,
            color: values.color
          }
        }
      })

      if (response.success) {
        message.success("Color updated successfully")
      } else {
        message.error("Failed to update color")
        fetchCapsules(true) // Revert changes
      }
    } catch (error) {
      console.error("Error updating color:", error)
      message.error("An error occurred while updating the color")
      fetchCapsules(true) // Revert changes
    }
    hideModals()
  }

  const deleteCapsule = async () => {
    try {
      // Optimistically update UI
      const updatedTreeData = removeCapsuleFromTree(
        localTreeData,
        selectedCapsule._id
      )
      setLocalTreeData(updatedTreeData)

      // Update cache
      const cachedCapsules = (await storage.get("capsules")) || []
      const removeCapsuleFromCache = (capsules) => {
        return capsules
          .filter((capsule) => capsule._id !== selectedCapsule._id)
          .map((capsule) => {
            if (capsule.children && capsule.children.length > 0) {
              return {
                ...capsule,
                children: removeCapsuleFromCache(capsule.children)
              }
            }
            return capsule
          })
      }

      await storage.set("capsules", removeCapsuleFromCache(cachedCapsules))

      // Send to backend
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
        // Refresh to get the real data from the server
        fetchCapsules(true)
      } else {
        message.error("Failed to delete capsule")
        fetchCapsules(true) // Revert changes
      }
    } catch (error) {
      console.error("Error deleting capsule:", error)
      message.error("An error occurred while deleting the capsule")
      fetchCapsules(true) // Revert changes
    }
    hideModals()
  }

  // Context menu for capsules
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

  // Helper function to get item count
  const getItemCount = (capsule) => {
    if (!capsule) return 0
    const childrenCount = capsule.children ? capsule.children.length : 0
    const videosCount = capsule.videos ? capsule.videos.length : 0
    return childrenCount + videosCount
  }

  // Handle adding a capsule from the popover
  const handleAddCapsuleFromPopover = async (values) => {
    await addCapsule(values)
  }

  // Tree event handlers
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

  const onDrop: TreeProps["onDrop"] = async (info) => {
    console.log("Drop info:", info)

    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split("-")
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    // Skip if dropping on itself
    if (dragKey === dropKey) {
      return
    }

    // Get the dragged node
    const draggedNode = findNodeInTree(localTreeData, dragKey)
    if (!draggedNode) return

    // If dropping into another node (as a child)
    if (dropPosition === 0) {
      try {
        // Optimistically update UI
        const updatedTreeData = moveNodeInTree(localTreeData, dragKey, dropKey)
        setLocalTreeData(updatedTreeData)

        // Send to backend
        const response = await sendToBackground({
          name: "capsules",
          body: {
            action: "UPDATE_CAPSULE",
            data: {
              capsuleId: dragKey,
              parent: dropKey
            }
          }
        })

        if (response.success) {
          message.success("Capsule moved successfully")
          // Update cache
          await fetchCapsules(true)
        } else {
          message.error("Failed to move capsule")
          fetchCapsules(true) // Revert changes
        }
      } catch (error) {
        console.error("Error moving capsule:", error)
        message.error("An error occurred while moving the capsule")
        fetchCapsules(true) // Revert changes
      }
    }
  }

  // Helper function to find a node in the tree
  const findNodeInTree = (treeData, key) => {
    for (const node of treeData) {
      if (node.key === key) {
        return node
      }
      if (node.children) {
        const found = findNodeInTree(node.children, key)
        if (found) return found
      }
    }
    return null
  }

  // Helper function to move a node in the tree
  const moveNodeInTree = (treeData, dragKey, dropKey) => {
    // Clone the tree data
    const data = [...treeData]

    // Find the dragged node and remove it from its original position
    let draggedNode = null
    const removeNode = (nodes) => {
      return nodes.filter((node) => {
        if (node.key === dragKey) {
          draggedNode = { ...node }
          return false
        }
        if (node.children) {
          node.children = removeNode(node.children)
        }
        return true
      })
    }

    const newData = removeNode(data)

    // Add the dragged node to its new position
    const addNode = (nodes) => {
      return nodes.map((node) => {
        if (node.key === dropKey) {
          return {
            ...node,
            children: [...(node.children || []), draggedNode],
            isLeaf: false
          }
        }
        if (node.children) {
          return {
            ...node,
            children: addNode(node.children)
          }
        }
        return node
      })
    }

    return addNode(newData)
  }

  // Search functionality
  const filterTreeData = (
    data: TreeDataNode[],
    term: string
  ): TreeDataNode[] => {
    if (!term) return data

    return data
      .map((node) => {
        let matchesSearch = false

        if (React.isValidElement(node.title)) {
          // Extract text from the React element
          const titleElement = node.title as React.ReactElement
          const titleText = extractTextFromReactElement(titleElement)
          matchesSearch = titleText.toLowerCase().includes(term.toLowerCase())
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
            expanded: true
          }
        } else if (filteredChildren.length > 0) {
          // If any children match, return the node with filtered children
          return {
            ...node,
            children: filteredChildren,
            expanded: true
          }
        }
        return null
      })
      .filter(Boolean) as TreeDataNode[]
  }

  // Helper function to extract text from React elements
  const extractTextFromReactElement = (element: React.ReactElement): string => {
    if (!element || !element.props) return ""

    const { children } = element.props

    if (!children) return ""

    if (typeof children === "string") return children

    if (Array.isArray(children)) {
      return children
        .map((child) => {
          if (typeof child === "string") return child
          if (React.isValidElement(child))
            return extractTextFromReactElement(child)
          return ""
        })
        .join(" ")
    }

    if (React.isValidElement(children)) {
      return extractTextFromReactElement(children)
    }

    return ""
  }

  // Update search results when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setSearchData([])
      return
    }

    const filteredData = filterTreeData(localTreeData, searchTerm)
    setSearchData(filteredData)
  }, [searchTerm, localTreeData])

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Initial data fetch
  useEffect(() => {
    fetchCapsules()

    // Set up periodic background refresh (every 2 minutes)
    const refreshInterval = setInterval(
      () => {
        refreshCapsulesInBackground()
      },
      2 * 60 * 1000
    )

    return () => clearInterval(refreshInterval)
  }, [fetchCapsules])

  return (
    <>
      <StyleProvider>
        <div className="flex justify-between items-center text-white px-2">
          <span className="text-2xl">Capsules</span>
          <Tooltip
            getPopupContainer={() => document.body}
            color={"#0a0a0a"}
            placement="right"
            title={
              <AddCapsulePopover onAddCapsule={handleAddCapsuleFromPopover} />
            }
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

      {searchTerm && searchData.length > 0 && (
        <div className="mb-4 bg-zinc-800 rounded-xl p-2">
          <h1 className="mt-1 mb-1 text-white text-2xl font-medium">
            Search Results
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

      {searchTerm && searchData.length === 0 && (
        <div className="mb-4 bg-zinc-800 rounded-xl p-4 text-white text-center">
          No capsules found matching "{searchTerm}"
        </div>
      )}

      {!loading ? (
        <Tree
          multiple
          draggable
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={localTreeData}
          blockNode={true}
          onDrop={onDrop}
          className="rounded-xl mt-1 mb-2"
          style={{
            color: "white"
          }}
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center p-4 mb-4">
          <LoaderCircle color="#a7005a" className="animate-spin" />
        </div>
      )}

      {/* Add Modal */}
      <Modal
        title={isAddingVideo ? "Add New Video" : "Add New Capsule"}
        visible={isAddModalVisible}
        onCancel={hideModals}
        footer={null}>
        <Form onFinish={addCapsule} initialValues={{ color: "Purple" }}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}>
            <Input
              placeholder={isAddingVideo ? "Video Title" : "Capsule Title"}
            />
          </Form.Item>

          {!isAddingVideo && (
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
          )}

          {isAddingVideo && (
            <Form.Item
              name="url"
              rules={[
                { required: true, message: "Please input the video URL!" }
              ]}>
              <Input placeholder="Video URL" />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isAddingVideo ? "Add Video" : "Add Capsule"}
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
        <p className="text-red-500">
          This will also delete all child capsules and videos.
        </p>
      </Modal>

      {/* Change Color Modal */}
      <Modal
        title="Change Capsule Color"
        visible={isChangeColorModalVisible}
        onCancel={hideModals}
        footer={null}>
        <Form
          onFinish={changeColor}
          initialValues={{ color: selectedCapsule?.color || "Purple" }}>
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

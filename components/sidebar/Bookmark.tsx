import { Dropdown, Input, Menu, message, Modal } from "antd"
import React, { useEffect, useState } from "react"
import { FaRegEye } from "react-icons/fa"
import { MdDeleteOutline, MdDriveFileRenameOutline } from "react-icons/md"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

interface BookmarkData {
  id: string
  videoId: string
  name: string
  time: number
  createdAt: string
}

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])

  useEffect(() => {
    const fetchBookmarks = async () => {
      const savedBookmarks = (await storage.get("bookmarks")) as BookmarkData[]
      setBookmarks(savedBookmarks || [])
    }

    fetchBookmarks()

    // Add listener for storage changes
    const handleStorageChange = async (changes) => {
      if (changes.bookmarks) {
        const newBookmarks = changes.bookmarks.newValue
        setBookmarks(newBookmarks || [])
      }
    }

    storage.watch({
      bookmarks: (c) => handleStorageChange({ bookmarks: c })
    })

    // Clean up the listener when the component unmounts
    return () => {
      storage.unwatch({
        bookmarks: handleStorageChange
      })
    }
  }, [])

  const updateBookmark = async (updatedBookmark: BookmarkData) => {
    try {
      const response = await sendToBackground({
        name: "bookmark",
        body: {
          action: "UPDATE_BOOKMARK",
          data: updatedBookmark
        }
      })

      if (response.success) {
        setBookmarks(
          bookmarks.map((b) =>
            b.id === updatedBookmark.id ? updatedBookmark : b
          )
        )
        message.success("Bookmark updated successfully")
      } else {
        message.error("Failed to update bookmark")
      }
    } catch (error) {
      message.error("An error occurred while updating the bookmark")
    }
  }

  const deleteBookmark = async (id: string) => {
    try {
      const response = await sendToBackground({
        name: "bookmark",
        body: {
          action: "DELETE_BOOKMARK",
          data: { id }
        }
      })

      if (response.success) {
        setBookmarks(bookmarks.filter((b) => b.id !== id))
        message.success("Bookmark deleted successfully")
      } else {
        message.error("Failed to delete bookmark")
      }
    } catch (error) {
      message.error("An error occurred while deleting the bookmark")
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-4">Bookmarks</h1>
      <div className="w-full flex flex-col justify-center items-center gap-4 mt-4">
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              {...bookmark}
              updateBookmark={updateBookmark}
              deleteBookmark={deleteBookmark}
            />
          ))
        ) : (
          <div className="flex items-center w-full rounded-lg overflow-hidden shadow-md bg-zinc-900 p-8 cursor-pointer">
            <span className="text-xl text-gray-200 ml-4">
              No bookmarks added yet.
            </span>
          </div>
        )}
      </div>
    </>
  )
}

const BookmarkCard = ({
  id,
  videoId,
  name,
  time,
  createdAt,
  updateBookmark,
  deleteBookmark
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [editedName, setEditedName] = useState(name)

  const openVideo = () => {
    window.open(
      `https://www.youtube.com/watch?v=${videoId}&t=${time}`,
      "_blank"
    )
  }

  const handleEdit = () => {
    updateBookmark({ id, videoId, name: editedName, time, createdAt })
    setIsEditModalVisible(false)
  }

  const handleDelete = () => {
    deleteBookmark(id)
    setIsDeleteModalVisible(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<FaRegEye />} onClick={openVideo}>
        View
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<MdDriveFileRenameOutline />}
        onClick={() => setIsEditModalVisible(true)}>
        Edit
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<MdDeleteOutline />}
        onClick={() => setIsDeleteModalVisible(true)}>
        Remove
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          className="flex items-center w-full rounded-lg overflow-hidden shadow-md bg-zinc-900 p-4 cursor-pointer"
          onClick={openVideo}>
          <p className="font-semibold text-base text-blue-500 bg-blue-900/20 rounded-full px-3 py-1">
            {formatTime(time)}
          </p>
          <span className="text-xl text-gray-200 ml-4">{name}</span>
        </div>
      </Dropdown>

      <Modal
        title="Edit Bookmark"
        visible={isEditModalVisible}
        onOk={handleEdit}
        onCancel={() => setIsEditModalVisible(false)}>
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="Enter new bookmark name"
          className="bg-zinc-950 text-xl text-white px-4 py-4 rounded-xl focus:outline-none"
        />
      </Modal>

      <Modal
        title="Delete Bookmark"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}>
        <p>Are you sure you want to delete this bookmark?</p>
      </Modal>
    </>
  )
}

export default Bookmark

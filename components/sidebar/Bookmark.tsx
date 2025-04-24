import { Dropdown, Input, Menu, message, Modal } from "antd"
import React, { useEffect, useState } from "react"
import { CiMenuKebab } from "react-icons/ci"
import { FaRegEye } from "react-icons/fa"
import { MdDeleteOutline, MdDriveFileRenameOutline } from "react-icons/md"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

interface BookmarkData {
  id: string
  videoTitle: string
  videoId: string
  name: string
  time: number
  createdAt: string
}

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null) // State to track the expanded card

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

  const bookmarksByVideoId = {}
  bookmarks.forEach((bookmark) => {
    if (!bookmarksByVideoId[bookmark.videoId]) {
      bookmarksByVideoId[bookmark.videoId] = []
    }
    bookmarksByVideoId[bookmark.videoId].push(bookmark)
  })

  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-4">Bookmarks</h1>
      <div className="flex items-center justify-center w-full h-full">
      <div className="w-full flex flex-col justify-center items-center gap-2 ">
        {bookmarks.length > 0 ? (
          Object.keys(bookmarksByVideoId).map((videoId) => (
            <BookmarkCard
              key={videoId}
              videoId={videoId}
              videoTitle={
                bookmarksByVideoId[videoId][0].videoTitle || "Untitled Video"
              }
              bookmarks={bookmarksByVideoId[videoId]}
              isExpanded={expandedCard === videoId}
              setExpandedCard={setExpandedCard}
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
      </div>
    </>
  )
}

const BookmarkCard = ({
  videoTitle,
  videoId,
  bookmarks,
  updateBookmark,
  deleteBookmark,
  isExpanded,
  setExpandedCard
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentBookmark, setCurrentBookmark] = useState(null)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [editedName, setEditedName] = useState<string>("")
  // const [isExpended,setIsExpended] = useState<boolean>(false)

  const openVideo = (bookmarkTime) => {
    window.location.href = `https://www.youtube.com/watch?v=${videoId}&t=${bookmarkTime}`
  }
  const handleEdit = () => {
    updateBookmark({ ...currentBookmark, name: editedName })
    setIsEditModalVisible(false)
  }

  const handleDelete = () => {
    deleteBookmark(currentBookmark.id)
    setIsDeleteModalVisible(false)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getBookmarkMenu = (bookmark) => (
    <Menu>
      <Menu.Item
        key="1"
        icon={<FaRegEye />}
        onClick={() => openVideo(bookmark.time)}>
        View
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<MdDriveFileRenameOutline />}
        onClick={() => {
          setEditedName(bookmark.name)
          setCurrentBookmark(bookmark)
          setIsEditModalVisible(true)
        }}>
        Edit
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<MdDeleteOutline />}
        onClick={() => {
          setIsDeleteModalVisible(true)
          setCurrentBookmark(bookmark)
        }}>
        Remove
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <div className="group w-full">
        {/* Video Title Header */}
        <div
          className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-t-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 gap-2"
          onClick={() => setExpandedCard(isExpanded ? null : videoId)}>
          <h3 className="font-bold text-white">
            {videoTitle.length > 20
              ? `${videoTitle.substring(0, 20)}...`
              : videoTitle}
          </h3>
          <svg
            className={`w-6 h-6 text-white transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Bookmarks Dropdown Content */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto bg-zinc-800/90 rounded-b-lg border border-zinc-700 shadow-lg">
            {bookmarks.map((bookmark) => (
              <div className="flex items-center justify-between w-full p-4 border-t border-zinc-800 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer">
                <span className="text-white font-medium truncate">
                  {bookmark.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white bg-[#ff0042] rounded-full px-3 py-1 text-sm shadow-sm">
                    {formatTime(bookmark.time)}
                  </span>
                  <Dropdown
                    key={bookmark.id}
                    overlay={getBookmarkMenu(bookmark)}
                    trigger={["hover"]}>
                    <span>
                      <CiMenuKebab className="text-2xl cursor-pointer" />
                    </span>
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

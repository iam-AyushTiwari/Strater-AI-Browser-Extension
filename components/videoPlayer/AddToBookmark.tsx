import { Button, Input, message, Popover, Tooltip } from "antd"
import { Bookmark } from "lucide-react"
import React, { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { sendToBackground } from "@plasmohq/messaging"

interface BookmarkData {
  id: string
  videoTitle: string
  videoId: string
  name: string
  time: number
  createdAt: string
}

const BookmarkPopover = ({ onAddBookmark }) => {
  const [bookmarkName, setBookmarkName] = useState("")
  const videoElement = document.querySelector("video")
  const videoTitleParentDiv = (document.querySelector(".style-scope ytd-watch-metadata").childNodes[3] as HTMLElement)
  const videoTitle = (videoTitleParentDiv.children[0].children[1] as HTMLElement).innerText

  if (videoElement) {
    videoElement.pause()
  }

  const handleAddBookmark = () => {
    if (bookmarkName.trim()) {
      console.log("Bookmark trying to add: and video Title parent div ", bookmarkName,videoTitle)
      onAddBookmark(bookmarkName,videoTitle)
      setBookmarkName("")
    }
  }

  const handleInputKeyDown = (e) => {
    e.stopPropagation()
  }

  const handlePopoverClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className="p-4 flex flex-col gap-4" onClick={handlePopoverClick}>
      <h1 className="font-semibold">Add to Bookmark</h1>
      <input
        className="bg-zinc-950 text-xl text-white px-4 py-4 rounded-xl focus:outline-none"
        type="text"
        placeholder="Your Bookmark Name"
        value={bookmarkName}
        onChange={(e) => setBookmarkName(e.target.value)}
        onKeyDown={handleInputKeyDown}
      />
      <Button type="primary" block onClick={handleAddBookmark}>
        Add to Bookmark
      </Button>
    </div>
  )
}

const AddToBookmark = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  const videoElement = document.querySelector("video")

  const getCurrentVideoId = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("v")
  }

  
  const getCurrentVideoTime = () => {
    const videoElement = document.querySelector("video")
    return videoElement ? Math.floor(videoElement.currentTime) : 0
  }

  const addBookmark = async (bookmarkName: string, videoTitle: string) => {
    const bookmarkData: BookmarkData = {
      id: uuidv4(),
      videoId: getCurrentVideoId(),
      videoTitle: videoTitle,
      name: bookmarkName,
      time: getCurrentVideoTime(),
      createdAt: new Date().toISOString()
    }

    console.log("Bookmark trying to add -- Function called: ", bookmarkData)

    try {
      const response = await sendToBackground({
        name: "bookmark",
        body: {
          action: "ADD_BOOKMARK",
          data: bookmarkData
        }
      })

      if (response.success) {
        messageApi.success("Bookmark added successfully")
        console.log("Bookmark added successfully", response.data)
        setIsTooltipVisible(false)
        if (videoElement) {
          videoElement.play()
        }
      } else {
        messageApi.error("Failed to add bookmark")
        console.log("Failed to add bookmark:", response.error)
      }
    } catch (error) {
      messageApi.error("An error occurred while adding the bookmark")
      console.log("Error adding bookmark:", error)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="p-2 text-white flex justify-center items-center h-full">
        <Tooltip
          title={<BookmarkPopover onAddBookmark={addBookmark} />}
          trigger={"click"}
          visible={isTooltipVisible}
          onVisibleChange={setIsTooltipVisible}
          placement="top"
          getTooltipContainer={() =>
            // @ts-ignore
            document.getElementById("take-bookmark-csui")?.shadowRoot
          }
          color="#282828">
          <Tooltip
            placement="top"
            title="Add to bookmark"
            // visible={!isTooltipVisible}
            className="cursor-pointer flex justify-center items-center mt-3 mx-2">
            <Bookmark size={24} onClick={() => setIsTooltipVisible(true)} />
          </Tooltip>
        </Tooltip>
      </div>
    </>
  )
}

export default AddToBookmark

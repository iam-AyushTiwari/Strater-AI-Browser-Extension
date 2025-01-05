import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

const ContentScript = () => {
  const [isFocusMode, setisFocusMode] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchFocusMode = async (): Promise<void> => {
      const storedFocusMode = (await storage.get("isFocusMode")) as
        | boolean
        | undefined
      setisFocusMode(storedFocusMode !== undefined ? storedFocusMode : false)
      console.log("storage *****: ", storedFocusMode)
    }

    fetchFocusMode()

    const handleMutation = (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const getTheFeed = document.querySelector(
            "#primary .ytd-two-column-browse-results-renderer"
          )
          const watchFeed = document.querySelector(
            "#secondary .ytd-watch-flexy"
          )
          if (getTheFeed) {
            if (isFocusMode) {
              ;(getTheFeed as HTMLElement).style.display = "none" // Hide the feed
            } else {
              ;(getTheFeed as HTMLElement).style.display = "" // Reset display
            }
          }
          if (watchFeed) {
            if (isFocusMode) {
              ;(watchFeed as HTMLElement).style.display = "none" // Hide the feed
            } else {
              ;(watchFeed as HTMLElement).style.display = "" // Reset display
            }
          }
        }
      }
    }

    const observer = new MutationObserver(handleMutation)

    const observeTarget = document.body // Observe changes in the body
    observer.observe(observeTarget, {
      childList: true,
      subtree: true // Observe changes in child nodes as well
    })

    return () => {
      observer.disconnect() // Clean up observer on unmount
    }
  }, [isFocusMode])

  return null
}

export default ContentScript

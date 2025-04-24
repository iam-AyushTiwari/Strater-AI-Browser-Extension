import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}
//all setting take change effect from this file
const ContentScript = () => {
  const [isFocusMode, setisFocusMode] = useState<boolean | null>(null)
  const [isShortsDisabled, setIsShortsDisabled] = useState<boolean>(null)
  const [isVideoRecommendationsDisabled, setIsVideoRecommendationsDisabled] =
    useState<boolean>(null)
  const [isCommentDisabled, setIsCommentDisabled] = useState<boolean>(null)

  useEffect(() => {
    const fetchFocusMode = async (): Promise<void> => {
      const storedFocusMode = (await storage.get("isFocusMode")) as
        | boolean
        | undefined
      const storedShortsDisabled = (await storage.get("isShortsDisabled")) as
        | boolean
        | undefined
      const storedVideoRecommendationsDisabled = (await storage.get(
        "isVideoRecommendationsDisabled"
      )) as boolean | undefined
      const storedCommentDisabled = (await storage.get("isCommentDisabled")) as
        | boolean
        | undefined
      setIsShortsDisabled(
        storedShortsDisabled !== undefined ? storedShortsDisabled : false
      )
      setIsVideoRecommendationsDisabled(
        storedVideoRecommendationsDisabled !== undefined
          ? storedVideoRecommendationsDisabled
          : false
      )
      setIsCommentDisabled(
        storedCommentDisabled !== undefined ? storedCommentDisabled : false
      )

      setisFocusMode(storedFocusMode !== undefined ? storedFocusMode : false)
      const shortsFeed = document.querySelector(
        "#content .ytd-rich-section-renderer"
      )
      let shortButton
      if (isShortsDisabled) {
       shortButton =
          (document.querySelector("#sections").firstChild as HTMLElement).lastElementChild
            .childNodes[1]
           ;(shortButton as HTMLElement).style.display = 'none';
      }
      console.log(
        "storage *****: ",
        storedFocusMode,
        storedShortsDisabled,
        storedVideoRecommendationsDisabled,
        storedCommentDisabled,
        storedVideoRecommendationsDisabled,
        shortButton
      )
    }

    const reload = () => {
      //reload youtube
      window.location.reload()
    }

    //watch storage change
    storage.watch({
      isFocusMode: () => {reload()},
      isShortsDisabled: () => {reload()},
      isVideoRecommendationsDisabled: () => {reload()},
      isCommentDisabled: () => {reload()},
    })

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
          const shortsFeed = document.querySelector(
            "#content .ytd-rich-section-renderer"
          )

          // const commentFeed = document.querySelector(
          //   "#comments"
          // )
          if (getTheFeed) {
            if (isFocusMode) {
              ;(getTheFeed as HTMLElement).style.display = "none" // Hide the feed
            } else {
              ;(getTheFeed as HTMLElement).style.display = "" // Reset display
            }
          }
          if (watchFeed) {
            if (isVideoRecommendationsDisabled) {
              ;(watchFeed as HTMLElement).style.display = "none" // Hide the feed
            } else {
              ;(watchFeed as HTMLElement).style.display = "" // Reset display
            }
          }
          // if (shortsFeed) {
          //   if (isShortsDisabled) {
          //     ;(shortsFeed as HTMLElement).style.display = "none" // Hide the feed
          //   } else {
          //     ;(shortsFeed as HTMLElement).style.display = "" // Reset display
          //   }
          // }
          // if (commentFeed) {
          //   if (isCommentDisabled) {
          //     ;(commentFeed as HTMLElement).style.display = "none" // Hide the feed
          //   } else {
          //     ;(commentFeed as HTMLElement).style.display = "" // Reset display
          //   }
          // }
        }
      }
    }
    const commentsObserver = new MutationObserver((mutations) => {
      const commentFeed = document.querySelector("#comments")
      if (commentFeed) {
        console.log("Comments section finally found!", commentFeed)
        if (isCommentDisabled) {
          ;(commentFeed as HTMLElement).style.display = "none"
        } else {
          ;(commentFeed as HTMLElement).style.display = ""
        }
        // Optionally disconnect once found
        commentsObserver.disconnect()
      }
    })

    const hideShortsFeed = new MutationObserver((_) => {
      const shortsFeed = document.querySelectorAll(
        "#content .ytd-rich-section-renderer"
      )
      if (shortsFeed.length > 0) {
        // console.log("Shorts feed found!",shortsFeed)
        if (isShortsDisabled) {
          shortsFeed.forEach((element) => {
            ;(element as HTMLElement).style.display = "none"
          })
        } else {
          shortsFeed.forEach((element) => {
            ;(element as HTMLElement).style.display = ""
          })
        }
      }
    })

    hideShortsFeed.observe(document.body, {
      childList: true,
      subtree: true
    })

    commentsObserver.observe(document.body, {
      childList: true,
      subtree: true
    })

    const observer = new MutationObserver(handleMutation)

    const observeTarget = document.body // Observe changes in the body
    observer.observe(observeTarget, {
      childList: true,
      subtree: true // Observe changes in child nodes as well
    })

    return () => {
      observer.disconnect() // Clean up observer on unmount
    }
  }, [
    isFocusMode,
    isShortsDisabled,
    isVideoRecommendationsDisabled,
    isCommentDisabled
  ])

  return null
}

export default ContentScript

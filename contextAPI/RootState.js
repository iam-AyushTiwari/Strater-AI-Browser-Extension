import React, { createContext, useContext, useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const RootStateContext = createContext()

const storage = new Storage()

export const RootStateProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isShortsDisabled, setIsShortsDisabled] = useState(false)
  const [isVideoRecommendationsDisabled, setIsVideoRecommendationsDisabled] = useState(false)
  const [isCommentDisabled,setIsCommentDisabled] = useState(false)
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [
          focusMode,
          shortsDisabled,
          videoRecDisabled,
          commentDisabled
        ] = await Promise.all([
          storage.get("isFocusMode"),
          storage.get("isShortsDisabled"),
          storage.get("isVideoRecommendationsDisabled"),
          storage.get("isCommentDisabled")
        ])

        setIsFocusMode(focusMode ?? false)
        setIsShortsDisabled(shortsDisabled ?? false)
        setIsVideoRecommendationsDisabled(videoRecDisabled ?? false)
        setIsCommentDisabled(commentDisabled ?? false)
      } catch (error) {
        console.error("Error loading settings:", error)
      }
      
    }
    fetchSettings()
  }, [])

  toggleLoading = () => {
    setIsLoading(!isLoading)
  }

  const toggleFocusMode = async () => {
    const newFocusMode = !isFocusMode
    setIsFocusMode(newFocusMode)
    await storage.set("isFocusMode", newFocusMode)
    // window.location.reload() // Reload to reflect changes
  }

  const toggleShortsDisabled = async () => {
    const newShortsDisabled = !isShortsDisabled
    setIsShortsDisabled(newShortsDisabled)
    await storage.set("isShortsDisabled", newShortsDisabled)
    // window.location.reload() // Reload to reflect changes
  }

  const toggleVideoRecommendationsDisabled = async () => {
    const newVideoRecommendationsDisabled = !isVideoRecommendationsDisabled
    setIsVideoRecommendationsDisabled(newVideoRecommendationsDisabled)
    await storage.set("isVideoRecommendationsDisabled", newVideoRecommendationsDisabled)
    // window.location.reload() // Reload to reflect changes
  }
  const toggleCommentDisabled = async () => {
    const newCommentDisabled = !isCommentDisabled
    setIsCommentDisabled(newCommentDisabled)
    await storage.set("isCommentDisabled", newCommentDisabled)
    // window.location.reload() // Reload to reflect changes
  }

  

  toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <RootStateContext.Provider
      value={{
        isLoading,
        isFocusMode,
        isShortsDisabled,
        isVideoRecommendationsDisabled,
        isCommentDisabled,
        theme,
        toggleLoading,
        toggleFocusMode,
        toggleShortsDisabled,
        toggleVideoRecommendationsDisabled,
        toggleCommentDisabled,
        toggleTheme
      }}>
      {children}
    </RootStateContext.Provider>
  )
}

export const useRootContext = () => {
  const context = useContext(RootStateContext)
  if (!context) {
    throw new Error("useRootContext must be used within a RootStateProvider")
  }
  return context
}

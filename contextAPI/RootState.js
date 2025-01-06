import React, { createContext, useContext, useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const RootStateContext = createContext()

const storage = new Storage()

export const RootStateProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(true)
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const fetchFocusMode = async () => {
      const storedFocusMode = await storage.get("isFocusMode")
      if (storedFocusMode) {
        await setIsFocusMode(storedFocusMode)
      } else {
        setIsFocusMode(false)
      }
    }
    fetchFocusMode()
  }, [])

  toggleLoading = () => {
    setIsLoading(!isLoading)
  }

  const toggleFocusMode = async () => {
    const newFocusMode = !isFocusMode
    setIsFocusMode(newFocusMode)
    await storage.set("isFocusMode", newFocusMode)
    window.location.reload() // Reload to reflect changes
  }

  toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <RootStateContext.Provider
      value={{
        isLoading,
        isFocusMode,
        theme,
        toggleLoading,
        toggleFocusMode,
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

import React, { createContext, useContext, useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

const RootStateContext = createContext()

const storage = new Storage()

export const RootStateProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(true)
  const [theme, setTheme] = useState("light")
  const [treeData, setTreeData] = useState([])
  const [localTreeData, setLocalTreeData] = useState([])

  useEffect(() => {
    const fetchFocusMode = async () => {
      const storedFocusMode = await storage.get("isFocusMode")
      const storedTreeData = await storage.get("treeData");
      setLocalTreeData(storedTreeData ?? [])
      if (storedFocusMode) {
        await setIsFocusMode(storedFocusMode)
      } else {
        setIsFocusMode(false)
      }
    }

    fetchFocusMode()
    setLocalTreeData(storage.get("treeData"))
  }, [])

  useEffect(() => {
    if (treeData.length > 0) {
      storage.set("treeData", treeData);
    }
  }, [treeData]);



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
        toggleTheme,
        treeData,
        setTreeData,
        localTreeData,

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

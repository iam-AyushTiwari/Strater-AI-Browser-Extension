import React, { createContext, useContext, useState } from "react"

const RootStateContext = createContext()

export const RootStateProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFocusMode, setisFocusMode] = useState(false)
  const [theme, setTheme] = useState("light")

  toggleLoading = () => {
    setIsLoading(!isLoading)
  }

  toggleFocusMode = () => {
    setisFocusMode(!isFocusMode)
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

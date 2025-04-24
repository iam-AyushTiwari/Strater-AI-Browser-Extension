import { createContext, useContext, useEffect, useState } from "react"

const MainContext = createContext<{
  user: null | any
  capsules: any[]
  notesFolder: any[]
  chatBotVisible: boolean
  setUser: (user: any) => void
  setCapsules: (capsules: any[]) => void
  setNotesFolder: (notesFolder: any[]) => void
  setChatBotVisible: (chatBotVisible: boolean) => void
}>({
  user: null,
  capsules: [],
  notesFolder: [],
  chatBotVisible: false,
  setUser: () => {},
  setCapsules: () => {},
  setNotesFolder: () => {},
  setChatBotVisible: () => {}
})

const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | any>(null)
  const [capsules, setCapsules] = useState<any[]>([])
  const [notesFolder, setNotesFolder] = useState<any[]>([])
  const [chatBotVisible, setChatBotVisible] = useState<boolean>(false)

  return (
    <MainContext.Provider
      value={{
        user,
        capsules,
        notesFolder,
        chatBotVisible,
        setUser,
        setCapsules,
        setNotesFolder,
        setChatBotVisible
      }}>
      {children}
    </MainContext.Provider>
  )
}

const useMainContext = () => useContext(MainContext)

export { MainContextProvider, useMainContext }

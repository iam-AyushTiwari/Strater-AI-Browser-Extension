import { createContext, useContext, useEffect, useState } from "react"

const MainContext = createContext<{
  user: null | any
  capsules: any[]
  notesFolder: any[]
  setUser: (user: any) => void
  setCapsules: (capsules: any[]) => void
  setNotesFolder: (notesFolder: any[]) => void
}>({
  user: null,
  capsules: [],
  notesFolder: [],
  setUser: () => {},
  setCapsules: () => {},
  setNotesFolder: () => {}
})

const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | any>(null)
  const [capsules, setCapsules] = useState<any[]>([])
  const [notesFolder, setNotesFolder] = useState<any[]>([])

  return (
    <MainContext.Provider
      value={{
        user,
        capsules,
        notesFolder,
        setUser,
        setCapsules,
        setNotesFolder
      }}>
      {children}
    </MainContext.Provider>
  )
}

const useMainContext = () => useContext(MainContext)

export { MainContextProvider, useMainContext }

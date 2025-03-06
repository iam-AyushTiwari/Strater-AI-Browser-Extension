import { useMainContext } from "contextAPI/MainContext"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

const storage = new Storage()

const Root = () => {
  const { user, setUser, capsules, setCapsules, notesFolder, setNotesFolder } =
    useMainContext()

  useEffect(() => {
    console.log("Context Updated: **", user)
  }, [user])

  useEffect(() => {
    const fetchUser = async () => {
      const response = await sendToBackground({
        name: "fetch-user",
        body: {}
      })
      if (response) {
        console.log("user from the background: ", response)
      }
    }

    fetchUser()
    // const fetchUser = async () => {
    //   const isUser = (await storage.get("user")) as any | undefined
    //   if (isUser !== undefined) {
    //     setUser(isUser)
    //     console.log("user in the storage: ", isUser)
    //   } else {
    //     setUser(null)
    //   }
    // }
    // fetchUser()
  }, [])
  return null
}

export default Root

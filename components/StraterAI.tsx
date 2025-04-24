import { Tooltip } from "antd"
import { useMainContext } from "contextAPI/MainContext"
import React, { useEffect } from "react"

// @ts-ignore
import logo from "../assets/icon.png"
import Providers from "./Providers"

const StraterAI = () => {
  const { chatBotVisible, setChatBotVisible } = useMainContext()

  return (
    <div>
      <Tooltip title={"AI Campanion"} placement="left">
        <div className="fixed bottom-0 right-0 mb-6 mr-6">
          <button
            className="bg-gradient-to-r from-[#FF0042] to-[#FF0042]/90 hover:from-[#FF0042] hover:to-[#FF0042]/70 text-white rounded-full p-4 drop-shadow-md transition-all"
            onClick={() => setChatBotVisible(!chatBotVisible)}>
            <img
              src={logo}
              alt="Strater AI"
              className="h-8 w-8 rounded-full border-2 border-white"
            />
          </button>
        </div>
      </Tooltip>
    </div>
  )
}

export default StraterAI
